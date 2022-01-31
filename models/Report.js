const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    status: {
      type: String,
      default: null,
    },
    availability: {
      type: Number,
      default: null,
    },
    outages: {
      type: Number,
      default: 0,
    },
    downtime: {
      type: Number,
      default: null,
    },
    uptime: {
      type: Number,
      default: null,
    },
    responseTime: {
      type: Number,
      default: 0,
    },
    history: {
      type: Object,
      default: null,
    },
    check: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Check',
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);
