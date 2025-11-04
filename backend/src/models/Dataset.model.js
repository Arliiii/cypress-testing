import mongoose from 'mongoose';

const variableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String
  },
  type: {
    type: String,
    enum: ['Scale', 'Nominal', 'Ordinal'],
    required: true
  },
  values: [mongoose.Schema.Types.Mixed]
}, { _id: false });

const datasetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  variables: [variableSchema],
  rowCount: {
    type: Number,
    required: true
  },
  columnCount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Dataset = mongoose.model('Dataset', datasetSchema);

export default Dataset;
