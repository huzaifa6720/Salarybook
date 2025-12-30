import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Banknote, FileText, BarChart3, Settings, LogOut, DollarSign } from 'lucide-react';
import './Layout.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'Viewer';

  const allNavItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard', roles: ['Admin', 'Accountant', 'Viewer', 'Employee'] },
    { name: 'Employees', icon: <Users size={20} />, path: '/employees', roles: ['Admin', 'Accountant'] },
    { name: 'Payroll', icon: <Banknote size={20} />, path: '/payroll', roles: ['Admin', 'Accountant'] },
    { name: 'Payslips', icon: <FileText size={20} />, path: '/payslips', roles: ['Admin', 'Accountant', 'Viewer', 'Employee'] },
    { name: 'Reports', icon: <BarChart3 size={20} />, path: '/reports', roles: ['Admin', 'Viewer'] },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings', roles: ['Admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login'; // Force reload to clear state
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <DollarSign size={24} color="white" />
          </div>
          <span>SalaryBook</span>
        </div>
      </div>

      <div className="sidebar-content">
        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
