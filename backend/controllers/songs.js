const Song = require('../models/Song');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
exports.getSongs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single song
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

// @desc    Create new song
// @route   POST /api/songs
// @access  Private/Admin
exports.createSong = asyncHandler(async (req, res, next) => {
  const song = await Song.create(req.body);

  res.status(201).json({
    success: true,
    data: song
  });
});

// @desc    Update song
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

// @desc    Delete song
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

// @desc    Search songs
// @route   GET /api/songs/search
// @access  Public
exports.searchSongs = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new ErrorResponse('Please provide a search query', 400));
  }

  const songs = await Song.find({ $text: { $search: q } });

  res.status(200).json({
    success: true,
    count: songs.length,
    data: songs
  });
});