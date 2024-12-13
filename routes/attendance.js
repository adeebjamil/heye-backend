const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
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

// Mark attendance
router.post('/', async (req, res) => {
  const { employeeId, date, status, workDone } = req.body;

  // Validate the request data
  if (!employeeId || !date || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newAttendance = new Attendance({ employeeId, date, status, workDone });
  try {
    await newAttendance.save();
    res.status(201).json({ message: 'Attendance marked successfully', attendance: newAttendance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update attendance record
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { date, status, workDone } = req.body;

  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(id, { date, status, workDone }, { new: true });
    if (!updatedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json({ message: 'Attendance updated successfully', attendance: updatedAttendance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete attendance record
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAttendance = await Attendance.findByIdAndDelete(id);
    if (!deletedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate PDF for all attendance records
router.get('/download-attendance', async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find().populate('employeeId');

    const doc = new PDFDocument();
    let filename = 'attendance_records.pdf';
    filename = encodeURIComponent(filename);

    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    doc.text('Employee Attendance Records', { align: 'center' });
    doc.moveDown();

    attendanceRecords.forEach(record => {
      doc.text(`Employee: ${record.employeeId.name}`);
      doc.text(`  Date: ${new Date(record.date).toLocaleDateString()}`);
      doc.text(`  Status: ${record.status}`);
      doc.text(`  Work Done: ${record.workDone}`);
      doc.moveDown();
    });

    doc.pipe(res);
    doc.end();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});



module.exports = router;