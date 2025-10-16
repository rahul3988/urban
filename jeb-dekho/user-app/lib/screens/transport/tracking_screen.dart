import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'dart:async';
import '../../services/api_service.dart';
import '../../services/websocket_service.dart';
import '../../utils/theme.dart';

class TrackingScreen extends StatefulWidget {
  final Map<String, dynamic> booking;

  const TrackingScreen({
    super.key,
    required this.booking,
  });

  @override
  State<TrackingScreen> createState() => _TrackingScreenState();
}

class _TrackingScreenState extends State<TrackingScreen> {
  GoogleMapController? _mapController;
  final WebSocketService _wsService = WebSocketService();
  StreamSubscription? _locationSubscription;
  StreamSubscription? _statusSubscription;
  
  LatLng? _driverLocation;
  String _currentStatus = 'ACCEPTED';
  Timer? _mockLocationTimer;
  
  final Set<Marker> _markers = {};
  Set<Polyline> _polylines = {};

  @override
  void initState() {
    super.initState();
    _currentStatus = widget.booking['status'];
    _startTracking();
    _listenToUpdates();
    
    // For demo: simulate driver movement
    _startMockDriverMovement();
  }

  void _startTracking() {
    _wsService.trackBooking(widget.booking['id']);
    _fetchTrackingData();
  }

  Future<void> _fetchTrackingData() async {
    try {
      final response = await ApiService.trackBooking(widget.booking['id']);
      if (mounted) {
        setState(() {
          _currentStatus = response['data']['currentStatus'];
          if (response['data']['driverLocation'] != null) {
            _driverLocation = LatLng(
              response['data']['driverLocation']['latitude'],
              response['data']['driverLocation']['longitude'],
            );
            _updateMarkers();
          }
        });
      }
    } catch (e) {
      print('Error fetching tracking data: $e');
    }
  }

  void _listenToUpdates() {
    _locationSubscription = _wsService.locationStream.listen((data) {
      if (mounted && data['bookingId'] == widget.booking['id']) {
        setState(() {
          _driverLocation = LatLng(
            data['location']['latitude'],
            data['location']['longitude'],
          );
          _updateMarkers();
        });
      }
    });

    _statusSubscription = _wsService.orderStatusStream.listen((data) {
      if (mounted && data['orderId'] == widget.booking['id']) {
        setState(() {
          _currentStatus = data['status'];
        });
        
        if (_currentStatus == 'DELIVERED') {
          _showCompletionDialog();
        }
      }
    });
  }

