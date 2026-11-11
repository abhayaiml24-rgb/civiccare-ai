const express = require('express');
const router = express.Router();
const { chatReply } = require('../services/ai');

router.post('/', async (req, res) => {
  const reply = await chatReply(req.body.message || '');
  res.json({ reply });
});

module.exports = router;