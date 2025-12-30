const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    cnic: { type: String }, // National ID
    employeeId: { type: String, unique: true },
    department: { type: String },
    designation: { type: String },
    joiningDate: { type: Date, default: Date.now },
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    address: { type: String },
    shiftTiming: { type: String },
    status: { type: String, enum: ['Active', 'Inactive', 'Terminated'], default: 'Active' },
    role: { type: String, enum: ['Admin', 'Accountant', 'Viewer', 'Employee'], default: 'Employee' },
    documents: [{
        name: String,
        url: String,
        uploadDate: { type: Date, default: Date.now }
    }],
    bankDetails: {
        bankName: String,
        accountTitle: String,
        accountNumber: String,
        iban: String
    },
    salaryStructure: {
        baseSalary: { type: Number, default: 0 },
        allowances: {
            houseRent: { type: Number, default: 0 },
            transport: { type: Number, default: 0 },
            medical: { type: Number, default: 0 },
            other: { type: Number, default: 0 }
        },
        deductions: {
            tax: { type: Number, default: 0 },
            providentFund: { type: Number, default: 0 },
            other: { type: Number, default: 0 }
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
