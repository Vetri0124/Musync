const Song = require('../models/Song');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const axios = require('axios');

// @desc    Get all songs (from your local DB, potentially with advanced results)
// @route   GET /api/songs
// @access  Public
exports.getSongs = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Get single song (from your local DB)
// @route   GET /api/songs/:id
// @access  Public
exports.getSong = asyncHandler(async (req, res, next) => {
    const song = await Song.findById(req.params.id);

    if (!song) {
        return next(
            new ErrorResponse(`Song not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: song
    });
});

// @desc    Create new song (to your local DB)
// @route   POST /api/songs
// @access  Private/Admin
exports.createSong = asyncHandler(async (req, res, next) => {
    const song = await Song.create(req.body);

    res.status(201).json({
        success: true,
        data: song
    });
});

// @desc    Update song (in your local DB)
// @route   PUT /api/songs/:id
// @access  Private/Admin
exports.updateSong = asyncHandler(async (req, res, next) => {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!song) {
        return next(
            new ErrorResponse(`Song not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: song
    });
});

// @desc    Delete song (from your local DB)
// @route   DELETE /api/songs/:id
// @access  Private/Admin
exports.deleteSong = asyncHandler(async (req, res, next) => {
    const song = await Song.findByIdAndDelete(req.params.id);

    if (!song) {
        return next(
            new ErrorResponse(`Song not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Search songs using Last.fm API
// @route   GET /api/songs/search
// @access  Public
exports.searchSongs = asyncHandler(async (req, res, next) => {
    console.log('--- searchSongs controller hit! ---'); // <--- ADDED
    const query = req.query.search;

    if (!query) {
        return next(new ErrorResponse('Please provide a search query', 400));
    }

    // --- ADD THESE CONSOLE.LOGS ---
    console.log('LASTFM_API_KEY from process.env:', process.env.LASTFM_API_KEY);
    const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
    const LASTFM_BASE_URL = 'http://ws.audioscrobbler.com/2.0/';

    const lastfmUrl = `${LASTFM_BASE_URL}?method=track.search&track=${encodeURIComponent(query)}&api_key=${LASTFM_API_KEY}&format=json`;
    console.log('Constructed Last.fm API Request URL:', lastfmUrl);
    // --- END ADDED CONSOLE.LOGS ---

    try {
        const response = await axios.get(lastfmUrl);
        const data = response.data;

        // --- ADD THESE CONSOLE.LOGS ---
        console.log('Raw Last.fm API Response Data:', JSON.stringify(data, null, 2)); // Stringify for readability
        // --- END ADDED CONSOLE.LOGS ---

        const tracks = data?.results?.trackmatches?.track;

        // --- ADD THESE CONSOLE.LOGS ---
        console.log('Parsed tracks array from Last.fm response:', tracks);
        // --- END ADDED CONSOLE.LOGS ---

        if (!tracks || tracks.length === 0) {
            console.log('No tracks found or tracks array is empty from Last.fm.'); // <--- ADDED
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
                message: 'No songs found on Last.fm for your search.'
            });
        }

        const formattedResults = tracks.map(track => ({
            _id: track.mbid || `${track.artist.name || track.artist}-${track.name}`,
            title: track.name,
            artist: track.artist.name || track.artist,
            albumCover: (track.image && track.image.length > 0) ?
                        track.image.find(img => img.size === 'extralarge' || img.size === 'large' || img.size === 'medium')?.['#text'] || null : null,
            url: track.url,
            listeners: track.listeners ? parseInt(track.listeners) : 0,
            playcount: track.playcount ? parseInt(track.playcount) : 0
        }));

        // --- ADD THESE CONSOLE.LOGS ---
        console.log('Final Formatted Results for Frontend:', formattedResults);
        // --- END ADDED CONSOLE.LOGS ---

        res.status(200).json({
            success: true,
            count: formattedResults.length,
            data: formattedResults
        });

    } catch (error) {
        console.error('Error fetching songs from Last.fm API:', error.message);
        if (error.response) {
            console.error('Last.fm API Response Error Data:', error.response.data);
            return next(new ErrorResponse(`Last.fm API Error: ${error.response.status} - ${error.response.data.message || 'Error from external API.'}`, error.response.status));
        } else if (error.request) {
            console.error('Last.fm API Request Error: No response received from Last.fm.');
            return next(new ErrorResponse('Could not connect to Last.fm API. Please check your internet connection or try again later.', 503));
        } else {
            console.error('Unexpected error during Last.fm API call setup:', error.message);
            return next(new ErrorResponse('An unexpected error occurred during song search.', 500));
        }
    }
});