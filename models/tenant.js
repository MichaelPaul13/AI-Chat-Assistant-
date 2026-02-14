// models/tenant.js
const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  key:   { type: String, unique: true, index: true }, // e.g. "clientA"
  name:  { type: String },
  plan:  { type: String, enum: ['starter','pro','enterprise'], default: 'starter' },
  limits: {
    perMinute: { type: Number, default: 30 },   // starter default
  }
}, { timestamps: true });

module.exports = mongoose.model('Tenant', TenantSchema);
