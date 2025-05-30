const express = require('express');
const { recognizeSong } = require('../controllers/recognize');
const { protect } = require('../middleware/auth');
const fileUpload = require('../middleware/fileUpload');

const router = express.Router();

router.post('/', protect, fileUpload.single('audio'), recognizeSong);

module.exports = router;