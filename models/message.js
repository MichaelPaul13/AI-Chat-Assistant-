// models/message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    tenantId: { type: String, index: true, default: 'default' },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    text: { type: String, required: true },
    source: { type: String, enum: ['AI', 'FAQ'], default: 'AI' } // track where the reply came from
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('Message', messageSchema);
