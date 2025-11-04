import User from '../models/User.model.js';

// @desc    Get user credits
// @route   GET /api/users/credits
// @access  Private
export const getCredits = async (req, res, next) => {
  try {
    res.json({
      success: true,
      credits: req.user.credits
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add credits to user account
// @route   POST /api/users/credits/add
// @access  Private
export const addCredits = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid credit amount' });
    }

    // In production, this would integrate with a payment gateway
    // For now, we'll just add the credits directly
    req.user.credits += amount;
    await req.user.save();

    res.json({
      success: true,
      message: `${amount} credits added successfully`,
      credits: req.user.credits
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get credit usage history
// @route   GET /api/users/credits/history
// @access  Private
export const getCreditHistory = async (req, res, next) => {
  try {
    // Import here to avoid circular dependency
    const Analysis = (await import('../models/Analysis.model.js')).default;

    const history = await Analysis.find({
      user: req.user._id,
      status: 'completed'
    })
      .select('analysisName creditsUsed createdAt')
      .populate('project', 'name')
      .sort('-createdAt')
      .limit(50);

    const totalUsed = history.reduce((sum, item) => sum + item.creditsUsed, 0);

    res.json({
      success: true,
      totalCreditsUsed: totalUsed,
      currentCredits: req.user.credits,
      history
    });
  } catch (error) {
    next(error);
  }
};
