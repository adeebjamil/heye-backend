const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find().populate('employeeId');
    res.status(200).send(attendanceRecords);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;