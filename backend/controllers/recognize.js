const Song = require('../models/Song');
const User = require('../models/User');
const { createFingerprint } = require('../utils/audioProcessing');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Recognize song
// @route   POST /api/recognize
// @access  Private
exports.recognizeSong = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.audio) {
    return next(new ErrorResponse('Please upload an audio file', 400));
  }

  const audioFile = req.files.audio;

  // Check file type
  if (!audioFile.mimetype.startsWith('audio')) {
    return next(new ErrorResponse('Please upload an audio file', 400));
  }

  // Check file size
  const maxSize = process.env.MAX_FILE_UPLOAD || 10 * 1024 * 1024; // 10MB default
  if (audioFile.size > maxSize) {
    return next(
      new ErrorResponse(`Please upload an audio file less than ${maxSize}`, 400)
    );
  }

  // Create fingerprint
  const fingerprint = await createFingerprint(audioFile.tempFilePath);

  // Find matching song
  const song = await Song.findOne({ audioFingerprint: fingerprint });

  if (!song) {
    return res.status(200).json({
      success: true,
      data: null,
      message: 'No matching song found'
    });
  }

  // Add to user's history
  if (req.user) {
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        history: {
          song: song._id,
          recognizedAt: Date.now()
        }
      }
    });
  }

  res.status(200).json({
    success: true,
    data: song
  });
});