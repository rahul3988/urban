import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'general' | 'complaint' | 'feature_request';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdBy: {
    id: string;
    name: string;
    email: string;
    type: 'user' | 'vendor' | 'driver';
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    type: 'user' | 'vendor' | 'driver' | 'admin';
  };
  message: string;
  timestamp: string;
  attachments?: string[];
}

const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Simulate API call
    const fetchTickets = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTickets([
          {
            id: '1',
            ticketNumber: 'TKT-001',
            title: 'Payment not processed',
            description: 'I made a payment but it was not processed. Please help.',
            category: 'billing',
            priority: 'high',
            status: 'open',
            createdBy: {
              id: 'user1',
              name: 'John Doe',
              email: 'john@example.com',
              type: 'user',
            },
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
            messages: [
              {
                id: 'msg1',
                sender: {
                  id: 'user1',
                  name: 'John Doe',
                  type: 'user',
                },
                message: 'I made a payment but it was not processed. Please help.',
                timestamp: '2024-01-15T10:30:00Z',
              },
            ],
          },
          {
            id: '2',
            ticketNumber: 'TKT-002',
            title: 'App crashes on Android',
            description: 'The app crashes whenever I try to book a ride.',
            category: 'technical',
            priority: 'medium',
            status: 'in_progress',
            createdBy: {
              id: 'user2',
              name: 'Jane Smith',
              email: 'jane@example.com',
              type: 'user',
            },
            assignedTo: {
              id: 'admin1',
              name: 'Admin User',
              email: 'admin@jebdekho.com',
            },
            createdAt: '2024-01-14T15:20:00Z',
            updatedAt: '2024-01-15T09:15:00Z',
            messages: [
              {
                id: 'msg2',
                sender: {
                  id: 'user2',
                  name: 'Jane Smith',
                  type: 'user',
                },
                message: 'The app crashes whenever I try to book a ride.',
                timestamp: '2024-01-14T15:20:00Z',
              },
              {
                id: 'msg3',
                sender: {
                  id: 'admin1',
                  name: 'Admin User',
                  type: 'admin',
                },
                message: 'We are looking into this issue. Can you please provide more details about your device?',
                timestamp: '2024-01-15T09:15:00Z',
              },
            ],
          },
          {
            id: '3',
            ticketNumber: 'TKT-003',
            title: 'Delivery partner not responding',
            description: 'My delivery partner is not responding to calls.',
            category: 'complaint',
            priority: 'urgent',
            status: 'resolved',
            createdBy: {
              id: 'vendor1',
              name: 'Pizza Palace',
              email: 'contact@pizzapalace.com',
              type: 'vendor',
            },
            assignedTo: {
              id: 'admin2',
              name: 'Support Admin',
              email: 'support@jebdekho.com',
            },
            createdAt: '2024-01-13T12:00:00Z',
            updatedAt: '2024-01-14T16:30:00Z',
            resolvedAt: '2024-01-14T16:30:00Z',
            messages: [
              {
                id: 'msg4',
                sender: {
                  id: 'vendor1',
                  name: 'Pizza Palace',
                  type: 'vendor',
                },
                message: 'My delivery partner is not responding to calls.',
                timestamp: '2024-01-13T12:00:00Z',
              },
              {
                id: 'msg5',
                sender: {
                  id: 'admin2',
                  name: 'Support Admin',
                  type: 'admin',
                },
                message: 'We have contacted the delivery partner and resolved the issue.',
                timestamp: '2024-01-14T16:30:00Z',
              },
            ],
          },
        ]);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              status: newStatus as any,
              updatedAt: new Date().toISOString(),
              resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : undefined,
            } 
          : ticket
      ));
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMsg: TicketMessage = {
        id: `msg${Date.now()}`,
        sender: {
          id: 'admin1',
          name: 'Admin User',
          type: 'admin',
        },
        message: newMessage,
        timestamp: new Date().toISOString(),
      };

      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { 
              ...ticket, 
              messages: [...ticket.messages, newMsg],
              updatedAt: new Date().toISOString(),
            } 
          : ticket
      ));

      setSelectedTicket({
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMsg],
        updatedAt: new Date().toISOString(),
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityClasses = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityClasses[priority as keyof typeof priorityClasses]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryClasses = {
      technical: 'bg-purple-100 text-purple-800',
      billing: 'bg-green-100 text-green-800',
      general: 'bg-blue-100 text-blue-800',
      complaint: 'bg-red-100 text-red-800',
      feature_request: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryClasses[category as keyof typeof categoryClasses]}`}>
        {category.replace('_', ' ').charAt(0).toUpperCase() + category.replace('_', ' ').slice(1)}
      </span>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
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
            <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600">Manage customer support tickets and inquiries</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Export Tickets
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Create Ticket
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
                placeholder="Search tickets..."
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
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="general">General</option>
                <option value="complaint">Complaint</option>
                <option value="feature_request">Feature Request</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ticket.ticketNumber}</div>
                        <div className="text-sm text-gray-500">{ticket.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ticket.createdBy.name}</div>
                        <div className="text-sm text-gray-500">{ticket.createdBy.email}</div>
                        <div className="text-xs text-gray-400">{ticket.createdBy.type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCategoryBadge(ticket.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTimestamp(ticket.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewTicket(ticket)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ticket Details Modal */}
        {showModal && selectedTicket && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedTicket.ticketNumber}</h3>
                    <p className="text-sm text-gray-600">{selectedTicket.title}</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Ticket Info */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <div className="mt-1">{getCategoryBadge(selectedTicket.category)}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Created By</label>
                        <p className="text-sm text-gray-900">{selectedTicket.createdBy.name}</p>
                        <p className="text-xs text-gray-500">{selectedTicket.createdBy.email}</p>
                      </div>
                      {selectedTicket.assignedTo && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                          <p className="text-sm text-gray-900">{selectedTicket.assignedTo.name}</p>
                          <p className="text-xs text-gray-500">{selectedTicket.assignedTo.email}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Created</label>
                        <p className="text-sm text-gray-900">{formatTimestamp(selectedTicket.createdAt)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                        <p className="text-sm text-gray-900">{formatTimestamp(selectedTicket.updatedAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="lg:col-span-2">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-900">{selectedTicket.description}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Messages</label>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {selectedTicket.messages.map((message) => (
                            <div key={message.id} className={`p-3 rounded-lg ${
                              message.sender.type === 'admin' ? 'bg-blue-50' : 'bg-gray-50'
                            }`}>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{message.sender.name}</p>
                                  <p className="text-xs text-gray-500">{message.sender.type}</p>
                                </div>
                                <p className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</p>
                              </div>
                              <p className="text-sm text-gray-900">{message.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reply</label>
                        <div className="flex space-x-2">
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your reply..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                          />
                          <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Send
                          </button>
                        </div>
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
                    Assign Ticket
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

export default SupportTickets;
