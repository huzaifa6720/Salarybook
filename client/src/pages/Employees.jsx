import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import './Employees.css';

const Employees = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, [searchTerm, departmentFilter, statusFilter]);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            let query = `?`;
            if (searchTerm) query += `search=${searchTerm}&`;
            if (departmentFilter) query += `department=${departmentFilter}&`;
            if (statusFilter) query += `status=${statusFilter}&`;

            const response = await fetch(`http://localhost:5000/api/employees${query}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
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
                    fetchEmployees();
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    return (
        <div className="employees-container">
            <div className="employees-header">
                <div>
                    <h2 className="employees-title">Employee Management</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Manage your team members and their account details.
                    </p>
                </div>
                <button className="add-btn" onClick={() => navigate('/employees/add')}>
                    <Plus size={20} />
                    Add Employee
                </button>
            </div>

            <div className="filters-bar">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or ID..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="filter-select"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                    <option value="">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                </select>
                <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Terminated">Terminated</option>
                </select>
            </div>

            <div className="employees-table-container">
                <table className="employees-table">
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>ID</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>Joining Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td>
                            </tr>
                        ) : employees.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No employees found.</td>
                            </tr>
                        ) : (
                            employees.map((employee) => (
                                <tr key={employee._id}>
                                    <td>
                                        <div className="employee-name-cell">
                                            <div className="employee-avatar">
                                                {employee.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{employee.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{employee.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{employee.employeeId}</td>
                                    <td>{employee.department}</td>
                                    <td>{employee.designation}</td>
                                    <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge status-${employee.status.toLowerCase()}`}>
                                            {employee.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="action-btn" title="View Details" onClick={() => navigate(`/employees/${employee._id}`)}>
                                                <Eye size={18} />
                                            </button>
                                            <button className="action-btn" title="Edit" onClick={() => navigate(`/employees/edit/${employee._id}`)}>
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                title="Delete"
                                                onClick={() => handleDelete(employee._id)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Employees;
