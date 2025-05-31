const Song = require('../models/Song');
const User = require('../models/User');
const { createFingerprint } = require('../utils/audioProcessing'); // Assuming this is where your fingerprint logic is
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const axios = require('axios');
const fs = require('fs'); // Import Node.js File System module for cleanup

// @desc    Recognize song
// @route   POST /api/recognize
// @access  Private
exports.recognizeSong = asyncHandler(async (req, res, next) => {
    console.log('Recognize song endpoint hit.'); // ADDED LOG

    if (!req.files || !req.files.audio) {
        console.error('No audio file uploaded.'); // ADDED LOG
        return next(new ErrorResponse('Please upload an audio file', 400));
    }

    const audioFile = req.files.audio;
    console.log(`Received audio file: ${audioFile.name}, MimeType: ${audioFile.mimetype}, Size: ${audioFile.size} bytes`); // ADDED LOG
    console.log(`Temporary file path: ${audioFile.tempFilePath}`); // ADDED LOG

    // Check file type
    if (!audioFile.mimetype.startsWith('audio')) {
        console.error(`Invalid file type: ${audioFile.mimetype}`); // ADDED LOG
        return next(new ErrorResponse('Please upload an audio file', 400));
    }

    // Check file size
    const maxSize = process.env.MAX_FILE_UPLOAD || 10 * 1024 * 1024; // 10MB default
    if (audioFile.size > maxSize) {
        console.error(`File size too large: ${audioFile.size} bytes`); // ADDED LOG
        return next(
            new ErrorResponse(`Please upload an audio file less than ${maxSize / (1024 * 1024)}MB`, 400)
        );
    }

    let fingerprint;
    try {
        // Create fingerprint - This is where the issue might be
        // Ensure createFingerprint properly reads from the tempFilePath
        fingerprint = await createFingerprint(audioFile.tempFilePath);
        console.log('Audio fingerprint created successfully.'); // ADDED LOG
    } catch (fingerprintError) {
        console.error('Error creating audio fingerprint:', fingerprintError); // ADDED LOG
        // Clean up the temporary file if fingerprinting fails
        if (audioFile.tempFilePath && fs.existsSync(audioFile.tempFilePath)) {
            fs.unlinkSync(audioFile.tempFilePath);
            console.log(`Cleaned up temp file: ${audioFile.tempFilePath}`);
        }
        return next(new ErrorResponse('Failed to process audio for recognition.', 500));
    } finally {
        // CRITICAL: Clean up the temporary file after processing, regardless of success or failure
        // This prevents your /tmp/ or temp folder from filling up
        if (audioFile.tempFilePath && fs.existsSync(audioFile.tempFilePath)) {
            fs.unlinkSync(audioFile.tempFilePath);
            console.log(`Cleaned up temp file: ${audioFile.tempFilePath}`);
        }
    }


    // Find matching song in YOUR database based on the fingerprint
    const song = await Song.findOne({ audioFingerprint: fingerprint });

    if (!song) {
        console.log('No matching song found in local database.'); // ADDED LOG
        return res.status(200).json({
            success: true,
            data: null,
            message: 'No matching song found in your database'
        });
    }
    console.log(`Matching song found in DB: ${song.title} by ${song.artist}`); // ADDED LOG


    // === Last.fm Integration for Metadata Enrichment ===
    let lastfmData = null;
    try {
        const lastfmApiKey = process.env.LASTFM_API_KEY;
        if (!lastfmApiKey) {
            console.warn('LASTFM_API_KEY is not set. Cannot fetch Last.fm metadata.');
        } else {
            if (song.title && song.artist) {
                const lastfmResponse = await axios.get(`http://ws.audioscrobbler.com/2.0/`, {
                    params: {
                        method: 'track.getInfo',
                        artist: song.artist,
                        track: song.title,
                        api_key: lastfmApiKey,
                        format: 'json'
                    }
                });

                if (lastfmResponse.data && lastfmResponse.data.track) {
                    const trackInfo = lastfmResponse.data.track;
                    lastfmData = {
                        name: trackInfo.name,
                        artist: trackInfo.artist ? trackInfo.artist.name : 'N/A',
                        album: trackInfo.album ? trackInfo.album.title : 'N/A',
                        image: (trackInfo.album && trackInfo.album.image) ?
                               trackInfo.album.image.find(img => img.size === 'extralarge' || img.size === 'large' || img.size === 'medium' || img.size === 'small')?.['#text'] : null, // Added 'small' fallback
                        url: trackInfo.url,
                        tags: trackInfo.toptags && trackInfo.toptags.tag ? trackInfo.toptags.tag.map(tag => tag.name) : [],
                        previewUrl: trackInfo.url // Last.fm does NOT provide preview URLs. This will likely be null/undefined.
                                                  // You'll need a different API (e.g., Spotify, YouTube) for actual audio previews.
                    };
                    console.log('Last.fm metadata fetched successfully.'); // ADDED LOG
                } else {
                    console.warn(`Last.fm did not return track info for "${song.title}" by "${song.artist}".`);
                }
            } else {
                console.warn('Song found in database lacks title or artist for Last.fm lookup.');
            }
        }
    } catch (lastfmError) {
        console.error('Error fetching data from Last.fm:', lastfmError.message);
        if (lastfmError.response) {
            console.error('Last.fm API Error Response Data:', lastfmError.response.data);
            console.error('Last.fm API Error Response Status:', lastfmError.response.status);
        }
    }
    // === End Last.fm Integration ===

    // Add to user's history
    if (req.user) {
        try {
            await User.findByIdAndUpdate(req.user.id, {
                $push: {
                    history: {
                        song: song._id,
                        recognizedAt: Date.now()
                    }
                }
            });
            console.log('Song added to user history.'); // ADDED LOG
        } catch (historyError) {
            console.error('Error adding song to user history:', historyError); // ADDED LOG
        }
    }

    res.status(200).json({
        success: true,
        data: {
            ...song.toObject(),
            albumCover: lastfmData?.image || song.albumCover || null, // Prioritize Last.fm image, then local, then null
            previewUrl: lastfmData?.previewUrl || null, // Last.fm typically doesn't have this
            lastfmInfo: lastfmData
        },
        message: lastfmData ? 'Song recognized and enriched with Last.fm data' : 'Song recognized from database (Last.fm data not available)'
    });
});