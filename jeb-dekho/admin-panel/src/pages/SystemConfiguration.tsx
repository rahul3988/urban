import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

interface SystemConfig {
  general: {
    appName: string;
    appVersion: string;
    maintenanceMode: boolean;
    maintenanceMessage: string;
    defaultLanguage: string;
    timezone: string;
  };
  services: {
    transport: {
      enabled: boolean;
      commissionRate: number;
      minFare: number;
      maxFare: number;
    };
    food: {
      enabled: boolean;
      commissionRate: number;
      deliveryFee: number;
      minOrderAmount: number;
    };
    mart: {
      enabled: boolean;
      commissionRate: number;
      deliveryFee: number;
      minOrderAmount: number;
    };
  };
  payments: {
    razorpay: {
      enabled: boolean;
      keyId: string;
      keySecret: string;
    };
    paytm: {
      enabled: boolean;
      merchantId: string;
      merchantKey: string;
    };
    cashOnDelivery: {
      enabled: boolean;
      maxAmount: number;
    };
  };
  notifications: {
    email: {
      enabled: boolean;
      smtpHost: string;
      smtpPort: number;
      smtpUsername: string;
      smtpPassword: string;
    };
    sms: {
      enabled: boolean;
      provider: string;
      apiKey: string;
    };
    push: {
      enabled: boolean;
      firebaseKey: string;
    };
  };
  security: {
    jwtSecret: string;
    jwtExpiry: number;
    passwordMinLength: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
}

const SystemConfiguration: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    // Simulate API call
    const fetchConfig = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setConfig({
          general: {
            appName: 'Jeb Dekho',
            appVersion: '1.0.0',
            maintenanceMode: false,
            maintenanceMessage: 'We are currently under maintenance. Please try again later.',
            defaultLanguage: 'en',
            timezone: 'Asia/Kolkata',
          },
          services: {
            transport: {
              enabled: true,
              commissionRate: 10,
              minFare: 50,
              maxFare: 5000,
            },
            food: {
              enabled: true,
              commissionRate: 15,
              deliveryFee: 30,
              minOrderAmount: 100,
            },
            mart: {
              enabled: true,
              commissionRate: 12,
              deliveryFee: 25,
              minOrderAmount: 200,
            },
          },
          payments: {
            razorpay: {
              enabled: true,
              keyId: 'rzp_test_1234567890',
              keySecret: '****************',
            },
            paytm: {
              enabled: false,
              merchantId: '',
              merchantKey: '',
            },
            cashOnDelivery: {
              enabled: true,
              maxAmount: 2000,
            },
          },
          notifications: {
            email: {
              enabled: true,
              smtpHost: 'smtp.gmail.com',
              smtpPort: 587,
              smtpUsername: 'noreply@jebdekho.com',
              smtpPassword: '****************',
            },
            sms: {
              enabled: true,
              provider: 'Twilio',
              apiKey: '****************',
            },
            push: {
              enabled: true,
              firebaseKey: '****************',
            },
          },
          security: {
            jwtSecret: '****************',
            jwtExpiry: 24,
            passwordMinLength: 8,
            maxLoginAttempts: 5,
            lockoutDuration: 30,
          },
        });
      } catch (error) {
        console.error('Error fetching config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    if (!config) return;
    
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Configuration saved:', config);
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error saving configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfigChange = (section: keyof SystemConfig, field: string, value: any) => {
    if (!config) return;
    
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [field]: value,
      },
    });
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'services', name: 'Services', icon: '🚀' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'notifications', name: 'Notifications', icon: '📧' },
    { id: 'security', name: 'Security', icon: '🔒' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!config) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">No configuration data available</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Configuration</h1>
            <p className="text-gray-600">Manage system settings and configurations</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
                    <input
                      type="text"
                      value={config.general.appName}
                      onChange={(e) => handleConfigChange('general', 'appName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">App Version</label>
                    <input
                      type="text"
                      value={config.general.appVersion}
                      onChange={(e) => handleConfigChange('general', 'appVersion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
                    <select
                      value={config.general.defaultLanguage}
                      onChange={(e) => handleConfigChange('general', 'defaultLanguage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="bn">Bengali</option>
                      <option value="ta">Tamil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={config.general.timezone}
                      onChange={(e) => handleConfigChange('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata</option>
                      <option value="Asia/Dubai">Asia/Dubai</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Europe/London">Europe/London</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.general.maintenanceMode}
                      onChange={(e) => handleConfigChange('general', 'maintenanceMode', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Message</label>
                  <textarea
                    value={config.general.maintenanceMessage}
                    onChange={(e) => handleConfigChange('general', 'maintenanceMessage', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="space-y-8">
                {/* Transport Service */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Transport Service</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.services.transport.enabled}
                          onChange={(e) => handleConfigChange('services', 'transport', {
                            ...config.services.transport,
                            enabled: e.target.checked,
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Enable Transport Service</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                      <input
                        type="number"
                        value={config.services.transport.commissionRate}
                        onChange={(e) => handleConfigChange('services', 'transport', {
                          ...config.services.transport,
                          commissionRate: parseFloat(e.target.value),
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Fare (₹)</label>
                      <input
                        type="number"
                        value={config.services.transport.minFare}
                        onChange={(e) => handleConfigChange('services', 'transport', {
                          ...config.services.transport,
                          minFare: parseFloat(e.target.value),
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Fare (₹)</label>
                      <input
                        type="number"
                        value={config.services.transport.maxFare}
                        onChange={(e) => handleConfigChange('services', 'transport', {
                          ...config.services.transport,
                          maxFare: parseFloat(e.target.value),
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Food Service */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Food Service</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.services.food.enabled}
                          onChange={(e) => handleConfigChange('services', 'food', {
                            ...config.services.food,
                            enabled: e.target.checked,
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Enable Food Service</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                      <input
                        type="number"
                        value={config.services.food.commissionRate}
                        onChange={(e) => handleConfigChange('services', 'food', {
                          ...config.services.food,
                          commissionRate: parseFloat(e.target.value),
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee (₹)</label>
                      <input
                        type="number"
                        value={config.services.food.deliveryFee}
                        onChange={(e) => handleConfigChange('services', 'food', {
                          ...config.services.food,
                          deliveryFee: parseFloat(e.target.value),
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Amount (₹)</label>
                      <input
                        type="number"
                        value={config.services.food.minOrderAmount}
                        onChange={(e) => handleConfigChange('services', 'food', {
                          ...config.services.food,
                          minOrderAmount: parseFloat(e.target.value),
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Mart Service */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Mart Service</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.services.mart.enabled}
                          onChange={(e) => handleConfigChange('services', 'mart', {
                            ...config.services.mart,
                            enabled: e.target.checked,
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Enable Mart Service</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                      <input
                        type="number"
                        value={config.services.mart.commissionRate}
                        onChange={(e) => handleConfigChange('services', 'mart', {
                          ...config.services.mart,
                          commissionRate: parseFloat(e.target.value),
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee (₹)</label>
                      <input
                        type="number"
                        value={config.services.mart.deliveryFee}
                        onChange={(e) => handleConfigChange('services', 'mart', {
                          ...config.services.mart,
                          deliveryFee: parseFloat(e.target.value),
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Amount (₹)</label>
                      <input
                        type="number"
                        value={config.services.mart.minOrderAmount}
                        onChange={(e) => handleConfigChange('services', 'mart', {
                          ...config.services.mart,
                          minOrderAmount: parseFloat(e.target.value),
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Razorpay</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.payments.razorpay.enabled}
                          onChange={(e) => handleConfigChange('payments', 'razorpay', {
                            ...config.payments.razorpay,
                            enabled: e.target.checked,
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Enable Razorpay</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Key ID</label>
                      <input
                        type="text"
                        value={config.payments.razorpay.keyId}
                        onChange={(e) => handleConfigChange('payments', 'razorpay', {
                          ...config.payments.razorpay,
                          keyId: e.target.value,
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Key Secret</label>
                      <input
                        type="password"
                        value={config.payments.razorpay.keySecret}
                        onChange={(e) => handleConfigChange('payments', 'razorpay', {
                          ...config.payments.razorpay,
                          keySecret: e.target.value,
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Cash on Delivery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.payments.cashOnDelivery.enabled}
                          onChange={(e) => handleConfigChange('payments', 'cashOnDelivery', {
                            ...config.payments.cashOnDelivery,
                            enabled: e.target.checked,
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Enable Cash on Delivery</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Amount (₹)</label>
                      <input
                        type="number"
                        value={config.payments.cashOnDelivery.maxAmount}
                        onChange={(e) => handleConfigChange('payments', 'cashOnDelivery', {
                          ...config.payments.cashOnDelivery,
                          maxAmount: parseFloat(e.target.value),
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.notifications.email.enabled}
                          onChange={(e) => handleConfigChange('notifications', 'email', {
                            ...config.notifications.email,
                            enabled: e.target.checked,
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Enable Email Notifications</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                      <input
                        type="text"
                        value={config.notifications.email.smtpHost}
                        onChange={(e) => handleConfigChange('notifications', 'email', {
                          ...config.notifications.email,
                          smtpHost: e.target.value,
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                      <input
                        type="number"
                        value={config.notifications.email.smtpPort}
                        onChange={(e) => handleConfigChange('notifications', 'email', {
                          ...config.notifications.email,
                          smtpPort: parseInt(e.target.value),
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                      <input
                        type="text"
                        value={config.notifications.email.smtpUsername}
                        onChange={(e) => handleConfigChange('notifications', 'email', {
                          ...config.notifications.email,
                          smtpUsername: e.target.value,
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">JWT Secret</label>
                    <input
                      type="password"
                      value={config.security.jwtSecret}
                      onChange={(e) => handleConfigChange('security', 'jwtSecret', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">JWT Expiry (hours)</label>
                    <input
                      type="number"
                      value={config.security.jwtExpiry}
                      onChange={(e) => handleConfigChange('security', 'jwtExpiry', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password Min Length</label>
                    <input
                      type="number"
                      value={config.security.passwordMinLength}
                      onChange={(e) => handleConfigChange('security', 'passwordMinLength', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                    <input
                      type="number"
                      value={config.security.maxLoginAttempts}
                      onChange={(e) => handleConfigChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lockout Duration (minutes)</label>
                    <input
                      type="number"
                      value={config.security.lockoutDuration}
                      onChange={(e) => handleConfigChange('security', 'lockoutDuration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemConfiguration;
