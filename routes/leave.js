const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');

// Submit leave request
router.post('/', async (req, res) => {
  const { employeeId, startDate, endDate, reason, status } = req.body;
  if (!employeeId || !startDate || !endDate || !reason || !status) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  const leave = new Leave({ employeeId, startDate, endDate, reason, status });
  try {
    await leave.save();
    res.status(201).send({ message: 'Leave request submitted successfully', leave });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get leave requests for an employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const leaveRequests = await Leave.find({ employeeId: req.params.employeeId }).populate('employeeId');
    res.status(200).send(leaveRequests);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get all leave requests
router.get('/', async (req, res) => {
  try {
    const leaveRequests = await Leave.find().populate('employeeId');
    res.status(200).send(leaveRequests);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update leave request
router.put('/:id', async (req, res) => {
  const { startDate, endDate, reason, status } = req.body;
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, { startDate, endDate, reason, status }, { new: true });
    if (!leave) {
      return res.status(404).send({ error: 'Leave request not found' });
    }
    res.status(200).send({ message: 'Leave request updated successfully', leave });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete leave request
router.delete('/:id', async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) {
      return res.status(404).send({ error: 'Leave request not found' });
    }
    res.status(200).send({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;