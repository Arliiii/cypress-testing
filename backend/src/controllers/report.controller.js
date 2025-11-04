import Report from '../models/Report.model.js';
import Analysis from '../models/Analysis.model.js';

// @desc    Create report from analysis
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res, next) => {
  try {
    const { analysisId } = req.body;

    if (!analysisId) {
      return res.status(400).json({ message: 'Analysis ID is required' });
    }

    // Get analysis
    const analysis = await Analysis.findOne({
      _id: analysisId,
      user: req.user._id
    })
      .populate('project')
      .populate('dataset');

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    if (analysis.status !== 'completed') {
      return res.status(400).json({ message: 'Analysis must be completed before creating a report' });
    }

    // Create report
    const report = await Report.create({
      analysis: analysisId,
      project: analysis.project._id,
      user: req.user._id,
      title: `${analysis.project.name} - ${analysis.analysisName}`,
      content: analysis.results,
      creditsUsed: analysis.creditsUsed
    });

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports for user
// @route   GET /api/reports
// @access  Private
export const getReports = async (req, res, next) => {
  try {
    const { projectId, starred } = req.query;

    const query = { user: req.user._id };
    if (projectId) query.project = projectId;
    if (starred === 'true') query.isStarred = true;

    const reports = await Report.find(query)
      .populate('project', 'name')
      .populate('analysis', 'analysisName analysisType')
      .sort('-createdAt');

    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
export const getReport = async (req, res, next) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate('project')
      .populate('analysis');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
export const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle star on report
// @route   PATCH /api/reports/:id/star
// @access  Private
export const toggleStar = async (req, res, next) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.isStarred = !report.isStarred;
    await report.save();

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export report
// @route   GET /api/reports/:id/export
// @access  Private
export const exportReport = async (req, res, next) => {
  try {
    const { format = 'json' } = req.query;

    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate('project')
      .populate('analysis');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (format === 'json') {
      res.json({
        success: true,
        data: report
      });
    } else {
      return res.status(400).json({ message: 'Unsupported export format' });
    }
  } catch (error) {
    next(error);
  }
};
