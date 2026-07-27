const mongoose = require('mongoose');

const ClickEventSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: [true, 'Link ID is required'],
    index: true
  },
  clickedAt: {
    type: Date,
    default: Date.now,
    required: true,
    index: true
  },
  country: {
    type: String,
    default: 'Unknown',
    trim: true
  },
  countryCode: {
    type: String,
    default: 'Unknown',
    trim: true
  },
  device: {
    type: String,
    default: 'Unknown',
    trim: true
  },
  browser: {
    type: String,
    default: 'Unknown',
    trim: true
  },
  operatingSystem: {
    type: String,
    default: 'Unknown',
    trim: true
  },
  referrer: {
    type: String,
    default: 'Direct',
    trim: true
  }
});

module.exports = mongoose.model('ClickEvent', ClickEventSchema);
