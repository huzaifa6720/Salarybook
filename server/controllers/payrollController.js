const Payroll = require('../models/Payroll');
const User = require('../models/User');

// Initiate/Calculate Payroll for a Month
exports.initiatePayroll = async (req, res) => {
    try {
        const { month, year } = req.body;

        // Check if payroll already exists
        const existingPayroll = await Payroll.findOne({ month, year });
        if (existingPayroll) {
            return res.status(400).json({ message: `Payroll for ${month} ${year} already exists.` });
        }

        // Fetch all active employees
        const employees = await User.find({ status: 'Active', role: { $ne: 'Admin' } });

        if (employees.length === 0) {
            return res.status(400).json({ message: 'No active employees found to process payroll.' });
        }

        let totalPayout = 0;
        const records = employees.map(emp => {
            const base = emp.salaryStructure?.baseSalary || 0;

            // Allowances
            const allowances = emp.salaryStructure?.allowances || {};
            const houseRent = allowances.houseRent || 0;
            const transport = allowances.transport || 0;
            const medical = allowances.medical || 0;
            const otherAllowances = allowances.other || 0;
            const totalAllowances = houseRent + transport + medical + otherAllowances;

            // Deductions
            const deductions = emp.salaryStructure?.deductions || {};
            const tax = deductions.tax || 0;
            const pf = deductions.providentFund || 0;
            const otherDeductions = deductions.other || 0;
            const totalDeductions = tax + pf + otherDeductions;

            const grossPay = base + totalAllowances;
            const netPay = grossPay - totalDeductions;

            totalPayout += netPay;

            return {
                employee: emp._id,
                employeeName: emp.name,
                department: emp.department,
                designation: emp.designation,
                baseSalary: base,
                totalAllowances,
                totalDeductions,
                grossPay,
                netPay,
                allowanceDetails: {
                    houseRent,
                    transport,
                    medical,
                    other: otherAllowances,
                    overtime: 0
                },
                deductionDetails: {
                    tax,
                    providentFund: pf,
                    other: otherDeductions,
                    loanRepayment: 0
                }
            };
        });

        const newPayroll = new Payroll({
            month,
            year,
            status: 'Calculated',
            records,
            totalPayout,
            processedBy: req.user.id
        });

        await newPayroll.save();

        res.status(201).json({ message: 'Payroll calculated successfully', payroll: newPayroll });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get All Payrolls (History)
exports.getAllPayrolls = async (req, res) => {
    try {
        const payrolls = await Payroll.find().sort({ year: -1, createdAt: -1 });
        res.status(200).json(payrolls);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get Single Payroll Details
exports.getPayrollById = async (req, res) => {
    try {
        const payroll = await Payroll.findById(req.params.id).populate('records.employee', 'email phone bankDetails');
        if (!payroll) {
            return res.status(404).json({ message: 'Payroll not found' });
        }
        res.status(200).json(payroll);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update a specific record (e.g. add overtime)
exports.updatePayrollRecord = async (req, res) => {
    try {
        const { payrollId, recordId } = req.params;
        const { overtime, loanRepayment, bonus } = req.body; // Adjustments

        const payroll = await Payroll.findById(payrollId);
        if (!payroll) return res.status(404).json({ message: 'Payroll not found' });

        if (payroll.status === 'Locked') {
            return res.status(400).json({ message: 'Cannot modify a locked payroll.' });
        }

        const record = payroll.records.id(recordId);
        if (!record) return res.status(404).json({ message: 'Record not found' });

        // Apply updates
        if (overtime !== undefined) record.allowanceDetails.overtime = Number(overtime);

        // Recalculate totals for this record
        const base = record.baseSalary;

        // Re-sum allowances
        const totalAllowances =
            record.allowanceDetails.houseRent +
            record.allowanceDetails.transport +
            record.allowanceDetails.medical +
            record.allowanceDetails.other +
            record.allowanceDetails.overtime;

        record.totalAllowances = totalAllowances;

        // Re-sum deductions
        const totalDeductions =
            record.deductionDetails.tax +
            record.deductionDetails.providentFund +
            record.deductionDetails.other +
            record.deductionDetails.loanRepayment;

        record.totalDeductions = totalDeductions;

        record.grossPay = base + totalAllowances;
        record.netPay = record.grossPay - totalDeductions;

        // Recalculate total payout for the whole payroll
        payroll.totalPayout = payroll.records.reduce((acc, curr) => acc + curr.netPay, 0);

        await payroll.save();
        res.status(200).json({ message: 'Record updated', payroll });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Lock/Finalize Payroll
exports.lockPayroll = async (req, res) => {
    try {
        const payroll = await Payroll.findById(req.params.id);
        if (!payroll) return res.status(404).json({ message: 'Payroll not found' });

        payroll.status = 'Locked';
        await payroll.save();

        res.status(200).json({ message: 'Payroll locked successfully', payroll });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
