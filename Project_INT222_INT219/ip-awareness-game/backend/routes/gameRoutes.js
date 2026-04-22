const express = require('express');
const { saveProgress, getProgress } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/progress')
  .post(protect, saveProgress)
  .get(protect, getProgress);

module.exports = router;
