import Analysis from '../models/Analysis.model.js';
import Project from '../models/Project.model.js';
import Dataset from '../models/Dataset.model.js';
import User from '../models/User.model.js';
import { performStatisticalAnalysis } from '../utils/statistics.js';

// @desc    Create new analysis
// @route   POST /api/analysis
// @access  Private
export const createAnalysis = async (req, res, next) => {
  try {
    const {
      projectId,
      datasetId,
      analysisType,
      selectedVariables,
      splitVariable,
      settings
    } = req.body;

    // Validate required fields
    if (!projectId || !datasetId || !analysisType || !selectedVariables) {
      return res.status(400).json({ 
        message: 'Missing required fields: projectId, datasetId, analysisType, selectedVariables' 
      });
    }

    // Verify project and dataset exist
    const project = await Project.findOne({
      _id: projectId,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const dataset = await Dataset.findOne({
      _id: datasetId,
      user: req.user._id
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // Determine credit cost based on analysis type
    const creditCosts = {
      'descriptive': 2,
      'single-group': 3,
      'multiple-group': 4,
      'dependent': 4
    };
    const creditsRequired = creditCosts[analysisType] || 2;

    // Check if user has enough credits
    if (req.user.credits < creditsRequired) {
      return res.status(403).json({
        message: 'Insufficient credits',
        required: creditsRequired,
        available: req.user.credits
      });
    }

    // Create analysis
    const analysis = await Analysis.create({
      project: projectId,
      user: req.user._id,
      dataset: datasetId,
      analysisType,
      analysisName: getAnalysisName(analysisType),
      selectedVariables,
      splitVariable,
      settings: {
        decimalSeparator: settings?.decimalSeparator || 'dot',
        decimalPlaces: settings?.decimalPlaces || 3
      },
      creditsUsed: creditsRequired,
      status: 'processing'
    });

    // Perform statistical analysis
    try {
      const results = await performStatisticalAnalysis(
        dataset,
        analysisType,
        selectedVariables,
        splitVariable,
        settings
      );

      analysis.results = results;
      analysis.status = 'completed';
      await analysis.save();

      // Deduct credits from user
      req.user.credits -= creditsRequired;
      await req.user.save();

      // Update project credits used
      project.creditsUsed += creditsRequired;
      await project.save();

      res.status(201).json({
        success: true,
        data: analysis
      });
    } catch (analysisError) {
      analysis.status = 'failed';
      analysis.errorMessage = analysisError.message;
      await analysis.save();

      return res.status(500).json({
        message: 'Analysis failed',
        error: analysisError.message
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all analyses for user
// @route   GET /api/analysis
// @access  Private
export const getAnalyses = async (req, res, next) => {
  try {
    const { projectId, status } = req.query;

    const query = { user: req.user._id };
    if (projectId) query.project = projectId;
    if (status) query.status = status;

    const analyses = await Analysis.find(query)
      .populate('project', 'name')
      .populate('dataset', 'name fileName')
      .sort('-createdAt');

    res.json({
      success: true,
      count: analyses.length,
      data: analyses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single analysis
// @route   GET /api/analysis/:id
// @access  Private
export const getAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate('project', 'name')
      .populate('dataset', 'name fileName variables');

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete analysis
// @route   DELETE /api/analysis/:id
// @access  Private
export const deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle star on analysis
// @route   PATCH /api/analysis/:id/star
// @access  Private
export const toggleStar = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    analysis.isStarred = !analysis.isStarred;
    await analysis.save();

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get analysis name
const getAnalysisName = (type) => {
  const names = {
    'descriptive': 'Descriptive Statistics',
    'single-group': 'Single Group Analysis',
    'multiple-group': 'Multiple Group Analysis',
    'dependent': 'Dependent Data Analysis'
  };
  return names[type] || 'Statistical Analysis';
};
