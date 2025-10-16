import React, { useState } from 'react';
import Layout from '../components/Layout';

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');

  const orders = {
    active: [
      { id: '12350', customer: 'John Doe', amount: 450, status: 'Preparing', time: '10 mins ago' },
      { id: '12351', customer: 'Jane Smith', amount: 320, status: 'Ready', time: '15 mins ago' },
      { id: '12352', customer: 'Bob Johnson', amount: 680, status: 'New', time: '2 mins ago' },
    ],
    completed: [
      { id: '12345', customer: 'Alice Brown', amount: 550, status: 'Delivered', time: '2 hours ago' },
      { id: '12346', customer: 'Charlie Davis', amount: 290, status: 'Delivered', time: '3 hours ago' },
      { id: '12347', customer: 'Eva Wilson', amount: 420, status: 'Delivered', time: '4 hours ago' },
    ],
    cancelled: [
      { id: '12340', customer: 'Frank Miller', amount: 380, status: 'Cancelled', time: '5 hours ago' },
      { id: '12341', customer: 'Grace Lee', amount: 260, status: 'Cancelled', time: '6 hours ago' },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ready':
        return 'bg-green-100 text-green-800';
      case 'Delivered':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Orders</h2>
        <p className="text-gray-600 mb-8">Orders Screen Ready</p>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['active', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-food-secondary text-food-secondary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab} ({orders[tab as keyof typeof orders].length})
              </button>
            ))}
          </nav>
        </div>

        {/* Orders List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {orders[activeTab as keyof typeof orders].map((order) => (
              <li key={order.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">{order.customer}</p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-gray-500">{order.time}</p>
                      <p className="text-lg font-medium text-gray-900">₹{order.amount}</p>
                    </div>
                  </div>
                  {activeTab === 'active' && (
                    <div className="ml-4 flex space-x-2">
                      <button className="bg-food-secondary text-white px-4 py-2 rounded-md text-sm hover:bg-food-primary">
                        Update Status
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50">
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;