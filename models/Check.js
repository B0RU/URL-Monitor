const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    protocol: {
      type: String,
      required: true,
    },
    path: {
      type: String,
    },
    port: {
      type: Number,
    },
    webhooks: {
      type: Object,
    },
    timeout: {
      type: Number,
    },
    interval: {
      type: Number,
    },
    threshold: {
      type: Number,
    },
    authentication: {
      type: Object,
      username: String,
      password: String,
    },
    httpHeaders: {
      type: Object,
    },
    assert: {
      type: Object,
    },
    tags: {
      type: Array,
    },
    ignoreSSL: {
      type: Boolean,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isPaused: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('Check', checkSchema);
