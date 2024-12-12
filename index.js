const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGODB_URI;
console.log('MongoDB URI:', mongoURI); // Log the MongoDB URI

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Connection error:', error.message);
  });

// Import routes
const employeeRouter = require('./routes/employee');
const attendanceRouter = require('./routes/attendance');
const leaveRouter = require('./routes/leave');
const notesRouter = require('./routes/notes'); 

// Use routes
app.use('/employees', employeeRouter);
app.use('/attendance', attendanceRouter); // Ensure this matches the URL being requested
app.use('/leaves', leaveRouter);
app.use('/notes', notesRouter); // Add this line

app.get("/", (req, res) => {
  res.send("Welcome to the Office Management System API");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});