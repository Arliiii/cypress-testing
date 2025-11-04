import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dataset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset',
    required: true
  },
  analysisType: {
    type: String,
    enum: ['descriptive', 'single-group', 'multiple-group', 'dependent'],
    required: true
  },
  analysisName: {
    type: String,
    required: true
  },
  selectedVariables: [{
    variableName: String,
    variableType: String
  }],
  splitVariable: {
    variableName: String,
    variableType: String
  },
  settings: {
    decimalSeparator: {
      type: String,
      enum: ['dot', 'comma'],
      default: 'dot'
    },
    decimalPlaces: {
      type: Number,
      default: 3,
      min: 0,
      max: 10
    }
  },
  results: mongoose.Schema.Types.Mixed,
  creditsUsed: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  errorMessage: String
}, {
  timestamps: true
});

// Index for faster queries
analysisSchema.index({ project: 1, createdAt: -1 });
analysisSchema.index({ user: 1, status: 1 });

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;
