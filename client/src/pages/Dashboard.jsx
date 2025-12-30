import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, Clock, FileText, Calculator, UserPlus, FileBarChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!token || !storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    // Mock Data
    const payrollData = [
        { name: 'Apr', amount: 130000 },
        { name: 'May', amount: 135000 },
        { name: 'Jun', amount: 138000 },
        { name: 'Jul', amount: 142000 },
        { name: 'Aug', amount: 145000 },
        { name: 'Sep', amount: 146000 },
        { name: 'Oct', amount: 148000 },
    ];

    const departmentData = [
        { name: 'Engineering', value: 55, color: '#2563EB' },
        { name: 'Marketing', value: 25, color: '#F59E0B' },
        { name: 'Sales', value: 35, color: '#10B981' },
        { name: 'HR', value: 15, color: '#EF4444' },
        { name: 'Finance', value: 12, color: '#8B5CF6' },
    ];

    if (!user) return <div>Loading...</div>;

    if (!user) return <div>Loading...</div>;

    const { role } = user;

    const AdminDashboard = () => (
        <div className="dashboard-grid">
            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Total Employees</div>
                        <div className="stat-value">45</div>
                        <div className="stat-trend trend-up">↗ +3 this month</div>
                    </div>
                    <div className="stat-icon"><Users size={24} /></div>
                </div>
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Current Month Payroll</div>
                        <div className="stat-value">$148,000</div>
                        <div className="stat-trend trend-up">↗ +4.2% from last month</div>
                    </div>
                    <div className="stat-icon"><DollarSign size={24} /></div>
                </div>
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Pending Approvals</div>
                        <div className="stat-value">3</div>
                        <div className="stat-trend trend-warning">Salary adjustments</div>
                    </div>
                    <div className="stat-icon"><Clock size={24} /></div>
                </div>
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Processed Payslips</div>
                        <div className="stat-value">45</div>
                        <div className="stat-trend trend-success">100% completion</div>
                    </div>
                    <div className="stat-icon"><FileText size={24} /></div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="section-title">Quick Actions</h3>
                <div className="quick-actions-grid">
                    <div className="action-card primary" onClick={() => navigate('/payroll')}>
                        <div className="action-icon"><Calculator size={32} /></div>
                        <div className="action-title">Process Payroll</div>
                        <div className="action-desc">Calculate and process monthly payroll</div>
                    </div>
                    <div className="action-card" onClick={() => navigate('/employees/add')}>
                        <div className="action-icon"><UserPlus size={32} color="var(--primary-color)" /></div>
                        <div className="action-title">Add Employee</div>
                        <div className="action-desc">Register new employee in system</div>
                    </div>
                    <div className="action-card" onClick={() => navigate('/reports')}>
                        <div className="action-icon"><FileBarChart size={32} color="var(--primary-color)" /></div>
                        <div className="action-title">Generate Reports</div>
                        <div className="action-desc">Create payroll and employee reports</div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <div className="chart-card">
                    <h3 className="section-title">Monthly Payroll Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={payrollData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                            <Bar dataKey="amount" fill="#2563EB" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-card">
                    <h3 className="section-title">Department Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={departmentData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {departmentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const AccountantDashboard = () => (
        <div className="dashboard-grid">
            <div className="stats-grid">
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Active Employees</div>
                        <div className="stat-value">2</div>
                    </div>
                    <div className="stat-icon"><Users size={24} /></div>
                </div>
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Salary Structures</div>
                        <div className="stat-value">3</div>
                    </div>
                    <div className="stat-icon"><DollarSign size={24} /></div>
                </div>
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Payslips</div>
                        <div className="stat-value">0</div>
                    </div>
                    <div className="stat-icon"><FileText size={24} /></div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px', backgroundColor: '#FFF7ED', border: '1px solid #FED7AA' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Clock size={24} color="#C2410C" />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#7C2D12', margin: 0 }}>Pending Payroll</h3>
                </div>
                <p style={{ color: '#9A3412', marginBottom: '16px' }}>Process payroll for November 2025</p>
                <button
                    onClick={() => navigate('/payroll')}
                    style={{
                        backgroundColor: '#111827',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        fontWeight: '500'
                    }}
                >
                    Process Now
                </button>
            </div>

            <div>
                <h3 className="section-title">Quick Actions</h3>
                <div className="quick-actions-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div className="action-card" onClick={() => navigate('/employees')}>
                        <div className="action-icon"><Users size={24} color="var(--primary-color)" /></div>
                        <div className="action-title">Manage Employees</div>
                    </div>
                    <div className="action-card" onClick={() => navigate('/payroll')}>
                        <div className="action-icon"><DollarSign size={24} color="var(--primary-color)" /></div>
                        <div className="action-title">Process Payroll</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const ViewerDashboard = () => (
        <div className="dashboard-grid">
            <div className="stats-grid">
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Total Employees</div>
                        <div className="stat-value">2</div>
                    </div>
                    <div className="stat-icon"><Users size={24} /></div>
                </div>
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Payrolls Processed</div>
                        <div className="stat-value">0</div>
                    </div>
                    <div className="stat-icon"><DollarSign size={24} /></div>
                </div>
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Total Payslips</div>
                        <div className="stat-value">0</div>
                    </div>
                    <div className="stat-icon"><FileText size={24} /></div>
                </div>
            </div>

            <div>
                <h3 className="section-title">Quick Actions</h3>
                <div className="quick-actions-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div className="action-card" onClick={() => navigate('/payslips')}>
                        <div className="action-icon"><FileText size={24} color="var(--primary-color)" /></div>
                        <div className="action-title">View Payslips</div>
                    </div>
                    <div className="action-card" onClick={() => navigate('/reports')}>
                        <div className="action-icon"><FileBarChart size={24} color="var(--primary-color)" /></div>
                        <div className="action-title">View Reports</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const EmployeeDashboard = () => (
        <div className="dashboard-grid">
            <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Total Payslips</div>
                        <div className="stat-value">0</div>
                    </div>
                    <div className="stat-icon"><FileText size={24} /></div>
                </div>
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Latest Payslip</div>
                        <div className="stat-value">N/A</div>
                    </div>
                    <div className="stat-icon"><Clock size={24} /></div>
                </div>
            </div>

            <div>
                <h3 className="section-title">Quick Actions</h3>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <button className="action-btn-wide" onClick={() => navigate('/payslips')}>
                        <FileText size={20} />
                        View My Payslips
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <h3 className="section-title">Recent Payslips</h3>
                <p style={{ color: 'var(--text-secondary)' }}>No payslips available yet</p>
            </div>
        </div>
    );

    return (
        <>
            {role === 'Admin' && <AdminDashboard />}
            {role === 'Accountant' && <AccountantDashboard />}
            {role === 'Viewer' && <ViewerDashboard />}
            {role === 'Employee' && <EmployeeDashboard />}
        </>
    );
};

export default Dashboard;
