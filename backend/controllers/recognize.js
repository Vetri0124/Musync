const Song = require('../models/Song'); // Still relevant if you save recognized songs
const User = require('../models/User');
// const { createFingerprint } = require('../utils/audioProcessing'); // <--- REMOVE OR COMMENT OUT THIS LINE if you haven't yet
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const axios = require('axios');
const fs = require('fs'); // Import Node.js File System module for cleanup
const crypto = require('crypto'); // Node.js built-in crypto module for signing
const FormData = require('form-data'); // Import FormData for sending multipart data

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
    console.log('Recognize song endpoint hit (ACRCloud integration).'); // Updated log

    if (!req.files || !req.files.audio) {
        console.error('No audio file uploaded.');
        return next(new ErrorResponse('Please upload an audio file', 400));
    }

    const audioFile = req.files.audio;
    console.log(`Received audio file: ${audioFile.name}, MimeType: ${audioFile.mimetype}, Size: ${audioFile.size} bytes`);
    console.log(`Temporary file path: ${audioFile.tempFilePath}`);

    // Check file type
    if (!audioFile.mimetype.startsWith('audio')) {
        console.error(`Invalid file type: ${audioFile.mimetype}`);
        if (audioFile.tempFilePath && fs.existsSync(audioFile.tempFilePath)) {
            fs.unlinkSync(audioFile.tempFilePath);
            console.log(`Cleaned up temp file: ${audioFile.tempFilePath}`);
        }
        return next(new ErrorResponse('Please upload an audio file', 400));
    }

    // Check file size (ACRCloud has limits, often around 15 seconds or specific file sizes for free tier)
    // You might need to adjust this based on ACRCloud's exact free tier limits for audio duration/size.
    const maxSize = process.env.MAX_FILE_UPLOAD || 10 * 1024 * 1024; // 10MB default
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
        const timestamp = Date.now().toString(); // Unix epoch time in milliseconds

        const signature = buildACRCloudSignature(
            httpMethod,
            httpUri,
            acrcloudAccessKey,
            acrcloudAccessSecret,
            dataType,
            signatureVersion,
            timestamp
        );

        // Create a FormData object to send the file and parameters
        const formData = new FormData();
        formData.append('access_key', acrcloudAccessKey);
        formData.append('sample_bytes', audioFile.size); // ACRCloud needs this for some reason
        formData.append('sample', fs.createReadStream(audioFile.tempFilePath), {
            filename: audioFile.name,
            contentType: audioFile.mimetype,
        });
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('data_type', dataType);
        formData.append('signature_version', signatureVersion);

        console.log(`[ACRCloud] Sending audio to ACRCloud API at ${acrcloudHost}${httpUri}...`);
        const acrcloudResponse = await axios.post(`https://${acrcloudHost}${httpUri}`, formData, {
            headers: {
                ...formData.getHeaders(), // Important for multipart/form-data
                'Accept': 'application/json'
            },
            maxContentLength: Infinity, // Allow large file uploads
            maxBodyLength: Infinity,    // Allow large file uploads
        });

        acrcloudResponseData = acrcloudResponse.data;
        console.log('[ACRCloud] ACRCloud API response received:', JSON.stringify(acrcloudResponseData, null, 2));

        // --- START OF THE FIX ---
        // Check for ACRCloud errors or no results
        if (acrcloudResponseData.status.code !== 0) {
            // Specifically check for 'No result' code (1001)
            if (acrcloudResponseData.status.code === 1001) {
                console.log('[ACRCloud] No match found by ACRCloud API (Code 1001).');
                return res.status(200).json({ // Return 200 OK for a successful "no match"
                    success: true,
                    data: null,
                    message: 'No matching song found via ACRCloud recognition service.'
                });
            } else {
                // For any other non-zero status code, treat it as an actual error from ACRCloud's side
                console.error('[ACRCloud] ACRCloud API returned an error:', acrcloudResponseData.status.msg);
                throw new ErrorResponse(`ACRCloud API error: ${acrcloudResponseData.status.msg}`, 500);
            }
        }
        // --- END OF THE FIX ---

        // If status.code IS 0, it means a match was found, so the code continues here.
        // The previous if (!acrcloudResponseData.metadata || ...) check was redundant
        // if status.code === 0, but it doesn't hurt. We can rely on code 0 for a match.
        // ACRCloud's API doc confirms that if code is 0, metadata.music will exist and have results.
        if (!acrcloudResponseData.metadata || !acrcloudResponseData.metadata.music || acrcloudResponseData.metadata.music.length === 0) {
            // This case should ideally not be hit if status.code is 0, but as a safeguard.
            console.warn('[ACRCloud] Unexpected: Status code 0 but no music metadata found.');
            return res.status(200).json({
                success: true,
                data: null,
                message: 'No matching song found via ACRCloud recognition service.'
            });
        }


    } catch (acrcloudError) {
        console.error('Error calling ACRCloud API:', acrcloudError);
        // Clean up the temporary file if ACRCloud call fails
        if (audioFile.tempFilePath && fs.existsSync(audioFile.tempFilePath)) {
            fs.unlinkSync(audioFile.tempFilePath);
            console.log(`Cleaned up temp file: ${audioFile.tempFilePath}`);
        }
        // If it's an axios error, check for response status for better error messages
        if (acrcloudError.response) {
            console.error('ACRCloud API Response Data:', acrcloudError.response.data);
            console.error('ACRCloud API Response Status:', acrcloudError.response.status);
            // Use ACRCloud's provided status or default to 500
            const statusCode = acrcloudError.response.status || 500;
            return next(new ErrorResponse(`ACRCloud API error: ${statusCode} - ${JSON.stringify(acrcloudError.response.data)}`, statusCode));
        }
        return next(new ErrorResponse('Failed to recognize audio with ACRCloud API.', 500));
    } finally {
        // CRITICAL: Clean up the temporary file after processing, regardless of success or failure
        if (audioFile.tempFilePath && fs.existsSync(audioFile.tempFilePath)) {
            fs.unlinkSync(audioFile.tempFilePath);
            console.log(`Cleaned up temp file: ${audioFile.tempFilePath}`);
        }
    }

    // Process ACRCloud's successful recognition result (status.code === 0)
    const recognizedTrack = acrcloudResponseData.metadata.music[0]; // Get the first (best) match
    const title = recognizedTrack.title;
    const artist = recognizedTrack.artists ? recognizedTrack.artists.map(a => a.name).join(', ') : 'Unknown Artist';

    console.log(`ACRCloud matched: ${title} by ${artist}`);

    // === Optional: Add to user's history (if you want to save recognized songs) ===
    let songInDb = null;
    if (req.user) {
        try {
            songInDb = await Song.findOne({ title: title, artist: artist });
            if (!songInDb) {
                 songInDb = await Song.create({
                     title: title,
                     artist: artist,
                     album: recognizedTrack.album ? recognizedTrack.album.name : null,
                     // Add other fields from ACRCloud's response if your Song model supports them
                 });
                 console.log('New song added to local database from ACRCloud recognition.');
            }
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
            console.error('Error adding song to user history or finding/creating song in DB:', historyError);
        }
    }

    // Prepare response for frontend
    res.status(200).json({
        success: true,
        data: {
            title: title,
            artist: artist,
            album: recognizedTrack.album ? recognizedTrack.album.name : null,
            release_date: recognizedTrack.release_date,
            label: recognizedTrack.label,
            timecode: acrcloudResponseData.metadata.timestamp_s, // Timecode of the match
            // ACRCloud provides various image sizes and external IDs for other services
            albumCover: recognizedTrack.album?.cover || recognizedTrack.external_metadata?.spotify?.album?.images?.[0]?.url || null,
            previewUrl: recognizedTrack.external_metadata?.spotify?.preview_url || recognizedTrack.external_metadata?.deezer?.preview || null,
            externalUrls: {
                spotify: recognizedTrack.external_metadata?.spotify?.external_urls?.spotify,
                deezer: recognizedTrack.external_metadata?.deezer?.link,
                youtube: recognizedTrack.external_metadata?.youtube?.vid
            },
            genres: recognizedTrack.genres ? recognizedTrack.genres.map(g => g.name) : [],
            // Include raw ACRCloud data if helpful for debugging or frontend logic
            acrcloudInfo: acrcloudResponseData
        },
        message: 'Song recognized by ACRCloud!'
    });
});