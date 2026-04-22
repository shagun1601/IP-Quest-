const User = require('../models/User');

// @desc    Get top users by XP
// @route   GET /api/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const users = await User.find()
      .sort('-xp')
      .limit(limit)
      .select('name school xp');

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
