import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleType: 'bike' | 'car' | 'truck';
  vehicleNumber: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  registrationDate: string;
  totalTrips: number;
  totalEarnings: number;
  rating: number;
  address: string;
  documents: {
    drivingLicense: boolean;
    vehicleRegistration: boolean;
    insurance: boolean;
    pucCertificate: boolean;
  };
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
}

const DriverManagement: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDrivers([
          {
            id: '1',
            name: 'Rajesh Kumar',
            email: 'rajesh@example.com',
            phone: '+91 9876543210',
            licenseNumber: 'DL123456789',
            vehicleType: 'bike',
            vehicleNumber: 'MH01AB1234',
            status: 'active',
            registrationDate: '2024-01-01',
            totalTrips: 1250,
            totalEarnings: 45000,
            rating: 4.5,
            address: '123 Main Street, Mumbai',
            documents: {
              drivingLicense: true,
              vehicleRegistration: true,
              insurance: true,
              pucCertificate: true,
            },
            currentLocation: {
              lat: 19.0760,
              lng: 72.8777,
              address: 'Near Gateway of India, Mumbai',
            },
          },
          {
            id: '2',
            name: 'Priya Sharma',
            email: 'priya@example.com',
            phone: '+91 9876543211',
            licenseNumber: 'DL987654321',
            vehicleType: 'car',
            vehicleNumber: 'DL01CD5678',
            status: 'pending',
            registrationDate: '2024-01-15',
            totalTrips: 0,
            totalEarnings: 0,
            rating: 0,
            address: '456 Park Avenue, Delhi',
            documents: {
              drivingLicense: true,
              vehicleRegistration: false,
              insurance: false,
              pucCertificate: true,
            },
          },
          {
            id: '3',
            name: 'Amit Singh',
            email: 'amit@example.com',
            phone: '+91 9876543212',
            licenseNumber: 'DL456789123',
            vehicleType: 'truck',
            vehicleNumber: 'KA01EF9012',
            status: 'active',
            registrationDate: '2023-12-15',
            totalTrips: 890,
            totalEarnings: 32000,
            rating: 4.2,
            address: '789 Business District, Bangalore',
            documents: {
              drivingLicense: true,
              vehicleRegistration: true,
              insurance: true,
              pucCertificate: false,
            },
            currentLocation: {
              lat: 12.9716,
              lng: 77.5946,
              address: 'Near MG Road, Bangalore',
            },
          },
        ]);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm) ||
                         driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    const matchesVehicleType = vehicleTypeFilter === 'all' || driver.vehicleType === vehicleTypeFilter;
    
    return matchesSearch && matchesStatus && matchesVehicleType;
  });

  const handleStatusChange = async (driverId: string, newStatus: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDrivers(drivers.map(driver => 
        driver.id === driverId ? { ...driver, status: newStatus as any } : driver
      ));
    } catch (error) {
      console.error('Error updating driver status:', error);
    }
  };

  const handleViewDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getVehicleTypeBadge = (type: string) => {
    const typeClasses = {
      bike: 'bg-blue-100 text-blue-800',
      car: 'bg-purple-100 text-purple-800',
      truck: 'bg-orange-100 text-orange-800',
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeClasses[type as keyof typeof typeClasses]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
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
            <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
            <p className="text-gray-600">Manage drivers, their status, and vehicle information</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add New Driver
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Vehicle Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
              <select
                value={vehicleTypeFilter}
                onChange={(e) => setVehicleTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="bike">Bike</option>
                <option value="car">Car</option>
                <option value="truck">Truck</option>
              </select>
            </div>
          </div>
        </div>

        {/* Drivers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trips
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                        <div className="text-sm text-gray-500">{driver.email}</div>
                        <div className="text-sm text-gray-500">{driver.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        {getVehicleTypeBadge(driver.vehicleType)}
                        <div className="text-sm text-gray-900 mt-1">{driver.vehicleNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(driver.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {driver.totalTrips.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(driver.totalEarnings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {driver.rating > 0 ? (
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{driver.rating}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No rating</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {driver.currentLocation ? (
                        <div>
                          <div className="text-xs text-gray-500">Online</div>
                          <div className="text-xs">{driver.currentLocation.address}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Offline</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(driver)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <select
                          value={driver.status}
                          onChange={(e) => handleStatusChange(driver.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Driver Details Modal */}
        {showModal && selectedDriver && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Driver Details</h3>
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
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedDriver.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedDriver.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedDriver.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">License Number</label>
                      <p className="text-sm text-gray-900">{selectedDriver.licenseNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                      <p className="text-sm text-gray-900">{selectedDriver.vehicleType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                      <p className="text-sm text-gray-900">{selectedDriver.vehicleNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="text-sm text-gray-900">{selectedDriver.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                      <p className="text-sm text-gray-900">{new Date(selectedDriver.registrationDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {selectedDriver.currentLocation && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Location</label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-900">{selectedDriver.currentLocation.address}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Lat: {selectedDriver.currentLocation.lat}, Lng: {selectedDriver.currentLocation.lng}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Documents Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${selectedDriver.documents.drivingLicense ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm">Driving License</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${selectedDriver.documents.vehicleRegistration ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm">Vehicle Registration</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${selectedDriver.documents.insurance ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm">Insurance</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${selectedDriver.documents.pucCertificate ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm">PUC Certificate</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Edit Driver
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

export default DriverManagement;
