import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  analysis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Analysis',
    required: true
  },
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
  reportNumber: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: mongoose.Schema.Types.Mixed,
  format: {
    type: String,
    enum: ['json', 'pdf', 'html'],
    default: 'json'
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  creditsUsed: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Auto-generate report number
reportSchema.pre('save', async function(next) {
  if (!this.reportNumber) {
    this.reportNumber = `#${Math.floor(1000 + Math.random() * 9000)}`;
  }
  next();
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
