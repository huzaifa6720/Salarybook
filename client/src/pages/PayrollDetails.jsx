import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Save, AlertCircle } from 'lucide-react';
import './Payroll.css';

const PayrollDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [payroll, setPayroll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingRecord, setEditingRecord] = useState(null);
    const [editValues, setEditValues] = useState({ overtime: 0, bonus: 0 });

    useEffect(() => {
        fetchPayrollDetails();
    }, [id]);

    const fetchPayrollDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/payroll/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setPayroll(data);
            }
        } catch (error) {
            console.error('Error fetching payroll details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLockPayroll = async () => {
        if (!window.confirm('Are you sure you want to lock this payroll? No further changes can be made.')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/payroll/${id}/lock`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchPayrollDetails();
            }
        } catch (error) {
            console.error('Error locking payroll:', error);
        }
    };

    const handleEditRecord = (record) => {
        setEditingRecord(record);
        setEditValues({
            overtime: record.allowanceDetails.overtime || 0,
            bonus: 0 // Placeholder if bonus field exists
        });
    };

    const handleSaveRecord = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/payroll/${id}/record/${editingRecord._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editValues)
            });

            if (response.ok) {
                setEditingRecord(null);
                fetchPayrollDetails();
            }
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!payroll) return <div>Payroll not found</div>;

    return (
        <div className="payroll-container">
            <div className="payroll-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="icon-btn" onClick={() => navigate('/payroll')}>
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="payroll-title">{payroll.month} {payroll.year} Payroll</h2>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                            <span className={`status-tag status-${payroll.status.toLowerCase()}`}>
                                {payroll.status}
                            </span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                Total Payout: <b>${payroll.totalPayout.toLocaleString()}</b>
                            </span>
                        </div>
                    </div>
                </div>

                {payroll.status !== 'Locked' && (
                    <button className="process-btn" style={{ backgroundColor: 'var(--text-color)' }} onClick={handleLockPayroll}>
                        <Lock size={18} />
                        Lock Payroll
                    </button>
                )}
            </div>

            <div className="employees-table-container">
                <table className="employees-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Base Salary</th>
                            <th>Allowances</th>
                            <th>Deductions</th>
                            <th>Overtime</th>
                            <th>Net Pay</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payroll.records.map((record) => (
                            <tr key={record._id}>
                                <td>
                                    <div style={{ fontWeight: 500 }}>{record.employeeName}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{record.designation}</div>
                                </td>
                                <td>${record.baseSalary.toLocaleString()}</td>
                                <td>${record.totalAllowances.toLocaleString()}</td>
                                <td>${record.totalDeductions.toLocaleString()}</td>
                                <td>
                                    {editingRecord?._id === record._id ? (
                                        <input
                                            type="number"
                                            className="search-input"
                                            style={{ width: '80px', padding: '0.25rem' }}
                                            value={editValues.overtime}
                                            onChange={(e) => setEditValues({ ...editValues, overtime: e.target.value })}
                                        />
                                    ) : (
                                        `$${record.allowanceDetails.overtime.toLocaleString()}`
                                    )}
                                </td>
                                <td style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                                    ${record.netPay.toLocaleString()}
                                </td>
                                <td>
                                    {payroll.status !== 'Locked' && (
                                        editingRecord?._id === record._id ? (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="action-btn" onClick={handleSaveRecord} style={{ color: 'var(--success)' }}>
                                                    <Save size={18} />
                                                </button>
                                                <button className="action-btn" onClick={() => setEditingRecord(null)}>
                                                    X
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="action-btn" onClick={() => handleEditRecord(record)}>
                                                Edit
                                            </button>
                                        )
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayrollDetails;
