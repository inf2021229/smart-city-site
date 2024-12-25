const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONG_CONN)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define the report schema and model
const reportSchema = new mongoose.Schema({
  description: String,
  latitude: Number,
  longitude: Number,
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', reportSchema);

// API to get reports
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API to add a report
app.post('/api/reports', async (req, res) => {
  const { description, latitude, longitude } = req.body;

  if (!description || !latitude || !longitude) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newReport = new Report({ description, latitude, longitude });
    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the backend server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
