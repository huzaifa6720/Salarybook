import React, { useState, useEffect } from 'react';
import { Download, Search, FileText } from 'lucide-react';
import './Payroll.css'; // Reusing payroll styles

const Payslips = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [selectedPayroll, setSelectedPayroll] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayrolls();
    }, []);

    const fetchPayrolls = async () => {
        try {
            const token = localStorage.getItem('token');
            // Only fetch Locked (Finalized) payrolls for payslip generation
            const response = await fetch('http://localhost:5000/api/payroll', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Filter only locked payrolls
                const lockedPayrolls = data.filter(p => p.status === 'Locked');
                setPayrolls(lockedPayrolls);
                if (lockedPayrolls.length > 0) {
                    setSelectedPayroll(lockedPayrolls[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching payrolls:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (recordId, employeeName) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/payroll/${selectedPayroll._id}/record/${recordId}/download`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Payslip_${employeeName}_${selectedPayroll.month}_${selectedPayroll.year}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Error downloading payslip');
            }
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    const filteredRecords = selectedPayroll
        ? selectedPayroll.records.filter(record =>
            record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.designation.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <div className="payroll-container">
            <div className="payroll-header">
                <div>
                    <h2 className="payroll-title">Payslip Generation</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Download and distribute monthly salary slips.
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                {/* Sidebar: List of Payrolls */}
                <div className="card" style={{ background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, backgroundColor: '#F9FAFB' }}>
                        Select Period
                    </div>
                    <div style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                        {loading ? (
                            <div style={{ padding: '1rem' }}>Loading...</div>
                        ) : payrolls.length === 0 ? (
                            <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>No finalized payrolls found.</div>
                        ) : (
                            payrolls.map(payroll => (
                                <div
                                    key={payroll._id}
                                    onClick={() => setSelectedPayroll(payroll)}
                                    style={{
                                        padding: '1rem',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid var(--border-color)',
                                        backgroundColor: selectedPayroll?._id === payroll._id ? '#EFF6FF' : 'transparent',
                                        color: selectedPayroll?._id === payroll._id ? 'var(--primary-color)' : 'inherit',
                                        fontWeight: selectedPayroll?._id === payroll._id ? 500 : 400
                                    }}
                                >
                                    {payroll.month} {payroll.year}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Content: List of Employees */}
                <div className="card" style={{ background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                    {selectedPayroll ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                                    Payslips for {selectedPayroll.month} {selectedPayroll.year}
                                </h3>
                                <div className="search-input-wrapper" style={{ maxWidth: '300px' }}>
                                    <Search className="search-icon" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search employee..."
                                        className="search-input"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="employees-table-container">
                                <table className="employees-table">
                                    <thead>
                                        <tr>
                                            <th>Employee</th>
                                            <th>Designation</th>
                                            <th>Net Pay</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRecords.map(record => (
                                            <tr key={record._id}>
                                                <td>
                                                    <div style={{ fontWeight: 500 }}>{record.employeeName}</div>
                                                </td>
                                                <td>{record.designation}</td>
                                                <td>${record.netPay.toLocaleString()}</td>
                                                <td>
                                                    <span className="status-tag status-locked">Generated</span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="action-btn"
                                                        style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                        onClick={() => handleDownload(record._id, record.employeeName)}
                                                    >
                                                        <Download size={18} />
                                                        Download
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                            <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Select a payroll period to view payslips.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payslips;
