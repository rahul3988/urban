import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  resource: string;
  resourceId: string;
  userId: string;
  userName: string;
  userType: 'admin' | 'user' | 'vendor' | 'driver';
  ipAddress: string;
  userAgent: string;
  details: {
    oldValues?: any;
    newValues?: any;
    metadata?: any;
  };
  status: 'success' | 'failure' | 'warning';
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState('7');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchLogs = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setLogs([
          {
            id: '1',
            timestamp: '2024-01-15T10:30:00Z',
            action: 'CREATE',
            resource: 'USER',
            resourceId: 'user_123',
            userId: 'admin_1',
            userName: 'Admin User',
            userType: 'admin',
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            details: {
              newValues: {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+91 9876543210',
              },
            },
            status: 'success',
          },
          {
            id: '2',
            timestamp: '2024-01-15T10:25:00Z',
            action: 'UPDATE',
            resource: 'VENDOR',
            resourceId: 'vendor_456',
            userId: 'admin_2',
            userName: 'Support Admin',
            userType: 'admin',
            ipAddress: '192.168.1.101',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            details: {
              oldValues: {
                status: 'pending',
              },
              newValues: {
                status: 'active',
              },
            },
            status: 'success',
          },
          {
            id: '3',
            timestamp: '2024-01-15T10:20:00Z',
            action: 'LOGIN',
            resource: 'AUTH',
            resourceId: 'auth_789',
            userId: 'user_123',
            userName: 'John Doe',
            userType: 'user',
            ipAddress: '192.168.1.102',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
            details: {
              metadata: {
                loginMethod: 'email',
                deviceType: 'mobile',
              },
            },
            status: 'success',
          },
          {
            id: '4',
            timestamp: '2024-01-15T10:15:00Z',
            action: 'DELETE',
            resource: 'ORDER',
            resourceId: 'order_101',
            userId: 'vendor_456',
            userName: 'Pizza Palace',
            userType: 'vendor',
            ipAddress: '192.168.1.103',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            details: {
              oldValues: {
                status: 'pending',
                items: ['Pizza Margherita', 'Coca Cola'],
              },
            },
            status: 'warning',
          },
          {
            id: '5',
            timestamp: '2024-01-15T10:10:00Z',
            action: 'LOGIN_FAILED',
            resource: 'AUTH',
            resourceId: 'auth_102',
            userId: 'unknown',
            userName: 'Unknown User',
            userType: 'user',
            ipAddress: '192.168.1.104',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            details: {
              metadata: {
                attemptedEmail: 'hacker@example.com',
                reason: 'Invalid credentials',
              },
            },
            status: 'failure',
          },
        ]);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [dateRange]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resourceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesUserType = userTypeFilter === 'all' || log.userType === userTypeFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
    return matchesSearch && matchesAction && matchesUserType && matchesStatus;
  });

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      success: 'bg-green-100 text-green-800',
      failure: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getActionBadge = (action: string) => {
    const actionClasses = {
      CREATE: 'bg-blue-100 text-blue-800',
      UPDATE: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800',
      LOGIN: 'bg-green-100 text-green-800',
      LOGIN_FAILED: 'bg-red-100 text-red-800',
      LOGOUT: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${actionClasses[action as keyof typeof actionClasses] || 'bg-gray-100 text-gray-800'}`}>
        {action.replace('_', ' ')}
      </span>
    );
  };

  const getUserTypeBadge = (userType: string) => {
    const typeClasses = {
      admin: 'bg-purple-100 text-purple-800',
      user: 'bg-blue-100 text-blue-800',
      vendor: 'bg-green-100 text-green-800',
      driver: 'bg-orange-100 text-orange-800',
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeClasses[userType as keyof typeof typeClasses]}`}>
        {userType.charAt(0).toUpperCase() + userType.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-gray-600">Track system activities and user actions</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Last 24 hours</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Export Logs
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="LOGIN">Login</option>
                <option value="LOGIN_FAILED">Login Failed</option>
                <option value="LOGOUT">Logout</option>
              </select>
            </div>

            {/* User Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
              <select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="vendor">Vendor</option>
                <option value="driver">Driver</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
                <option value="warning">Warning</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.resource}</div>
                        <div className="text-sm text-gray-500">{log.resourceId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                        <div className="text-sm text-gray-500">{getUserTypeBadge(log.userType)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(log)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log Details Modal */}
        {showModal && selectedLog && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Audit Log Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                      <p className="text-sm text-gray-900">{formatTimestamp(selectedLog.timestamp)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Action</label>
                      <div className="mt-1">{getActionBadge(selectedLog.action)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Resource</label>
                      <p className="text-sm text-gray-900">{selectedLog.resource}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Resource ID</label>
                      <p className="text-sm text-gray-900">{selectedLog.resourceId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">User</label>
                      <p className="text-sm text-gray-900">{selectedLog.userName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">User Type</label>
                      <div className="mt-1">{getUserTypeBadge(selectedLog.userType)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">IP Address</label>
                      <p className="text-sm text-gray-900">{selectedLog.ipAddress}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User Agent</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-900 break-all">{selectedLog.userAgent}</p>
                    </div>
                  </div>

                  {selectedLog.details.oldValues && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Old Values</label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                          {JSON.stringify(selectedLog.details.oldValues, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {selectedLog.details.newValues && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Values</label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                          {JSON.stringify(selectedLog.details.newValues, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {selectedLog.details.metadata && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Metadata</label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                          {JSON.stringify(selectedLog.details.metadata, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AuditLogs;
