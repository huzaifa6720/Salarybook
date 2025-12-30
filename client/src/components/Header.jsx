import React from 'react';
import { Bell, User } from 'lucide-react';
import './Layout.css';

const Header = ({ user, title }) => {
    return (
        <header className="header">
            <h2 className="header-title">{title}</h2>
            <div className="header-actions">
                <button className="icon-btn" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                    <Bell size={20} />
                </button>
                <div className="user-profile">
                    <div className="avatar">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{user?.name || 'User'}</span>
                        <span className="user-role">{user?.role || 'Role'}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
