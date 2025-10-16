import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import '../../services/api_service.dart';
import '../../utils/theme.dart';
import 'confirm_booking_screen.dart';

class TransportBookingScreen extends StatefulWidget {
  const TransportBookingScreen({super.key});

  @override
  State<TransportBookingScreen> createState() => _TransportBookingScreenState();
}

class _TransportBookingScreenState extends State<TransportBookingScreen> {
  GoogleMapController? _mapController;
  LocationData? _currentLocation;
  LatLng? _pickupLocation;
  LatLng? _dropLocation;
  Set<Marker> _markers = {};
  Set<Polyline> _polylines = {};
  bool _isLoading = false;
  
  final _pickupController = TextEditingController();
  final _dropController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
  }

  Future<void> _getCurrentLocation() async {
    final location = Location();
    
    bool serviceEnabled = await location.serviceEnabled();
    if (!serviceEnabled) {
      serviceEnabled = await location.requestService();
      if (!serviceEnabled) return;
    }

    PermissionStatus permission = await location.hasPermission();
    if (permission == PermissionStatus.denied) {
      permission = await location.requestPermission();
      if (permission != PermissionStatus.granted) return;
    }

    final locationData = await location.getLocation();
    setState(() {
      _currentLocation = locationData;
      _pickupLocation = LatLng(locationData.latitude!, locationData.longitude!);
      _updateMarkers();
    });

    _mapController?.animateCamera(
      CameraUpdate.newLatLngZoom(
        LatLng(locationData.latitude!, locationData.longitude!),
        15,
      ),
    );
  }

  void _updateMarkers() {
    _markers.clear();
    
    if (_pickupLocation != null) {
      _markers.add(
        Marker(
          markerId: const MarkerId('pickup'),
          position: _pickupLocation!,
          infoWindow: const InfoWindow(title: 'Pickup Location'),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
        ),
      );
    }

    if (_dropLocation != null) {
      _markers.add(
        Marker(
          markerId: const MarkerId('drop'),
          position: _dropLocation!,
          infoWindow: const InfoWindow(title: 'Drop Location'),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
        ),
      );
    }

    // Draw route if both locations are set
    if (_pickupLocation != null && _dropLocation != null) {
      _polylines.add(
        Polyline(
          polylineId: const PolylineId('route'),
          points: [_pickupLocation!, _dropLocation!],
          color: AppTheme.transportSecondary,
          width: 5,
        ),
      );
    }
  }

  void _onMapTap(LatLng position) {
    setState(() {
      if (_pickupLocation == null) {
        _pickupLocation = position;
        _pickupController.text = 'Location selected on map';
      } else if (_dropLocation == null) {
        _dropLocation = position;
        _dropController.text = 'Location selected on map';
      }
      _updateMarkers();
    });
  }

  Future<void> _getEstimate() async {
    if (_pickupLocation == null || _dropLocation == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select pickup and drop locations')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await ApiService.getTransportEstimate(
        pickupLat: _pickupLocation!.latitude,
        pickupLng: _pickupLocation!.longitude,
        dropLat: _dropLocation!.latitude,
        dropLng: _dropLocation!.longitude,
      );

      if (mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ConfirmBookingScreen(
              pickupLocation: _pickupLocation!,
              dropLocation: _dropLocation!,
              estimates: response['data'],
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Book a Ride'),
        backgroundColor: AppTheme.transportSecondary,
        foregroundColor: Colors.white,
      ),
      body: Stack(
        children: [
          // Map
          GoogleMap(
            initialCameraPosition: CameraPosition(
              target: _currentLocation != null
                  ? LatLng(_currentLocation!.latitude!, _currentLocation!.longitude!)
                  : const LatLng(19.0760, 72.8777), // Mumbai
              zoom: 14,
            ),
            onMapCreated: (controller) => _mapController = controller,
            onTap: _onMapTap,
            markers: _markers,
            polylines: _polylines,
            myLocationEnabled: true,
            myLocationButtonEnabled: true,
          ),
          
          // Location Input Card
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  TextField(
                    controller: _pickupController,
                    decoration: InputDecoration(
                      labelText: 'Pickup Location',
                      prefixIcon: Icon(Icons.location_on, color: Colors.green[600]),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      filled: true,
                      fillColor: Colors.grey[100],
                    ),
                    readOnly: true,
                    onTap: () {
                      // In production, implement place picker
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Tap on map to select pickup location')),
                      );
                    },
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _dropController,
                    decoration: InputDecoration(
                      labelText: 'Drop Location',
                      prefixIcon: Icon(Icons.location_on, color: Colors.red[600]),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      filled: true,
                      fillColor: Colors.grey[100],
                    ),
                    readOnly: true,
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Tap on map to select drop location')),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
          
          // Continue Button
          Positioned(
            bottom: 20,
            left: 16,
            right: 16,
            child: ElevatedButton(
              onPressed: _isLoading ? null : _getEstimate,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.transportSecondary,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: _isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text(
                      'Get Fare Estimate',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _pickupController.dispose();
    _dropController.dispose();
    _mapController?.dispose();
    super.dispose();
  }
}