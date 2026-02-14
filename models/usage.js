// models/usage.js
const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema(
  {
    tenantId: { type: String, index: true, required: true },
    month:    { type: String, index: true, required: true }, // "YYYY-MM"
    count:    { type: Number, default: 0 }
  },
  { timestamps: true }
);

usageSchema.index({ tenantId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Usage', usageSchema);
