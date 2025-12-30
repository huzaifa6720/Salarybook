import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Briefcase, Calendar, CreditCard, DollarSign } from 'lucide-react';
import './Employees.css';

const EmployeeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployeeDetails();
    }, [id]);

    const fetchEmployeeDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setEmployee(data);
            } else {
                console.error('Failed to fetch employee details');
            }
        } catch (error) {
            console.error('Error fetching employee details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    navigate('/employees');
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!employee) return <div className="error">Employee not found</div>;

    return (
        <div className="employees-container">
            <div className="employees-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="icon-btn" onClick={() => navigate('/employees')}>
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="employees-title">{employee.name}</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>{employee.designation}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="action-btn" onClick={() => navigate(`/employees/edit/${id}`)} title="Edit">
                        <Edit size={20} />
                        Edit
                    </button>
                    <button className="action-btn delete" onClick={handleDelete} title="Delete">
                        <Trash2 size={20} />
                        Delete
                    </button>
                </div>
            </div>

            <div className="details-grid">
                <div className="card details-card">
                    <h3 className="section-title">Personal Information</h3>
                    <div className="info-row">
                        <Mail size={18} className="text-secondary" />
                        <div>
                            <label>Email</label>
                            <p>{employee.email}</p>
                        </div>
                    </div>
                    <div className="info-row">
                        <Phone size={18} className="text-secondary" />
                        <div>
                            <label>Phone</label>
                            <p>{employee.phone || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="info-row">
                        <MapPin size={18} className="text-secondary" />
                        <div>
                            <label>Address</label>
                            <p>{employee.address || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="info-row">
                        <Calendar size={18} className="text-secondary" />
                        <div>
                            <label>Date of Birth</label>
                            <p>{employee.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="card details-card">
                    <h3 className="section-title">Professional Details</h3>
                    <div className="info-row">
                        <Briefcase size={18} className="text-secondary" />
                        <div>
                            <label>Department</label>
                            <p>{employee.department}</p>
                        </div>
                    </div>
                    <div className="info-row">
                        <Calendar size={18} className="text-secondary" />
                        <div>
                            <label>Joining Date</label>
                            <p>{new Date(employee.joiningDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className={`status-badge status-${employee.status.toLowerCase()}`}>
                            {employee.status}
                        </div>
                    </div>
                </div>

                <div className="card details-card">
                    <h3 className="section-title">Financial Details</h3>
                    <div className="info-row">
                        <DollarSign size={18} className="text-secondary" />
                        <div>
                            <label>Base Salary</label>
                            <p>PKR {employee.salaryStructure?.baseSalary?.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="info-row">
                        <CreditCard size={18} className="text-secondary" />
                        <div>
                            <label>Bank Account</label>
                            <p>{employee.bankDetails?.bankName} - {employee.bankDetails?.accountNumber}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;