  void _updateMarkers() {
    _markers.clear();
    
    // Pickup marker
    final pickupLat = widget.booking['pickupLocation']['latitude'];
    final pickupLng = widget.booking['pickupLocation']['longitude'];
    _markers.add(
      Marker(
        markerId: const MarkerId('pickup'),
        position: LatLng(pickupLat, pickupLng),
        infoWindow: const InfoWindow(title: 'Pickup'),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
      ),
    );

    // Drop marker
    final dropLat = widget.booking['dropLocation']['latitude'];
    final dropLng = widget.booking['dropLocation']['longitude'];
    _markers.add(
      Marker(
        markerId: const MarkerId('drop'),
        position: LatLng(dropLat, dropLng),
        infoWindow: const InfoWindow(title: 'Drop'),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
      ),
    );

    // Driver marker
    if (_driverLocation != null) {
      _markers.add(
        Marker(
          markerId: const MarkerId('driver'),
          position: _driverLocation!,
          infoWindow: const InfoWindow(title: 'Driver'),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueBlue),
        ),
      );

      // Draw route from driver to pickup or drop
      final targetLocation = _currentStatus == 'PICKED_UP' 
          ? LatLng(dropLat, dropLng)
          : LatLng(pickupLat, pickupLng);
      
      _polylines = {
        Polyline(
          polylineId: const PolylineId('route'),
          points: [_driverLocation!, targetLocation],
          color: AppTheme.transportSecondary,
          width: 5,
        ),
      };
    }
  }

  void _startMockDriverMovement() {
    // Simulate driver movement for demo
    _mockLocationTimer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (_driverLocation != null && mounted) {
        setState(() {
          // Move driver slightly towards destination
          final targetLat = _currentStatus == 'PICKED_UP'
              ? widget.booking['dropLocation']['latitude']
              : widget.booking['pickupLocation']['latitude'];
          final targetLng = _currentStatus == 'PICKED_UP'
              ? widget.booking['dropLocation']['longitude']
              : widget.booking['pickupLocation']['longitude'];
          
          _driverLocation = LatLng(
            _driverLocation!.latitude + (targetLat - _driverLocation!.latitude) * 0.1,
            _driverLocation!.longitude + (targetLng - _driverLocation!.longitude) * 0.1,
          );
          _updateMarkers();
        });

        // Center map on driver
        _mapController?.animateCamera(
          CameraUpdate.newLatLng(_driverLocation!),
        );
      }
    });
  }

  void _showCompletionDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text('Ride Completed'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle, color: Colors.green, size: 64),
            const SizedBox(height: 16),
            Text('Total Fare: ₹${widget.booking['finalAmount']}'),
            const SizedBox(height: 8),
            const Text('Thank you for riding with us!'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).popUntil((route) => route.isFirst);
            },
            child: const Text('Done'),
          ),
        ],
      ),
    );
  }

  Future<void> _cancelBooking() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancel Booking?'),
        content: const Text('Are you sure you want to cancel this booking?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('No'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Yes, Cancel'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      try {
        await ApiService.cancelBooking(widget.booking['id'], 'User requested cancellation');
        if (mounted) {
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Booking cancelled')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error: ${e.toString()}')),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final driver = widget.booking['driver'];
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Track Your Ride'),
        backgroundColor: AppTheme.transportSecondary,
        foregroundColor: Colors.white,
        actions: [
          if (_currentStatus != 'DELIVERED' && _currentStatus != 'CANCELLED')
            IconButton(
              icon: const Icon(Icons.cancel),
              onPressed: _cancelBooking,
            ),
        ],
      ),
      body: Column(
        children: [
          // Map
          Expanded(
            child: GoogleMap(
              initialCameraPosition: CameraPosition(
                target: LatLng(
                  widget.booking['pickupLocation']['latitude'],
                  widget.booking['pickupLocation']['longitude'],
                ),
                zoom: 14,
              ),
              onMapCreated: (controller) => _mapController = controller,
              markers: _markers,
              polylines: _polylines,
            ),
          ),
          
          // Booking Details
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, -5),
                ),
              ],
            ),
            child: Column(
              children: [
                // Status Bar
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  color: _getStatusColor(),
                  child: Text(
                    _getStatusText(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                
                // Driver Details
                if (driver != null)
                  ListTile(
                    leading: CircleAvatar(
                      backgroundColor: AppTheme.transportSecondary,
                      child: const Icon(Icons.person, color: Colors.white),
                    ),
                    title: Text(driver['name']),
                    subtitle: Text('${widget.booking['vehicleType']} • ${driver['vehicleNumber']}'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.call, color: Colors.green),
                          onPressed: () {
                            // Implement call functionality
                          },
                        ),
                        const Icon(Icons.star, color: Colors.amber, size: 16),
                        Text('${driver['rating']}'),
                      ],
                    ),
                  ),
                
                // Fare Details
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Trip Fare',
                            style: TextStyle(color: Colors.grey[600]),
                          ),
                          Text(
                            '₹${widget.booking['finalAmount']}',
                            style: const TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            'Payment',
                            style: TextStyle(color: Colors.grey[600]),
                          ),
                          Text(
                            widget.booking['paymentMethod'],
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor() {
    switch (_currentStatus) {
      case 'ACCEPTED':
        return Colors.blue;
      case 'PICKED_UP':
        return Colors.orange;
      case 'IN_TRANSIT':
        return AppTheme.transportAccent;
      case 'DELIVERED':
        return Colors.green;
      case 'CANCELLED':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _getStatusText() {
    switch (_currentStatus) {
      case 'ACCEPTED':
        return 'Driver is on the way to pick you up';
      case 'PICKED_UP':
        return 'You have been picked up';
      case 'IN_TRANSIT':
        return 'On the way to your destination';
      case 'DELIVERED':
        return 'You have reached your destination';
      case 'CANCELLED':
        return 'Booking cancelled';
      default:
        return 'Processing...';
    }
  }

  @override
  void dispose() {
    _wsService.untrackBooking(widget.booking['id']);
    _locationSubscription?.cancel();
    _statusSubscription?.cancel();
    _mockLocationTimer?.cancel();
    _mapController?.dispose();
    super.dispose();
  }
}