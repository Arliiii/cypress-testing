import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  datasetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset'
  },
  creditsUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  isStarred: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
projectSchema.index({ user: 1, status: 1 });
projectSchema.index({ createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
