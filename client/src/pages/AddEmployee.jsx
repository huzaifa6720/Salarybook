import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import './Employees.css';

const AddEmployee = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cnic: '',
        dob: '',
        gender: '',
        address: '',
        department: '',
        designation: '',
        joiningDate: '',
        shiftTiming: '',
        bankDetails: {
            bankName: '',
            accountTitle: '',
            accountNumber: '',
            iban: ''
        },
        salaryStructure: {
            baseSalary: 0,
            allowances: {
                houseRent: 0,
                transport: 0,
                medical: 0,
                other: 0
            },
            deductions: {
                tax: 0,
                providentFund: 0,
                other: 0
            }
        }
    });

    useEffect(() => {
        if (id) {
            fetchEmployee();
        }
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                // Format dates for input fields
                if (data.dob) data.dob = new Date(data.dob).toISOString().split('T')[0];
                if (data.joiningDate) data.joiningDate = new Date(data.joiningDate).toISOString().split('T')[0];
                setFormData(data);
            }
        } catch (error) {
            console.error('Error fetching employee:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
    };

    const handleDeepNestedChange = (parent, subParent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [subParent]: {
                    ...prev[parent][subParent],
                    [field]: Number(value)
                }
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = id
                ? `http://localhost:5000/api/employees/${id}`
                : 'http://localhost:5000/api/employees';

            const method = id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                navigate('/employees');
            } else {
                const data = await response.json();
                alert(data.message || 'Error saving employee');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="employees-container">
            <div className="employees-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="icon-btn" onClick={() => navigate('/employees')}>
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="employees-title">{id ? 'Edit Employee' : 'Add New Employee'}</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {id ? 'Update employee details.' : 'Enter employee details to create a new profile.'}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
                {/* Personal Information */}
                <div className="card" style={{ background: 'var(--white)', padding: '2rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                    <h3 className="section-title">Personal Information</h3>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input type="text" name="name" required className="search-input" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Email Address *</label>
                            <input type="email" name="email" required className="search-input" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" name="phone" className="search-input" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>CNIC / National ID</label>
                            <input type="text" name="cnic" className="search-input" value={formData.cnic} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input type="date" name="dob" className="search-input" value={formData.dob} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Gender</label>
                            <select name="gender" className="search-input" value={formData.gender} onChange={handleChange}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Address</label>
                            <textarea name="address" className="search-input" rows="3" value={formData.address} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>

                {/* Professional Details */}
                <div className="card" style={{ background: 'var(--white)', padding: '2rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                    <h3 className="section-title">Professional Details</h3>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Department</label>
                            <select name="department" className="search-input" value={formData.department} onChange={handleChange}>
                                <option value="">Select Department</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Sales">Sales</option>
                                <option value="HR">HR</option>
                                <option value="Finance">Finance</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Designation</label>
                            <input type="text" name="designation" className="search-input" value={formData.designation} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Joining Date</label>
                            <input type="date" name="joiningDate" className="search-input" value={formData.joiningDate} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Shift Timing</label>
                            <select name="shiftTiming" className="search-input" value={formData.shiftTiming} onChange={handleChange}>
                                <option value="">Select Shift</option>
                                <option value="Morning">Morning (9AM - 5PM)</option>
                                <option value="Evening">Evening (2PM - 10PM)</option>
                                <option value="Night">Night (10PM - 6AM)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Salary Structure */}
                <div className="card" style={{ background: 'var(--white)', padding: '2rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                    <h3 className="section-title">Salary Structure</h3>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Base Salary</label>
                            <input
                                type="number"
                                className="search-input"
                                value={formData.salaryStructure.baseSalary}
                                onChange={(e) => handleNestedChange('salaryStructure', 'baseSalary', Number(e.target.value))}
                            />
                        </div>

                        {/* Allowances */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <h4 style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Allowances</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>House Rent</label>
                                    <input
                                        type="number"
                                        className="search-input"
                                        value={formData.salaryStructure.allowances.houseRent}
                                        onChange={(e) => handleDeepNestedChange('salaryStructure', 'allowances', 'houseRent', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Transport</label>
                                    <input
                                        type="number"
                                        className="search-input"
                                        value={formData.salaryStructure.allowances.transport}
                                        onChange={(e) => handleDeepNestedChange('salaryStructure', 'allowances', 'transport', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Medical</label>
                                    <input
                                        type="number"
                                        className="search-input"
                                        value={formData.salaryStructure.allowances.medical}
                                        onChange={(e) => handleDeepNestedChange('salaryStructure', 'allowances', 'medical', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" className="action-btn" onClick={() => navigate('/employees')} style={{ border: '1px solid var(--border-color)', padding: '0.75rem 1.5rem' }}>
                        Cancel
                    </button>
                    <button type="submit" className="add-btn" disabled={loading}>
                        <Save size={20} />
                        {loading ? 'Saving...' : (id ? 'Update Employee' : 'Save Employee')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEmployee;
