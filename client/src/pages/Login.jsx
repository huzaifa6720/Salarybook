import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                alert('Login successful!');
                navigate('/dashboard');
            } else {
                alert(data.message || 'Login failed');
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
                    <h2>Welcome back</h2>
                    <p>Sign up as an employee or log in as employee/admin</p>

                    <div className="auth-tabs">
                        <Link to="/signup"><button>Employee Sign Up</button></Link>
                        <button className="active">Login</button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email / Username</label>
                            <input type="text" name="email" placeholder="john@company.com" onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" placeholder="........" onChange={handleChange} required />
                        </div>

                        <button type="submit" className="submit-btn">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
