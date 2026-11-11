const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { analyzeComplaint } = require('../services/ai');

// simple admin check (key sent from the frontend)
function adminOnly(req, res, next) {
  if (req.headers['x-admin-key'] === process.env.ADMIN_KEY) return next();
  res.status(403).json({ error: 'Admin key required' });
}

// CREATE (AI fills category, priority, summary)
router.post('/', async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const ai = await analyzeComplaint({ title, description, location });

    const complaint = await Complaint.create({
      title,
      description,
      location,
      category: ai.category,
      priority: ai.priority,
      aiSummary: ai.summary
    });
    res.json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// STATS (aggregate: count complaints by status)
router.get('/stats', async (req, res) => {
  const byStatus = await Complaint.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  const stats = { Total: 0, Pending: 0, 'In Progress': 0, Resolved: 0 };
  byStatus.forEach(s => {
    stats[s._id] = s.count;
    stats.Total += s.count;
  });
  res.json(stats);
});

// READ (with filters: ?category=Water&status=Pending&priority=High)
router.get('/', async (req, res) => {
  const filter = {};
  ['category', 'status', 'priority'].forEach(key => {
    if (req.query[key]) filter[key] = req.query[key];
  });
  const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
  res.json(complaints);
});

// UPDATE status (admin)
router.put('/:id', adminOnly, async (req, res) => {
  const updated = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(updated);
});

// DELETE (admin)
router.delete('/:id', adminOnly, async (req, res) => {
  await Complaint.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;