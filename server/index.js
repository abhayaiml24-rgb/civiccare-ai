const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'CivicCare server is working!' });
});

app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/chat', require('./routes/chat'));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log('DB error:', err.message));