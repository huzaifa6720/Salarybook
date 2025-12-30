import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        employeeId: '',
        department: '',
        dob: '',
        gender: '',
        cnic: '',
        address: '',
        shiftTiming: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Please login.');
                navigate('/login');
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="brand">
                    <div className="logo-circle"></div>
                    <h1>SalaryBook</h1>
                </div>
                <div className="hero-text">
                    <h2>Smart payroll for modern teams</h2>
                    <p>Create your account or sign in to access your salary, attendance, and HR tools. Employees can register with personal details. Admins sign in using username and password.</p>
                    <ul>
                        <li>Employee sign up with personal info</li>
                        <li>Employee login to dashboard</li>
                        <li>Admin login: username + password</li>
                    </ul>
                </div>
            </div>
            <div className="auth-right">
                <div className="auth-card">
                    <h2>Get started</h2>
                    <p>Sign up as an employee or log in as employee/admin</p>

                    <div className="auth-tabs">
                        <button className="active">Employee Sign Up</button>
                        <Link to="/login"><button>Login</button></Link>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full name</label>
                            <input type="text" name="fullName" placeholder="John Doe" onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" placeholder="john@company.com" onChange={handleChange} required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="text" name="phone" placeholder="+1 555 123 4567" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Employee ID</label>
                                <input type="text" name="employeeId" placeholder="EMP-001" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Department</label>
                            <input type="text" name="department" placeholder="Finance" onChange={handleChange} />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input type="date" name="dob" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select name="gender" onChange={handleChange}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>CNIC / National ID</label>
                            <input type="text" name="cnic" placeholder="12345-1234567-1" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <input type="text" name="address" placeholder="Street, City, Country" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Shift Timing / Working Hours</label>
                            <input type="text" name="shiftTiming" placeholder="09:00 - 17:00" onChange={handleChange} />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" name="password" placeholder="........" onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Confirm password</label>
                                <input type="password" name="confirmPassword" placeholder="........" onChange={handleChange} required />
                            </div>
                        </div>

                        <button type="submit" className="submit-btn">Create account</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
