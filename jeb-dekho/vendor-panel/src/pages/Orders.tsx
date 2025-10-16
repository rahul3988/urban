import React, { useState } from 'react';
import Layout from '../components/Layout';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  orderTime: string;
  estimatedTime: string;
  deliveryAddress: string;
  specialInstructions?: string;
  paymentMethod: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  customizations?: string[];
}

const Orders: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'preparing' | 'ready' | 'completed'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const orders: Order[] = [
    {
      id: 'ORD001',
      customerName: 'John Doe',
      customerPhone: '+91 9876543210',
      items: [
        { id: '1', name: 'Margherita Pizza', quantity: 2, price: 300 },
        { id: '2', name: 'Garlic Bread', quantity: 1, price: 80 },
        { id: '3', name: 'Coca Cola', quantity: 2, price: 60 }
      ],
      totalAmount: 500,
      status: 'pending',
      orderTime: '2024-01-15 19:30',
      estimatedTime: '25 mins',
      deliveryAddress: '123, ABC Street, XYZ Colony, Mumbai - 400001',
      specialInstructions: 'Please ring the doorbell twice',
      paymentMethod: 'UPI'
    },
    {
      id: 'ORD002',
      customerName: 'Jane Smith',
      customerPhone: '+91 9876543211',
      items: [
        { id: '4', name: 'Chicken Burger', quantity: 1, price: 180 },
        { id: '5', name: 'French Fries', quantity: 1, price: 100 }
      ],
      totalAmount: 280,
      status: 'preparing',
      orderTime: '2024-01-15 19:15',
      estimatedTime: '20 mins',
      deliveryAddress: '456, DEF Road, PQR Society, Mumbai - 400002',
      paymentMethod: 'Cash on Delivery'
    },
    {
      id: 'ORD003',
      customerName: 'Mike Johnson',
      customerPhone: '+91 9876543212',
      items: [
        { id: '6', name: 'Veg Pasta', quantity: 1, price: 220 },
        { id: '7', name: 'Caesar Salad', quantity: 1, price: 150 }
      ],
      totalAmount: 370,
      status: 'ready',
      orderTime: '2024-01-15 19:00',
      estimatedTime: '15 mins',
      deliveryAddress: '789, GHI Lane, STU Complex, Mumbai - 400003',
      paymentMethod: 'Card'
    }
  ];

  const filteredOrders = orders.filter(order => {
    switch (selectedTab) {
      case 'pending':
        return order.status === 'pending' || order.status === 'accepted';
      case 'preparing':
        return order.status === 'preparing';
      case 'ready':
        return order.status === 'ready';
      case 'completed':
        return order.status === 'completed';
      default:
        return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    // Update order status (in real app, this would update the state)
    console.log(`Order ${orderId} status updated to ${newStatus}`);
  };

  const OrderDetailModal = ({ order, onClose }: { order: Order; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Order ID</label>
              <p className="text-lg font-semibold text-gray-900">{order.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Order Time</label>
              <p className="text-gray-900">{order.orderTime}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estimated Time</label>
              <p className="text-gray-900">{order.estimatedTime}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{order.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{order.customerPhone}</p>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                <p className="text-gray-900">{order.deliveryAddress}</p>
              </div>
              {order.specialInstructions && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
                  <p className="text-gray-900 italic">{order.specialInstructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    {item.customizations && item.customizations.length > 0 && (
                      <p className="text-sm text-gray-500">Customizations: {item.customizations.join(', ')}</p>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-gray-900">₹{order.totalAmount}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-600">Payment Method</span>
                <span className="text-sm font-medium text-gray-900">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {order.status === 'pending' && (
              <>
                <button
                  onClick={() => updateOrderStatus(order.id, 'accepted')}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Accept Order
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Order
                </button>
              </>
            )}
            {order.status === 'accepted' && (
              <button
                onClick={() => updateOrderStatus(order.id, 'preparing')}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Preparing
              </button>
            )}
            {order.status === 'preparing' && (
              <button
                onClick={() => updateOrderStatus(order.id, 'ready')}
                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Mark as Ready
              </button>
            )}
            {order.status === 'ready' && (
              <button
                onClick={() => updateOrderStatus(order.id, 'completed')}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Mark as Completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h2>
            <p className="text-gray-600">Manage and track your orders</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Orders
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Order
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending' || o.status === 'accepted').length },
                { key: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
                { key: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
                { key: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.key
                      ? 'border-food-primary text-food-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    selectedTab === tab.key
                      ? 'bg-food-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Orders
              </h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
                />
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-sm text-gray-500">No {selectedTab} orders at the moment.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-500">{order.customerName}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{order.items.length} items</span>
                        <span>•</span>
                        <span>{order.orderTime}</span>
                        <span>•</span>
                        <span>{order.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">₹{order.totalAmount}</p>
                      <p className="text-sm text-gray-500">{order.estimatedTime}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Orders;