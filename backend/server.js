const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/api/reports', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reports');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/reports', async (req, res) => {
  const { description, latitude, longitude } = req.body;
  if (!description || !latitude || !longitude) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO reports (description, latitude, longitude) VALUES (?, ?, ?)',
      [description, latitude, longitude]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log('Backend server running on port 3000');
});
