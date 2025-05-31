// backend/routes/songs.js
const express = require('express');
const {
  getSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
  searchSongs
} = require('../controllers/songs');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Song = require('../models/Song');

const router = express.Router();

// Define the /api/songs/search route FIRST (most specific routes go first)
router.route('/search').get(searchSongs); // <--- THIS LINE MUST BE MOVED UP!

router
  .route('/')
  .get(advancedResults(Song, ''), getSongs)
  .post(protect, authorize('admin'), createSong);

router
  .route('/:id') // This more general route should come AFTER specific ones like /search
  .get(getSong)
  .put(protect, authorize('admin'), updateSong)
  .delete(protect, authorize('admin'), deleteSong);

module.exports = router;