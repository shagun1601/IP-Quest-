const Progress = require('../models/Progress');
const User = require('../models/User');

// @desc    Save game progress
// @route   POST /api/game/progress
// @access  Private
exports.saveProgress = async (req, res) => {
  try {
    const { gameType, score, xpEarned, correctAnswers, totalQuestions } = req.body;

    // Create progress record
    const progress = await Progress.create({
      user: req.user.id,
      gameType,
      score,
      xpEarned,
      correctAnswers,
      totalQuestions
    });

    // Update user stats
    const user = await User.findById(req.user.id);
    user.xp += xpEarned;
    user.gamesPlayed += 1;
    if (correctAnswers) {
      user.correctAnswers += correctAnswers;
    }
    
    // Check achievements
    if (user.gamesPlayed >= 1 && !user.achievements.includes('first')) {
      user.achievements.push('first');
      user.xp += 50;
    }
    if (user.correctAnswers >= 5 && !user.achievements.includes('correct5')) {
      user.achievements.push('correct5');
      user.xp += 75;
    }
    if (user.gamesPlayed >= 5 && !user.achievements.includes('games5')) {
      user.achievements.push('games5');
      user.xp += 75;
    }
    if (gameType === 'match' && !user.achievements.includes('match')) {
      user.achievements.push('match');
      user.xp += 100;
    }
    if (gameType === 'scenario' && !user.achievements.includes('scenario')) {
      user.achievements.push('scenario');
      user.xp += 125;
    }
    if (user.xp >= 200 && !user.achievements.includes('xp200')) {
      user.achievements.push('xp200');
      user.xp += 50;
    }
    if (user.xp >= 500 && !user.achievements.includes('xp500')) {
      user.achievements.push('xp500');
      user.xp += 100;
    }
    if (user.xp >= 1400 && !user.achievements.includes('master')) {
      user.achievements.push('master');
      user.xp += 200;
    }

    await user.save();

    res.status(201).json({ success: true, data: { progress, user } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get user progress history
// @route   GET /api/game/progress
// @access  Private
exports.getProgress = async (req, res) => {
  try {
    const history = await Progress.find({ user: req.user.id }).sort('-playedAt');
    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
