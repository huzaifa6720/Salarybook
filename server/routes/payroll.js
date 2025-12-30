const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const auth = require('../middleware/authMiddleware');

// @route   GET api/payroll
// @desc    Get all payroll history
// @access  Private
router.get('/', auth, payrollController.getAllPayrolls);

// @route   POST api/payroll/initiate
// @desc    Calculate payroll for a month
// @access  Private (Admin/Accountant)
router.post('/initiate', auth, payrollController.initiatePayroll);

// @route   GET api/payroll/:id
// @desc    Get specific payroll details
// @access  Private
router.get('/:id', auth, payrollController.getPayrollById);

// @route   PUT api/payroll/:payrollId/record/:recordId
// @desc    Update a specific employee record in payroll
// @access  Private (Admin/Accountant)
router.put('/:payrollId/record/:recordId', auth, payrollController.updatePayrollRecord);

// @route   POST api/payroll/:id/lock
// @desc    Lock payroll
// @access  Private (Admin)
router.post('/:id/lock', auth, payrollController.lockPayroll);

const payslipController = require('../controllers/payslipController');

// @route   GET api/payroll/:payrollId/record/:recordId/download
// @desc    Download payslip PDF
// @access  Private
router.get('/:payrollId/record/:recordId/download', auth, payslipController.generatePayslip);

module.exports = router;
