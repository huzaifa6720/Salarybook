const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middleware/authMiddleware');

// @route   GET api/employees
// @desc    Get all employees
// @access  Private
router.get('/', auth, employeeController.getEmployees);

// @route   POST api/employees
// @desc    Create a new employee
// @access  Private (Admin/Accountant)
router.post('/', auth, employeeController.createEmployee);

// @route   GET api/employees/:id
// @desc    Get employee by ID
// @access  Private
router.get('/:id', auth, employeeController.getEmployeeById);

// @route   PUT api/employees/:id
// @desc    Update employee
// @access  Private (Admin/Accountant)
router.put('/:id', auth, employeeController.updateEmployee);

// @route   DELETE api/employees/:id
// @desc    Delete employee
// @access  Private (Admin)
router.delete('/:id', auth, employeeController.deleteEmployee);

module.exports = router;
