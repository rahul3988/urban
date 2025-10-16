import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../utils/theme.dart';

class TripDetailScreen extends StatefulWidget {
  final String tripId;
  final String tripType; // 'transport', 'food', 'mart'

  const TripDetailScreen({
    super.key,
    required this.tripId,
    required this.tripType,
  });

  @override
  State<TripDetailScreen> createState() => _TripDetailScreenState();
}

class _TripDetailScreenState extends State<TripDetailScreen> {
  String _currentStatus = 'accepted'; // accepted, picked_up, in_transit, delivered
  bool _isLoading = false;
  bool _isNavigating = false;

  final Map<String, dynamic> _tripData = {
    'id': 'TRIP001',
    'type': 'food',
    'customerName': 'John Doe',
    'customerPhone': '+91 9876543210',
    'pickupAddress': 'Pizza Palace, MG Road, Mumbai',
    'deliveryAddress': '123, ABC Street, XYZ Colony, Mumbai - 400001',
    'estimatedTime': '25 mins',
    'distance': '8.5 km',
    'fare': 150.0,
    'items': ['Margherita Pizza', 'Garlic Bread', 'Coca Cola'],
    'specialInstructions': 'Please ring the doorbell twice',
    'orderTime': '2024-01-15 19:30',
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: _getServiceColor(),
        elevation: 0,
        title: Text(
          'Trip #${widget.tripId}',
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.call, color: Colors.white),
            onPressed: _callCustomer,
          ),
          IconButton(
            icon: const Icon(Icons.chat, color: Colors.white),
            onPressed: _chatWithCustomer,
          ),
        ],
      ),
      body: Column(
        children: [
          // Status Card
          _buildStatusCard(),
          
          // Trip Details
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  _buildTripInfoCard(),
                  _buildCustomerInfoCard(),
                  _buildRouteInfoCard(),
                  _buildItemsCard(),
                  _buildSpecialInstructionsCard(),
                ],
              ),
            ),
          ),
          
          // Action Buttons
          _buildActionButtons(),
        ],
      ),
    );
  }

  Widget _buildStatusCard() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            _getServiceColor(),
            _getServiceColor().withOpacity(0.8),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: _getServiceColor().withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Icon(
                _getStatusIcon(),
                color: Colors.white,
                size: 32,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _getStatusText(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _getStatusSubtext(),
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  _tripData['estimatedTime'],
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          LinearProgressIndicator(
            value: _getProgressValue(),
            backgroundColor: Colors.white.withOpacity(0.3),
            valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
          ),
        ],
      ),
    );
  }

  Widget _buildTripInfoCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                _getServiceIcon(),
                color: _getServiceColor(),
                size: 24,
              ),
              const SizedBox(width: 8),
              Text(
                _getServiceName(),
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildInfoRow('Trip ID', _tripData['id']),
          _buildInfoRow('Order Time', _tripData['orderTime']),
          _buildInfoRow('Distance', _tripData['distance']),
          _buildInfoRow('Fare', '₹${_tripData['fare'].toStringAsFixed(2)}'),
        ],
      ),
    );
  }

  Widget _buildCustomerInfoCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.person, color: AppTheme.transportPrimary),
              SizedBox(width: 8),
              Text(
                'Customer Details',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildInfoRow('Name', _tripData['customerName']),
          _buildInfoRow('Phone', _tripData['customerPhone']),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _callCustomer,
                  icon: const Icon(Icons.call, size: 18),
                  label: const Text('Call'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.transportAccent,
                    foregroundColor: Colors.white,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _chatWithCustomer,
                  icon: const Icon(Icons.chat, size: 18),
                  label: const Text('Chat'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppTheme.transportPrimary,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRouteInfoCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.route, color: AppTheme.transportPrimary),
              SizedBox(width: 8),
              Text(
                'Route Information',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildLocationRow(
            'Pickup',
            _tripData['pickupAddress'],
            Icons.location_on,
            Colors.green,
          ),
          const SizedBox(height: 12),
          Container(
            margin: const EdgeInsets.only(left: 12),
            height: 20,
            child: VerticalDivider(
              color: Colors.grey[400],
              thickness: 2,
            ),
          ),
          const SizedBox(height: 12),
          _buildLocationRow(
            'Delivery',
            _tripData['deliveryAddress'],
            Icons.location_on,
            Colors.red,
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _startNavigation,
                  icon: const Icon(Icons.navigation, size: 18),
                  label: const Text('Start Navigation'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.transportPrimary,
                    foregroundColor: Colors.white,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _viewOnMap,
                  icon: const Icon(Icons.map, size: 18),
                  label: const Text('View Map'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppTheme.transportPrimary,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildItemsCard() {
    if (widget.tripType == 'transport') return const SizedBox.shrink();
    
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.shopping_bag, color: AppTheme.transportPrimary),
              SizedBox(width: 8),
              Text(
                'Items to Deliver',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ..._tripData['items'].map<Widget>((item) {
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                children: [
                  const Icon(Icons.check_circle, 
                      color: AppTheme.transportAccent, size: 16),
                  const SizedBox(width: 8),
                  Expanded(child: Text(item)),
                ],
              ),
            );
          }).toList(),
        ],
      ),
    );
  }

  Widget _buildSpecialInstructionsCard() {
    if (_tripData['specialInstructions'].isEmpty) return const SizedBox.shrink();
    
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.note, color: AppTheme.transportPrimary),
              SizedBox(width: 8),
              Text(
                'Special Instructions',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            _tripData['specialInstructions'],
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[700],
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        children: [
          if (_currentStatus == 'accepted') ...[
            Expanded(
              child: ElevatedButton.icon(
                onPressed: _isLoading ? null : _markAsPickedUp,
                icon: const Icon(Icons.shopping_bag),
                label: const Text('Mark as Picked Up'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.transportSecondary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
          ] else if (_currentStatus == 'picked_up') ...[
            Expanded(
              child: ElevatedButton.icon(
                onPressed: _isLoading ? null : _markAsInTransit,
                icon: const Icon(Icons.directions_car),
                label: const Text('Start Delivery'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.transportSecondary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
          ] else if (_currentStatus == 'in_transit') ...[
            Expanded(
              child: ElevatedButton.icon(
                onPressed: _isLoading ? null : _markAsDelivered,
                icon: const Icon(Icons.check_circle),
                label: const Text('Mark as Delivered'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.transportAccent,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
          ],
          const SizedBox(width: 12),
          Expanded(
            child: OutlinedButton.icon(
              onPressed: _isLoading ? null : _cancelTrip,
              icon: const Icon(Icons.cancel),
              label: const Text('Cancel'),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.red,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              '$label:',
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLocationRow(String label, String address, IconData icon, Color color) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                address,
                style: const TextStyle(
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Color _getServiceColor() {
    switch (widget.tripType) {
      case 'transport':
        return AppTheme.transportPrimary;
      case 'food':
        return AppTheme.foodPrimary;
      case 'mart':
        return AppTheme.martPrimary;
      default:
        return AppTheme.transportPrimary;
    }
  }

  IconData _getServiceIcon() {
    switch (widget.tripType) {
      case 'transport':
        return Icons.directions_car;
      case 'food':
        return Icons.restaurant;
      case 'mart':
        return Icons.shopping_cart;
      default:
        return Icons.directions_car;
    }
  }

  String _getServiceName() {
    switch (widget.tripType) {
      case 'transport':
        return 'Transport Delivery';
      case 'food':
        return 'Food Delivery';
      case 'mart':
        return 'Grocery Delivery';
      default:
        return 'Delivery';
    }
  }

  IconData _getStatusIcon() {
    switch (_currentStatus) {
      case 'accepted':
        return Icons.check_circle;
      case 'picked_up':
        return Icons.shopping_bag;
      case 'in_transit':
        return Icons.directions_car;
      case 'delivered':
        return Icons.done_all;
      default:
        return Icons.pending;
    }
  }

  String _getStatusText() {
    switch (_currentStatus) {
      case 'accepted':
        return 'Trip Accepted';
      case 'picked_up':
        return 'Picked Up';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Pending';
    }
  }

  String _getStatusSubtext() {
    switch (_currentStatus) {
      case 'accepted':
        return 'Head to pickup location';
      case 'picked_up':
        return 'Start delivery to customer';
      case 'in_transit':
        return 'On the way to delivery location';
      case 'delivered':
        return 'Trip completed successfully';
      default:
        return 'Waiting for updates';
    }
  }

  double _getProgressValue() {
    switch (_currentStatus) {
      case 'accepted':
        return 0.25;
      case 'picked_up':
        return 0.5;
      case 'in_transit':
        return 0.75;
      case 'delivered':
        return 1.0;
      default:
        return 0.0;
    }
  }

  void _callCustomer() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Calling ${_tripData['customerPhone']}...'),
        backgroundColor: AppTheme.transportAccent,
      ),
    );
  }

  void _chatWithCustomer() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Opening chat with customer...'),
        backgroundColor: AppTheme.transportAccent,
      ),
    );
  }

  void _startNavigation() {
    setState(() {
      _isNavigating = true;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Starting navigation...'),
        backgroundColor: AppTheme.transportAccent,
      ),
    );
    
    // Simulate navigation
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _isNavigating = false;
        });
      }
    });
  }

  void _viewOnMap() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Opening map view...'),
        backgroundColor: AppTheme.transportAccent,
      ),
    );
  }

  void _markAsPickedUp() async {
    setState(() {
      _isLoading = true;
    });

    await Future.delayed(const Duration(seconds: 1));

    if (mounted) {
      setState(() {
        _currentStatus = 'picked_up';
        _isLoading = false;
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Marked as picked up successfully'),
          backgroundColor: AppTheme.transportAccent,
        ),
      );
    }
  }

  void _markAsInTransit() async {
    setState(() {
      _isLoading = true;
    });

    await Future.delayed(const Duration(seconds: 1));

    if (mounted) {
      setState(() {
        _currentStatus = 'in_transit';
        _isLoading = false;
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Started delivery successfully'),
          backgroundColor: AppTheme.transportAccent,
        ),
      );
    }
  }

  void _markAsDelivered() async {
    setState(() {
      _isLoading = true;
    });

    await Future.delayed(const Duration(seconds: 1));

    if (mounted) {
      setState(() {
        _currentStatus = 'delivered';
        _isLoading = false;
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Trip completed successfully!'),
          backgroundColor: AppTheme.transportAccent,
        ),
      );
      
      // Navigate back to dashboard after completion
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          context.go('/dashboard');
        }
      });
    }
  }

  void _cancelTrip() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancel Trip'),
        content: const Text('Are you sure you want to cancel this trip? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('No'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              context.go('/dashboard');
            },
            child: const Text(
              'Yes, Cancel',
              style: TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );
  }
}
