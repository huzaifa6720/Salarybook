const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/salarybook')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

const seedUsers = async () => {
    try {
        const users = [
            {
                name: 'Super Admin',
                email: 'admin@salarybook.com',
                password: 'admin',
                role: 'Admin',
                designation: 'Administrator',
                employeeId: 'ADMIN001'
            },
            {
                name: 'John Accountant',
                email: 'accountant@salarybook.com',
                password: 'admin',
                role: 'Accountant',
                designation: 'Senior Accountant',
                employeeId: 'ACCT001'
            },
            {
                name: 'Jane Viewer',
                email: 'viewer@salarybook.com',
                password: 'admin',
                role: 'Viewer',
                designation: 'Auditor',
                employeeId: 'VIEW001'
            },
            {
                name: 'Bob Employee',
                email: 'employee@salarybook.com',
                password: 'admin',
                role: 'Employee',
                designation: 'Software Engineer',
                employeeId: 'EMP001'
            }
        ];

        for (const user of users) {
            const existingUser = await User.findOne({ email: user.email });
            if (existingUser) {
                console.log(`${user.role} user already exists`);
                continue;
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            const newUser = new User({
                ...user,
                password: hashedPassword
            });

            await newUser.save();
            console.log(`${user.role} user created successfully`);
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
