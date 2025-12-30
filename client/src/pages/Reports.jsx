import React from 'react';
import { Download, FileText, TrendingUp, DollarSign, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './Reports.css';

const Reports = () => {
    // Mock data for charts
    const monthlyData = [
        { name: 'Jan', gross: 0, deductions: 0, net: 0 },
        { name: 'Feb', gross: 0, deductions: 0, net: 0 },
        { name: 'Mar', gross: 0, deductions: 0, net: 0 },
        { name: 'Apr', gross: 0, deductions: 0, net: 0 },
        { name: 'May', gross: 0, deductions: 0, net: 0 },
        { name: 'Jun', gross: 0, deductions: 0, net: 0 },
        { name: 'Jul', gross: 0, deductions: 0, net: 0 },
        { name: 'Aug', gross: 0, deductions: 0, net: 0 },
        { name: 'Sep', gross: 0, deductions: 0, net: 0 },
        { name: 'Oct', gross: 0, deductions: 0, net: 0 },
        { name: 'Nov', gross: 0, deductions: 0, net: 0 },
        { name: 'Dec', gross: 0, deductions: 0, net: 0 },
    ];

    // Mock data for table
    const summaryData = [
        { month: 'Jan', gross: '-', deductions: '-', net: '-', status: 'Pending' },
        { month: 'Feb', gross: '-', deductions: '-', net: '-', status: 'Pending' },
        { month: 'Mar', gross: '-', deductions: '-', net: '-', status: 'Pending' },
        { month: 'Apr', gross: '-', deductions: '-', net: '-', status: 'Pending' },
        { month: 'May', gross: '-', deductions: '-', net: '-', status: 'Pending' },
        { month: 'Jun', gross: '-', deductions: '-', net: '-', status: 'Pending' },
        { month: 'Jul', gross: '-', deductions: '-', net: '-', status: 'Pending' },
        { month: 'Aug', gross: '-', deductions: '-', net: '-', status: 'Pending' },
        { month: 'Sep', gross: '-', deductions: '-', net: '-', status: 'Pending' },
    ];

    return (
        <div className="reports-container">
            <div className="reports-header">
                <div>
                    <h2>Reports & Analytics</h2>
                    <p>View payroll insights and trends</p>
                </div>
                <div className="header-actions">
                    <select className="year-select">
                        <option>2025</option>
                        <option>2024</option>
                    </select>
                    <button className="btn-export">
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-title">Total Gross</span>
                        <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <div className="stat-value">PKR 0</div>
                    <div className="stat-subtext">Year 2025</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-title">Total Deductions</span>
                        <TrendingUp size={16} className="text-gray-400" />
                    </div>
                    <div className="stat-value">PKR 0</div>
                    <div className="stat-subtext">0% of gross</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-title">Total Net Paid</span>
                        <CreditCard size={16} className="text-gray-400" />
                    </div>
                    <div className="stat-value">PKR 0</div>
                    <div className="stat-subtext">Actual disbursement</div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span className="stat-title">Avg Monthly</span>
                        <FileText size={16} className="text-gray-400" />
                    </div>
                    <div className="stat-value">PKR 0</div>
                    <div className="stat-subtext">0 months processed</div>
                </div>
            </div>

            <div className="charts-section">
                <div className="chart-card">
                    <div className="chart-header">
                        <div className="chart-title">
                            <h3>Payroll Analysis</h3>
                            <p>Monthly Payroll Breakdown</p>
                        </div>
                        <select className="year-select" style={{ fontSize: '12px' }}>
                            <option>Monthly Breakdown</option>
                        </select>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="gross" name="Gross Salary" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="deductions" name="Deductions" fill="#EF4444" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="net" name="Net Salary" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <div className="chart-title">
                            <h3>Net Salary Trend</h3>
                        </div>
                    </div>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="net" name="Net Salary" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="table-card">
                <div className="table-header">
                    <h3>Monthly Summary</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Detailed breakdown by month</p>
                </div>
                <table className="reports-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Gross Salary</th>
                            <th>Deductions</th>
                            <th>Net Salary</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summaryData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.month}</td>
                                <td>{row.gross}</td>
                                <td>{row.deductions}</td>
                                <td>{row.net}</td>
                                <td>
                                    <span className={`status-badge status-${row.status.toLowerCase()}`}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reports;
