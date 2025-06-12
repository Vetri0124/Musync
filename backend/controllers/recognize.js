const Song = require('../models/Song');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');
const FormData = require('form-data');

// Helper function to build ACRCloud signature
function buildACRCloudSignature(httpMethod, httpUri, accessKey, accessSecret, dataType, signatureVersion, timestamp) {
    const stringToSign = [
        httpMethod,
        httpUri,
        accessKey,
        dataType,
        signatureVersion,
        timestamp
    ].join('\n');

    const hmac = crypto.createHmac('sha1', accessSecret);
    hmac.update(stringToSign);
    return hmac.digest('base64');
}

// @desc    Recognize song
// @route   POST /api/recognize
// @access  Private
exports.recognizeSong = asyncHandler(async (req, res, next) => {
    console.log('Recognize song endpoint hit (ACRCloud integration).');

    if (!req.files || !req.files.audio) {
        console.error('No audio file uploaded.');
        return next(new ErrorResponse('Please upload an audio file', 400));
    }

    const audioFile = req.files.audio;
    console.log(`Received audio file: ${audioFile.name}, MimeType: ${audioFile.mimetype}, Size: ${audioFile.size} bytes`);
    console.log(`Temporary file path: ${audioFile.tempFilePath}`);

    if (!audioFile.mimetype.startsWith('audio')) {
        console.error(`Invalid file type: ${audioFile.mimetype}`);
        if (audioFile.tempFilePath && fs.existsSync(audioFile.tempFilePath)) {
            fs.unlinkSync(audioFile.tempFilePath);
            console.log(`Cleaned up temp file: ${audioFile.tempFilePath}`);
        }
        return next(new ErrorResponse('Please upload an audio file', 400));
    }

    const maxSize = process.env.MAX_FILE_UPLOAD || 10 * 1024 * 1024;
    if (audioFile.size > maxSize) {
        console.error(`File size too large: ${audioFile.size} bytes`);
        if (audioFile.tempFilePath && fs.existsSync(audioFile.tempFilePath)) {
            fs.unlinkSync(audioFile.tempFilePath);
            console.log(`Cleaned up temp file: ${audioFile.tempFilePath}`);
        }
        return next(
            new ErrorResponse(`Please upload an audio file less than ${maxSize / (1024 * 1024)}MB`, 400)
        );
    }

    let acrcloudResponseData = null;
    try {
        const acrcloudHost = process.env.ACRCLOUD_HOST;
        const acrcloudAccessKey = process.env.ACRCLOUD_ACCESS_KEY;
        const acrcloudAccessSecret = process.env.ACRCLOUD_ACCESS_SECRET;

        if (!acrcloudHost || !acrcloudAccessKey || !acrcloudAccessSecret) {
            console.error('ACRCloud API keys are not fully set in environment variables.');
            throw new ErrorResponse('Server configuration error: ACRCloud API keys missing.', 500);
        }

        const httpMethod = 'POST';
        const httpUri = '/v1/identify';
        const dataType = 'audio';
        const signatureVersion = '1';
        const timestamp = Date.now().toString();

        const signature = buildACRCloudSignature(
            httpMethod,
            httpUri,
            acrcloudAccessKey,
            acrcloudAccessSecret,
            dataType,
            signatureVersion,
            timestamp
        );

        const formData = new FormData();
        formData.append('access_key', acrcloudAccessKey);
        formData.append('sample_bytes', audioFile.size);
        formData.append('sample', fs.createReadStream(audioFile.tempFilePath), {
            filename: audioFile.name,
            contentType: audioFile.mimetype,
        });
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('data_type', dataType);
        formData.append('signature_version', signatureVersion);

        console.log(`[ACRCloud] Sending audio to ACRCloud API at https://${acrcloudHost}${httpUri}...`);
        const acrcloudResponse = await axios.post(`https://${acrcloudHost}${httpUri}`, formData, {
            headers: {
                ...formData.getHeaders(),
                'Accept': 'application/json'
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        acrcloudResponseData = acrcloudResponse.data;
        console.log('[ACRCloud] ACRCloud API response received:', JSON.stringify(acrcloudResponseData, null, 2));

        if (acrcloudResponseData.status.code !== 0) {
            if (acrcloudResponseData.status.code === 1001) {
                console.log('[ACRCloud] No match found by ACRCloud API (Code 1001).');
                return res.status(200).json({
                    success: true,
                    data: null,
                    message: 'No matching song found via ACRCloud recognition service.'
                });
            } else {
                console.error('[ACRCloud] ACRCloud API returned an error:', acrcloudResponseData.status.msg);
                throw new ErrorResponse(`ACRCloud API error: ${acrcloudResponseData.status.msg}`, 500);
            }
        }
        if (!acrcloudResponseData.metadata || !acrcloudResponseData.metadata.music || acrcloudResponseData.metadata.music.length === 0) {
            console.warn('[ACRCloud] Unexpected: Status code 0 but no music metadata found.');
            return res.status(200).json({
                success: true,
                data: null,
                message: 'No matching song found via ACRCloud recognition service.'
            });
        }

    } catch (acrcloudError) {
        console.error('Error calling ACRCloud API:', acrcloudError);
        if (audioFile.tempFilePath && fs.existsSync(audioFile.tempFilePath)) {
            fs.unlinkSync(audioFile.tempFilePath);
            console.log(`Cleaned up temp file: ${audioFile.tempFilePath}`);
        }
        if (acrcloudError.response) {
            console.error('ACRCloud API Response Data:', acrcloudError.response.data);
            console.error('ACRCloud API Response Status:', acrcloudError.response.status);
            const statusCode = acrcloudError.response.status || 500;
            return next(new ErrorResponse(`ACRCloud API error: ${statusCode} - ${JSON.stringify(acrcloudError.response.data)}`, statusCode));
        }
        return next(new ErrorResponse('Failed to recognize audio with ACRCloud API.', 500));
    } finally {
        if (audioFile.tempFilePath && fs.existsSync(audioFile.tempFilePath)) {
            fs.unlinkSync(audioFile.tempFilePath);
            console.log(`Cleaned up temp file: ${audioFile.tempFilePath}`);
        }
    }

    // Process ACRCloud's successful recognition result (status.code === 0)
    const recognizedTrack = acrcloudResponseData.metadata.music[0];

    // Extract necessary data, including duration and audioFingerprint (acrid)
    const title = recognizedTrack.title;
    const artist = recognizedTrack.artists ? recognizedTrack.artists.map(a => a.name).join(', ') : 'Unknown Artist';
    const album = recognizedTrack.album ? recognizedTrack.album.name : null;
    const releaseDate = recognizedTrack.release_date; // This is a string like "2008-01-01"
    const genre = recognizedTrack.genres && recognizedTrack.genres.length > 0 ? recognizedTrack.genres[0].name : null; // Your schema has a single 'genre' string
    const year = releaseDate ? parseInt(releaseDate.substring(0, 4)) : null; // Extract year from releaseDate
    const duration = recognizedTrack.duration_ms; // ACRCloud provides duration in milliseconds
    const audioFingerprint = recognizedTrack.acrid; // Use ACRCloud's acrid as the fingerprint

    // Extracting external URLs for comprehensive data (matching your SongSchema)
    const spotifyUrl = recognizedTrack.external_metadata?.spotify?.external_urls?.spotify || null;
    const appleMusicUrl = recognizedTrack.external_metadata?.apple_music?.external_urls?.apple_music || null;
    const youtubeUrl = recognizedTrack.external_metadata?.youtube?.vid ? `https://www.youtube.com/watch?v=${recognizedTrack.external_metadata.youtube.vid}` : null;
    const coverImage = recognizedTrack.album?.cover || recognizedTrack.external_metadata?.spotify?.album?.images?.[0]?.url || 'default.jpg';


    console.log(`ACRCloud matched: ${title} by ${artist}`);

    // === Add to user's history and save song to database ===
    let songInDb = null;
    if (req.user) {
        try {
            // Try to find the song by its audioFingerprint (ACRCloud ID)
            songInDb = await Song.findOne({ audioFingerprint: audioFingerprint });

            if (!songInDb) {
                // If the song doesn't exist, create it with all the extracted data
                songInDb = await Song.create({
                    title: title,
                    artist: artist,
                    album: album,
                    genre: genre, // Use the extracted genre
                    year: year, // Use the extracted year
                    duration: duration, // CRUCIAL: Pass duration
                    audioFingerprint: audioFingerprint, // CRUCIAL: Pass audioFingerprint
                    coverImage: coverImage, // Pass cover image URL
                    spotifyUrl: spotifyUrl,
                    appleMusicUrl: appleMusicUrl,
                    youtubeUrl: youtubeUrl,
                });
                console.log('New song added to local database from ACRCloud recognition.');
            } else {
                console.log('Song already exists in local database.');
                // Optionally update existing song details if they are outdated, though usually not needed if found by fingerprint
                // For example:
                // songInDb.set({
                //     album: album,
                //     genre: genre,
                //     year: year,
                //     coverImage: coverImage,
                //     spotifyUrl: spotifyUrl,
                //     appleMusicUrl: appleMusicUrl,
                //     youtubeUrl: youtubeUrl,
                // });
                // await songInDb.save();
            }

            // Add the recognized song to the user's history
            await User.findByIdAndUpdate(req.user.id, {
                $push: {
                    history: {
                        song: songInDb._id,
                        recognizedAt: Date.now()
                    }
                }
            });
            console.log('Song added to user history.');
        } catch (historyError) {
            console.error('Error adding song to user history or finding/creating song in DB:', historyError.message);
            // Pass the validation error or other DB errors to the global error handler
            return next(historyError);
        }
    }

    // Prepare response for frontend - ensure all fields match what frontend expects
    res.status(200).json({
        success: true,
        data: {
            title: title,
            artist: artist,
            album: album,
            genre: genre, // Include genre
            year: year, // Include year
            duration: duration, // Include duration
            audioFingerprint: audioFingerprint, // Include fingerprint
            coverImage: coverImage, // Include coverImage
            spotifyUrl: spotifyUrl,
            appleMusicUrl: appleMusicUrl,
            youtubeUrl: youtubeUrl,
            // ACRCloud-specific metadata that might be useful
            release_date: releaseDate,
            label: recognizedTrack.label || null,
            timecode: acrcloudResponseData.metadata.timestamp_s,
            acrcloudInfo: acrcloudResponseData // Full ACRCloud response if needed for debug/details
        },
        message: 'Song recognized by ACRCloud!'
    });
});