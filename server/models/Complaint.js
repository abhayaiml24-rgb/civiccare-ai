const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, default: 'Other' },
    priority: { type: String, default: 'Medium' },
        aiSummary: { type: String },
    status: { type: String, default: 'Pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);