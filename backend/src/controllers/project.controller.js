import Project from '../models/Project.model.js';

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = await Project.create({
      name,
      description,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    const { status = 'active', sort = '-createdAt' } = req.query;

    const projects = await Project.find({
      user: req.user._id,
      status
    })
      .sort(sort)
      .populate('datasetId', 'name fileName');

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('datasetId');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (status) project.status = status;

    await project.save();

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle star on project
// @route   PATCH /api/projects/:id/star
// @access  Private
export const toggleStar = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.isStarred = !project.isStarred;
    await project.save();

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};
