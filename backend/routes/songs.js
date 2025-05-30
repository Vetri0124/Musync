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

router
  .route('/')
  .get(advancedResults(Song, ''), getSongs)
  .post(protect, authorize('admin'), createSong);

router
  .route('/:id')
  .get(getSong)
  .put(protect, authorize('admin'), updateSong)
  .delete(protect, authorize('admin'), deleteSong);

router.route('/search').get(searchSongs);

module.exports = router;