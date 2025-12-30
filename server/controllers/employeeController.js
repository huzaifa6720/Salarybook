const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all employees
exports.getEmployees = async (req, res) => {
    try {
        const { search, department, status } = req.query;
        let query = { role: { $ne: 'Admin' } }; // Exclude admins by default or as per requirement

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { employeeId: { $regex: search, $options: 'i' } }
            ];
        }

        if (department) {
            query.department = department;
        }

        if (status) {
            query.status = status;
        }

        const employees = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Create new employee
exports.createEmployee = async (req, res) => {
    try {
        const { name, email, phone, cnic, department, designation, joiningDate, salaryStructure, bankDetails } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Generate default password (e.g., "Employee123!")
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Employee123!', salt);

        // Generate Employee ID (Simple auto-increment logic or random)
        const count = await User.countDocuments();
        const employeeId = `EMP${String(count + 1).padStart(3, '0')}`;

        const newEmployee = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            cnic,
            employeeId,
            department,
            designation,
            joiningDate,
            role: 'Employee',
            salaryStructure,
            bankDetails
        });

        await newEmployee.save();

        res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get single employee
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id).select('-password');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update employee
exports.updateEmployee = async (req, res) => {
    try {
        const updates = req.body;
        // Prevent password update from here if needed, or handle it separately
        delete updates.password;

        const employee = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee updated successfully', employee });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await User.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
