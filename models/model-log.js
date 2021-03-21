const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
}, { timestamps: false });

module.exports = mongoose.model('Log', logSchema);