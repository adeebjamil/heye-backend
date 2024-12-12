const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Create a new employee
router.post('/', async (req, res) => {
  const { name, position, email, mob } = req.body; // Changed 'mobile' to 'mob'
  const avatar = 'https://via.placeholder.com/150'; // Default avatar URL
  console.log('Request Body:', req.body); // Log the request body

  if (!name || !position || !email || !mob) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  const employee = new Employee({ name, position, avatar, email, mob }); // Changed 'mobile' to 'mob'
  try {
    await employee.save();
    res.status(201).send({ message: 'Employee added successfully', employee });
  } catch (error) {
    console.error('Error adding employee:', error); // Log the error
    res.status(400).send({ error: error.message });
  }
});

// Read all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Read an employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send();
    }
    res.status(200).send(employee);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an employee by ID
router.put('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'position', 'avatar', 'email', 'mob'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send();
    }
    updates.forEach(update => employee[update] = req.body[update]);
    await employee.save();
    res.status(200).send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an employee by ID
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).send();
    }
    res.status(200).send(employee);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;