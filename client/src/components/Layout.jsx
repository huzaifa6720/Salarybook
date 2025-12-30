import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ user }) => {
    const location = useLocation();

    const getPageTitle = (pathname) => {
        if (pathname === '/dashboard') {
            switch (user?.role) {
                case 'Employee': return 'My Portal';
                case 'Viewer': return 'Viewer Dashboard';
                case 'Accountant': return 'Accountant Dashboard';
                default: return 'Admin Dashboard';
            }
        }
        switch (pathname) {
            case '/employees': return 'Employee Management';
            case '/payroll': return 'Payroll Processing';
            case '/payslips': return 'Payslip Generation';
            case '/reports': return 'Reports & Analytics';
            case '/settings': return 'Settings';
            default: return 'Dashboard';
        }
    };

    return (
        <div className="layout-container">
            <Sidebar />
            <main className="main-content">
                <Header user={user} title={getPageTitle(location.pathname)} />
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
