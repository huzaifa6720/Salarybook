import React, { useState } from 'react';
import { Save, Building, Settings as SettingsIcon } from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('company');
    const [formData, setFormData] = useState({
        companyName: 'SalaryBook Demo Company',
        address: '123 Business Street, Karachi, Pakistan',
        email: 'info@salarybook.com',
        currency: 'PKR'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would make an API call
        console.log('Saving settings:', formData);
        alert('Settings saved successfully!');
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h2>Settings</h2>
                <p>Manage system configuration and preferences</p>
            </div>

            <div className="settings-tabs">
                <button
                    className={`tab-btn ${activeTab === 'company' ? 'active' : ''}`}
                    onClick={() => setActiveTab('company')}
                >
                    <Building size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                    Company
                </button>
                <button
                    className={`tab-btn ${activeTab === 'system' ? 'active' : ''}`}
                    onClick={() => setActiveTab('system')}
                >
                    <SettingsIcon size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                    System
                </button>
            </div>

            {activeTab === 'company' && (
                <div className="settings-card">
                    <div className="card-header">
                        <h3>Company Information</h3>
                        <p>Update your company details that appear on payslips</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Company Name *</label>
                            <input
                                type="text"
                                name="companyName"
                                className="form-control"
                                value={formData.companyName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Address *</label>
                            <input
                                type="text"
                                name="address"
                                className="form-control"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Contact Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Currency *</label>
                                <input
                                    type="text"
                                    name="currency"
                                    className="form-control"
                                    value={formData.currency}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-save">
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'system' && (
                <div className="settings-card">
                    <div className="card-header">
                        <h3>System Configuration</h3>
                        <p>Manage general system settings</p>
                    </div>
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        System settings content would go here...
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
