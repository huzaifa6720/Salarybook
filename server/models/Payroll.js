const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    month: { type: String, required: true },
    year: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Draft', 'Calculated', 'Approved', 'Locked'],
        default: 'Draft'
    },
    records: [{
        employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        employeeName: String, // Snapshot
        department: String, // Snapshot
        designation: String, // Snapshot

        // Financials
        baseSalary: Number,
        totalAllowances: Number,
        totalDeductions: Number,
        grossPay: Number,
        netPay: Number,

        // Breakdown (Snapshot)
        allowanceDetails: {
            houseRent: Number,
            transport: Number,
            medical: Number,
            other: Number,
            overtime: { type: Number, default: 0 } // Variable
        },
        deductionDetails: {
            tax: Number,
            providentFund: Number,
            other: Number,
            loanRepayment: { type: Number, default: 0 } // Variable
        },

        status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' }
    }],
    totalPayout: { type: Number, default: 0 },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    processedDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index to ensure unique payroll per month/year
payrollSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Payroll', payrollSchema);
