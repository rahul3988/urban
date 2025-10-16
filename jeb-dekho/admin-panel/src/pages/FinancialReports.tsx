import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

interface FinancialData {
  totalRevenue: number;
  totalCommission: number;
  totalPayouts: number;
  netProfit: number;
  monthlyRevenue: MonthlyData[];
  serviceBreakdown: ServiceData[];
  topVendors: VendorRevenue[];
  paymentMethods: PaymentMethodData[];
}

interface MonthlyData {
  month: string;
  revenue: number;
  commission: number;
  payouts: number;
  profit: number;
}

interface ServiceData {
  service: 'transport' | 'food' | 'mart';
  revenue: number;
  orders: number;
  commission: number;
}

interface VendorRevenue {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  commission: number;
}

interface PaymentMethodData {
  method: 'card' | 'upi' | 'wallet' | 'cash';
  amount: number;
  percentage: number;
  transactions: number;
}

const FinancialReports: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [selectedService, setSelectedService] = useState<string>('all');

  useEffect(() => {
    // Simulate API call
    const fetchFinancialData = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setFinancialData({
          totalRevenue: 2840000,
          totalCommission: 284000,
          totalPayouts: 2556000,
          netProfit: 284000,
          monthlyRevenue: [
            { month: 'Jan', revenue: 850000, commission: 85000, payouts: 765000, profit: 85000 },
            { month: 'Feb', revenue: 920000, commission: 92000, payouts: 828000, profit: 92000 },
            { month: 'Mar', revenue: 1070000, commission: 107000, payouts: 963000, profit: 107000 },
          ],
          serviceBreakdown: [
            { service: 'transport', revenue: 1200000, orders: 4500, commission: 120000 },
            { service: 'food', revenue: 980000, orders: 3200, commission: 98000 },
            { service: 'mart', revenue: 660000, orders: 1800, commission: 66000 },
          ],
          topVendors: [
            { id: '1', name: 'Pizza Palace', revenue: 450000, orders: 1250, commission: 45000 },
            { id: '2', name: 'Quick Transport', revenue: 320000, orders: 890, commission: 32000 },
            { id: '3', name: 'Fresh Mart', revenue: 280000, orders: 750, commission: 28000 },
            { id: '4', name: 'Burger King', revenue: 250000, orders: 680, commission: 25000 },
            { id: '5', name: 'City Cabs', revenue: 220000, orders: 620, commission: 22000 },
          ],
          paymentMethods: [
            { method: 'upi', amount: 1200000, percentage: 42.3, transactions: 8500 },
            { method: 'card', amount: 980000, percentage: 34.5, transactions: 3200 },
            { method: 'wallet', amount: 450000, percentage: 15.8, transactions: 2800 },
            { method: 'cash', amount: 210000, percentage: 7.4, transactions: 1200 },
          ],
        });
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [dateRange, selectedService]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getServiceColor = (service: string) => {
    const colors = {
      transport: 'bg-blue-500',
      food: 'bg-orange-500',
      mart: 'bg-teal-500',
    };
    return colors[service as keyof typeof colors] || 'bg-gray-500';
  };

  const getPaymentMethodColor = (method: string) => {
    const colors = {
      upi: 'bg-purple-500',
      card: 'bg-blue-500',
      wallet: 'bg-green-500',
      cash: 'bg-gray-500',
    };
    return colors[method as keyof typeof colors] || 'bg-gray-500';
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

  if (!financialData) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">No financial data available</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
            <p className="text-gray-600">Comprehensive financial analytics and reporting</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(financialData.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Commission</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(financialData.totalCommission)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Payouts</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(financialData.totalPayouts)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Net Profit</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(financialData.netProfit)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue Trend</h3>
          <div className="space-y-4">
            {financialData.monthlyRevenue.map((month) => (
              <div key={month.month} className="flex items-center space-x-4">
                <div className="w-16 text-sm font-medium text-gray-700">{month.month}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(month.revenue / Math.max(...financialData.monthlyRevenue.map(m => m.revenue))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{formatCurrency(month.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Service Breakdown</h3>
            <div className="space-y-4">
              {financialData.serviceBreakdown.map((service) => (
                <div key={service.service} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getServiceColor(service.service)}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">{service.service}</p>
                      <p className="text-xs text-gray-500">{service.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(service.revenue)}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(service.commission)} commission</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
            <div className="space-y-4">
              {financialData.paymentMethods.map((method) => (
                <div key={method.method} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getPaymentMethodColor(method.method)}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">{method.method}</p>
                      <p className="text-xs text-gray-500">{method.transactions} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(method.amount)}</p>
                    <p className="text-xs text-gray-500">{formatPercentage(method.percentage)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Vendors */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Vendors by Revenue</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {financialData.topVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vendor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendor.orders.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(vendor.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(vendor.commission)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FinancialReports;
