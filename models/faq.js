// models/faq.js
const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    tenantId: { type: String, index: true, default: 'default' },
    question: { type: String, required: true },
    answer:   { type: String, required: true },
    tags:     { type: [String], default: [] }
  },
  { timestamps: true }
);

faqSchema.index({ tenantId: 1, question: 'text', answer: 'text', tags: 1 });

module.exports = mongoose.model('Faq', faqSchema);
