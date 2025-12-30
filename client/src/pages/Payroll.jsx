import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Calendar, DollarSign, Users, ChevronRight } from 'lucide-react';
import './Payroll.css';

const Payroll = () => {
    const navigate = useNavigate();
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchPayrolls();
    }, []);

    const fetchPayrolls = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/payroll', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setPayrolls(data);
            }
        } catch (error) {
            console.error('Error fetching payrolls:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInitiatePayroll = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/payroll/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ month: selectedMonth, year: selectedYear })
            });

            if (response.ok) {
                const data = await response.json();
                setShowModal(false);
                navigate(`/payroll/${data.payroll._id}`);
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error('Error initiating payroll:', error);
            alert('Server Error');
        }
    };

    return (
        <div className="payroll-container">
            <div className="payroll-header">
                <div>
                    <h2 className="payroll-title">Payroll Processing</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Manage monthly salary disbursements and history.
                    </p>
                </div>
                <button className="process-btn" onClick={() => setShowModal(true)}>
                    <Calculator size={20} />
                    Process Payroll
                </button>
            </div>

            <div className="payroll-history-list">
                {loading ? (
                    <div>Loading...</div>
                ) : payrolls.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        No payroll records found. Start by processing a new payroll.
                    </div>
                ) : (
                    payrolls.map((payroll) => (
                        <div key={payroll._id} className="payroll-card" onClick={() => navigate(`/payroll/${payroll._id}`)}>
                            <div className="payroll-info">
                                <div className="payroll-month">
                                    <Calendar size={16} style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
                                    {payroll.month} {payroll.year}
                                </div>
                                <div className="payroll-stat">
                                    <span className="stat-label">Total Payout</span>
                                    <span className="stat-val">${payroll.totalPayout.toLocaleString()}</span>
                                </div>
                                <div className="payroll-stat">
                                    <span className="stat-label">Employees</span>
                                    <span className="stat-val">{payroll.records.length}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span className={`status-tag status-${payroll.status.toLowerCase()}`}>
                                    {payroll.status}
                                </span>
                                <ChevronRight size={20} color="var(--text-secondary)" />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Initiate Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Process New Payroll</h3>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Select Month</label>
                            <select
                                className="search-input"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                <option value="">Choose Month</option>
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Select Year</label>
                            <input
                                type="number"
                                className="search-input"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="action-btn" onClick={() => setShowModal(false)}>Cancel</button>
                            <button
                                className="process-btn"
                                onClick={handleInitiatePayroll}
                                disabled={!selectedMonth}
                            >
                                Calculate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payroll;
