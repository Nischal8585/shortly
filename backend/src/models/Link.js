const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, 'Original URL is required'],
    trim: true,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL']
  },
  shortCode: {
    type: String,
    required: [true, 'Short code is required'],
    unique: true,
    trim: true,
    minlength: [5, 'Short code must be at least 5 characters long'],
    maxlength: [20, 'Short code cannot exceed 20 characters']
  },
  customAlias: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  clicks: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastClickedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Link', LinkSchema);
