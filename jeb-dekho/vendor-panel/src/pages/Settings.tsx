import React, { useState } from 'react';
import Layout from '../components/Layout';

interface BusinessSettings {
  businessName: string;
  businessType: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
  cuisine: string[];
  deliveryRadius: number;
  minimumOrderAmount: number;
  deliveryFee: number;
  preparationTime: number;
  isOpen: boolean;
  operatingHours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  };
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'business' | 'delivery' | 'notifications' | 'account'>('business');
  const [isLoading, setIsLoading] = useState(false);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    businessName: 'Pizza Palace',
    businessType: 'Restaurant',
    description: 'Authentic Italian pizza and pasta restaurant',
    address: '123, MG Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91 9876543210',
    email: 'info@pizzapalace.com',
    website: 'www.pizzapalace.com',
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    deliveryRadius: 5,
    minimumOrderAmount: 200,
    deliveryFee: 30,
    preparationTime: 25,
    isOpen: true,
    operatingHours: {
      monday: { open: '10:00', close: '22:00', isOpen: true },
      tuesday: { open: '10:00', close: '22:00', isOpen: true },
      wednesday: { open: '10:00', close: '22:00', isOpen: true },
      thursday: { open: '10:00', close: '22:00', isOpen: true },
      friday: { open: '10:00', close: '23:00', isOpen: true },
      saturday: { open: '10:00', close: '23:00', isOpen: true },
      sunday: { open: '11:00', close: '22:00', isOpen: true }
    }
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    orderUpdates: true,
    customerReviews: true,
    promotions: false,
    systemUpdates: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });

  const [accountSettings, setAccountSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    dataExport: false,
    accountDeletion: false
  });

  const handleBusinessSettingsChange = (field: keyof BusinessSettings, value: any) => {
    setBusinessSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOperatingHoursChange = (day: string, field: string, value: string | boolean) => {
    setBusinessSettings(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleNotificationSettingsChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    // Show success message
    alert('Settings saved successfully!');
  };

  const tabs = [
    { key: 'business', label: 'Business Info', icon: '🏪' },
    { key: 'delivery', label: 'Delivery Settings', icon: '🚚' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
    { key: 'account', label: 'Account', icon: '👤' }
  ];

  const cuisineOptions = [
    'Italian', 'Chinese', 'Indian', 'Mexican', 'Thai', 'Japanese', 'American', 'Mediterranean', 'Fast Food', 'Desserts'
  ];

  const BusinessInfoTab = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
            <input
              type="text"
              value={businessSettings.businessName}
              onChange={(e) => handleBusinessSettingsChange('businessName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
            <select
              value={businessSettings.businessType}
              onChange={(e) => handleBusinessSettingsChange('businessType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            >
              <option value="Restaurant">Restaurant</option>
              <option value="Cafe">Cafe</option>
              <option value="Food Truck">Food Truck</option>
              <option value="Cloud Kitchen">Cloud Kitchen</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={businessSettings.description}
              onChange={(e) => handleBusinessSettingsChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={businessSettings.phone}
              onChange={(e) => handleBusinessSettingsChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={businessSettings.email}
              onChange={(e) => handleBusinessSettingsChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              value={businessSettings.website}
              onChange={(e) => handleBusinessSettingsChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <input
              type="text"
              value={businessSettings.address}
              onChange={(e) => handleBusinessSettingsChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={businessSettings.city}
              onChange={(e) => handleBusinessSettingsChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={businessSettings.state}
              onChange={(e) => handleBusinessSettingsChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
            <input
              type="text"
              value={businessSettings.pincode}
              onChange={(e) => handleBusinessSettingsChange('pincode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Cuisine Types */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cuisine Types</h3>
        <div className="flex flex-wrap gap-2">
          {cuisineOptions.map(cuisine => (
            <label key={cuisine} className="flex items-center">
              <input
                type="checkbox"
                checked={businessSettings.cuisine.includes(cuisine)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleBusinessSettingsChange('cuisine', [...businessSettings.cuisine, cuisine]);
                  } else {
                    handleBusinessSettingsChange('cuisine', businessSettings.cuisine.filter(c => c !== cuisine));
                  }
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{cuisine}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h3>
        <div className="space-y-3">
          {Object.entries(businessSettings.operatingHours).map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4">
              <div className="w-20">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hours.isOpen}
                    onChange={(e) => handleOperatingHoursChange(day, 'isOpen', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">{day}</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={hours.open}
                  onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                  disabled={!hours.isOpen}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent disabled:bg-gray-100"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  value={hours.close}
                  onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                  disabled={!hours.isOpen}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DeliverySettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Radius (km)</label>
            <input
              type="number"
              value={businessSettings.deliveryRadius}
              onChange={(e) => handleBusinessSettingsChange('deliveryRadius', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Amount (₹)</label>
            <input
              type="number"
              value={businessSettings.minimumOrderAmount}
              onChange={(e) => handleBusinessSettingsChange('minimumOrderAmount', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee (₹)</label>
            <input
              type="number"
              value={businessSettings.deliveryFee}
              onChange={(e) => handleBusinessSettingsChange('deliveryFee', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Time (minutes)</label>
            <input
              type="number"
              value={businessSettings.preparationTime}
              onChange={(e) => handleBusinessSettingsChange('preparationTime', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Status</h3>
        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={businessSettings.isOpen}
              onChange={(e) => handleBusinessSettingsChange('isOpen', e.target.checked)}
              className="mr-3"
            />
            <span className="text-sm font-medium text-gray-700">Currently Open for Orders</span>
          </label>
        </div>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'newOrders', label: 'New Orders', description: 'Get notified when new orders are placed' },
            { key: 'orderUpdates', label: 'Order Updates', description: 'Get notified about order status changes' },
            { key: 'customerReviews', label: 'Customer Reviews', description: 'Get notified when customers leave reviews' },
            { key: 'promotions', label: 'Promotions', description: 'Get notified about promotional offers and campaigns' },
            { key: 'systemUpdates', label: 'System Updates', description: 'Get notified about system maintenance and updates' }
          ].map(notification => (
            <div key={notification.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{notification.label}</p>
                <p className="text-sm text-gray-500">{notification.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings[notification.key as keyof typeof notificationSettings]}
                  onChange={(e) => handleNotificationSettingsChange(notification.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-food-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-food-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
            { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive notifications in the app' }
          ].map(channel => (
            <div key={channel.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{channel.label}</p>
                <p className="text-sm text-gray-500">{channel.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings[channel.key as keyof typeof notificationSettings]}
                  onChange={(e) => handleNotificationSettingsChange(channel.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-food-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-food-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AccountTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              value={accountSettings.currentPassword}
              onChange={(e) => setAccountSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={accountSettings.newPassword}
              onChange={(e) => setAccountSettings(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={accountSettings.confirmPassword}
              onChange={(e) => setAccountSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
            />
          </div>
          <button className="bg-food-primary text-white px-4 py-2 rounded-lg hover:bg-food-secondary transition-colors">
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={accountSettings.twoFactorAuth}
                onChange={(e) => setAccountSettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-food-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-food-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Export Data</p>
              <p className="text-sm text-gray-500">Download a copy of your data</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Export
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'business':
        return <BusinessInfoTab />;
      case 'delivery':
        return <DeliverySettingsTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'account':
        return <AccountTab />;
      default:
        return <BusinessInfoTab />;
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600">Manage your restaurant settings and preferences</p>
          </div>
          <button
            onClick={saveSettings}
            disabled={isLoading}
            className="bg-food-primary text-white px-4 py-2 rounded-lg hover:bg-food-secondary transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-food-primary text-food-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </Layout>
  );
};

export default Settings;
