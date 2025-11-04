import Dataset from '../models/Dataset.model.js';
import Project from '../models/Project.model.js';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

// Helper function to detect variable type
const detectVariableType = (values) => {
  const uniqueValues = [...new Set(values.filter(v => v !== null && v !== undefined && v !== ''))];
  
  // If all numeric, it's Scale
  const allNumeric = uniqueValues.every(v => !isNaN(parseFloat(v)) && isFinite(v));
  if (allNumeric && uniqueValues.length > 10) {
    return 'Scale';
  }
  
  // If few unique values, it's Nominal
  if (uniqueValues.length <= 10) {
    return 'Nominal';
  }
  
  // Default to Scale
  return 'Scale';
};

// Helper function to parse dataset file
const parseDatasetFile = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null });
  
  if (data.length < 2) {
    throw new Error('Dataset must have at least a header row and one data row');
  }
  
  const headers = data[0];
  const rows = data.slice(1);
  
  // Extract variables with their values
  const variables = headers.map((header, index) => {
    const values = rows.map(row => row[index]).filter(v => v !== null && v !== undefined && v !== '');
    return {
      name: header.toString(),
      label: header.toString(),
      type: detectVariableType(values),
      values: values.slice(0, 100) // Store first 100 values as sample
    };
  });
  
  return {
    variables,
    rowCount: rows.length,
    columnCount: headers.length
  };
};

// @desc    Upload dataset
// @route   POST /api/datasets/upload
// @access  Private
export const uploadDataset = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { projectId } = req.body;
    
    if (!projectId) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Project ID is required' });
    }

    // Verify project exists and belongs to user
    const project = await Project.findOne({
      _id: projectId,
      user: req.user._id
    });

    if (!project) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Project not found' });
    }

    // Parse dataset
    let parsedData;
    try {
      parsedData = parseDatasetFile(req.file.path);
    } catch (parseError) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: parseError.message });
    }

    // Create dataset record
    const dataset = await Dataset.create({
      name: req.file.originalname.split('.')[0],
      user: req.user._id,
      project: projectId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      filePath: req.file.path,
      variables: parsedData.variables,
      rowCount: parsedData.rowCount,
      columnCount: parsedData.columnCount
    });

    // Update project with dataset
    project.datasetId = dataset._id;
    await project.save();

    res.status(201).json({
      success: true,
      data: dataset
    });
  } catch (error) {
    // Clean up file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Get all datasets for user
// @route   GET /api/datasets
// @access  Private
export const getDatasets = async (req, res, next) => {
  try {
    const datasets = await Dataset.find({ user: req.user._id })
      .populate('project', 'name')
      .sort('-createdAt');

    res.json({
      success: true,
      count: datasets.length,
      data: datasets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single dataset
// @route   GET /api/datasets/:id
// @access  Private
export const getDataset = async (req, res, next) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('project', 'name');

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    res.json({
      success: true,
      data: dataset
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete dataset
// @route   DELETE /api/datasets/:id
// @access  Private
export const deleteDataset = async (req, res, next) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(dataset.filePath)) {
      fs.unlinkSync(dataset.filePath);
    }

    await dataset.deleteOne();

    res.json({
      success: true,
      message: 'Dataset deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dataset variables
// @route   GET /api/datasets/:id/variables
// @access  Private
export const getVariables = async (req, res, next) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    res.json({
      success: true,
      data: dataset.variables
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dataset preview (first 10 rows)
// @route   GET /api/datasets/:id/preview
// @access  Private
export const getDatasetPreview = async (req, res, next) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // Read file and get preview
    const workbook = xlsx.readFile(dataset.filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    
    const headers = data[0];
    const rows = data.slice(1, 11); // Get first 10 rows

    res.json({
      success: true,
      data: {
        headers,
        rows,
        totalRows: dataset.rowCount,
        totalColumns: dataset.columnCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get full dataset data
// @route   GET /api/datasets/:id/data
// @access  Private
export const getDatasetData = async (req, res, next) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // Read full file
    const workbook = xlsx.readFile(dataset.filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    res.json({
      success: true,
      data: jsonData,
      count: jsonData.length
    });
  } catch (error) {
    next(error);
  }
};
