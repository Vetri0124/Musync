const express = require('express');
const { recognizeSong } = require('../controllers/recognize');
const { protect } = require('../middleware/auth');
// No need to require fileUpload here if you're using express-fileupload globally

const router = express.Router();

// Remove fileUpload.single('audio') from here.
// The file is already processed by the global express-fileupload middleware.
router.post('/', protect, recognizeSong);

module.exports = router;