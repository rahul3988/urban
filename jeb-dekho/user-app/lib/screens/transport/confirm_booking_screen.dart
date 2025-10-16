import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../../services/api_service.dart';
import '../../utils/theme.dart';
import 'tracking_screen.dart';

class ConfirmBookingScreen extends StatefulWidget {
  final LatLng pickupLocation;
  final LatLng dropLocation;
  final dynamic estimates;

  const ConfirmBookingScreen({
    super.key,
    required this.pickupLocation,
    required this.dropLocation,
    required this.estimates,
  });

  @override
  State<ConfirmBookingScreen> createState() => _ConfirmBookingScreenState();
}

class _ConfirmBookingScreenState extends State<ConfirmBookingScreen> {
  String _selectedVehicleType = 'CAR';
  String _selectedPaymentMethod = 'CASH';
  bool _isLoading = false;
  double _walletBalance = 0;
  String? _promoCode;
  double _discount = 0;
  
  @override
  void initState() {
    super.initState();
    _loadWalletBalance();
    if (widget.estimates is List && widget.estimates.isNotEmpty) {
      _selectedVehicleType = widget.estimates[0]['vehicleType'];
    }
  }

  Future<void> _loadWalletBalance() async {
    try {
      final response = await ApiService.getWallet();
      if (mounted) {
        setState(() {
          _walletBalance = response['data']['balance'].toDouble();
        });
      }
    } catch (e) {
      print('Error loading wallet: $e');
    }
  }

  Future<void> _applyPromoCode(String code) async {
    final selectedEstimate = _getSelectedEstimate();
    if (selectedEstimate == null) return;

    try {
      final response = await ApiService.validatePromoCode(
        code: code,
        orderValue: selectedEstimate['fare'].toDouble(),
        serviceType: 'TRANSPORT',
      );

      if (mounted) {
        setState(() {
          _promoCode = code;
          _discount = response['data']['discount'].toDouble();
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Promo applied: ${response['data']['description']}')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Invalid promo code: ${e.toString()}')),
        );
      }
    }
  }

  Map<String, dynamic>? _getSelectedEstimate() {
    if (widget.estimates is List) {
      return widget.estimates.firstWhere(
        (e) => e['vehicleType'] == _selectedVehicleType,
        orElse: () => null,
      );
    }
    return widget.estimates;
  }

  Future<void> _confirmBooking() async {
    setState(() => _isLoading = true);

    try {
      final response = await ApiService.createBooking(
        pickupLocation: {
          'latitude': widget.pickupLocation.latitude,
          'longitude': widget.pickupLocation.longitude,
        },
        dropLocation: {
          'latitude': widget.dropLocation.latitude,
          'longitude': widget.dropLocation.longitude,
        },
        vehicleType: _selectedVehicleType,
        paymentMethod: _selectedPaymentMethod,
      );

      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => TrackingScreen(
              booking: response['data'],
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
    final selectedEstimate = _getSelectedEstimate();
    final finalFare = selectedEstimate != null 
        ? (selectedEstimate['fare'] - _discount).toDouble() 
        : 0.0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Confirm Booking'),
        backgroundColor: AppTheme.transportSecondary,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          // Map Preview
          Container(
            height: 200,
            child: GoogleMap(
              initialCameraPosition: CameraPosition(
                target: widget.pickupLocation,
                zoom: 13,
              ),
              markers: {
                Marker(
                  markerId: const MarkerId('pickup'),
                  position: widget.pickupLocation,
                  icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
                ),
                Marker(
                  markerId: const MarkerId('drop'),
                  position: widget.dropLocation,
                  icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
                ),
              },
              polylines: {
                Polyline(
                  polylineId: const PolylineId('route'),
                  points: [widget.pickupLocation, widget.dropLocation],
                  color: AppTheme.transportSecondary,
                  width: 5,
                ),
              },
              zoomControlsEnabled: false,
              myLocationButtonEnabled: false,
            ),
          ),
          
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Vehicle Selection
                  const Text(
                    'Select Vehicle Type',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  if (widget.estimates is List)
                    ...widget.estimates.map((estimate) => _buildVehicleOption(estimate))
                  else
                    _buildVehicleOption(widget.estimates),
                  
                  const SizedBox(height: 24),
                  
                  // Promo Code
                  TextField(
                    decoration: InputDecoration(
                      labelText: 'Promo Code',
                      prefixIcon: const Icon(Icons.local_offer),
                      suffixIcon: TextButton(
                        onPressed: () {
                          final code = _promoCodeController.text.trim();
                          if (code.isNotEmpty) {
                            _applyPromoCode(code);
                          }
                        },
                        child: const Text('Apply'),
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    controller: _promoCodeController,
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Payment Method
                  const Text(
                    'Payment Method',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  _buildPaymentOption('CASH', 'Cash', Icons.money),
                  _buildPaymentOption('WALLET', 'Wallet (₹$_walletBalance)', Icons.account_balance_wallet),
                  _buildPaymentOption('UPI', 'UPI', Icons.phone_android),
                  
                  const SizedBox(height: 24),
                  
                  // Fare Summary
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        _buildFareRow('Base Fare', '₹${selectedEstimate?['fare'] ?? 0}'),
                        if (_discount > 0)
                          _buildFareRow('Promo Discount', '-₹$_discount', color: Colors.green),
                        const Divider(),
                        _buildFareRow('Total Fare', '₹$finalFare', isTotal: true),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          // Confirm Button
          Container(
            padding: const EdgeInsets.all(16),
            child: ElevatedButton(
              onPressed: _isLoading ? null : _confirmBooking,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.transportSecondary,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                minimumSize: const Size(double.infinity, 50),
              ),
              child: _isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text(
                      'Confirm Booking',
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

  Widget _buildVehicleOption(Map<String, dynamic> estimate) {
    final isSelected = estimate['vehicleType'] == _selectedVehicleType;
    
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedVehicleType = estimate['vehicleType'];
        });
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? AppTheme.transportSecondary : Colors.grey[300]!,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
          color: isSelected ? AppTheme.transportSecondary.withOpacity(0.1) : null,
        ),
        child: Row(
          children: [
            Icon(
              _getVehicleIcon(estimate['vehicleType']),
              size: 32,
              color: isSelected ? AppTheme.transportSecondary : Colors.grey[600],
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    estimate['vehicleType'],
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    '${estimate['estimatedTime']} mins • ${estimate['distance']} km',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
            Text(
              '₹${estimate['fare']}',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: isSelected ? AppTheme.transportSecondary : null,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentOption(String value, String label, IconData icon) {
    final isSelected = _selectedPaymentMethod == value;
    final isDisabled = value == 'WALLET' && _walletBalance < (_getSelectedEstimate()?['fare'] ?? 0);
    
    return GestureDetector(
      onTap: isDisabled ? null : () {
        setState(() {
          _selectedPaymentMethod = value;
        });
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? AppTheme.transportSecondary : Colors.grey[300]!,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
          color: isDisabled 
              ? Colors.grey[100] 
              : isSelected 
                  ? AppTheme.transportSecondary.withOpacity(0.1) 
                  : null,
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: isDisabled 
                  ? Colors.grey[400] 
                  : isSelected 
                      ? AppTheme.transportSecondary 
                      : Colors.grey[600],
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 16,
                  color: isDisabled ? Colors.grey[400] : null,
                ),
              ),
            ),
            if (isSelected)
              Icon(
                Icons.check_circle,
                color: AppTheme.transportSecondary,
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildFareRow(String label, String value, {bool isTotal = false, Color? color}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: isTotal ? 16 : 14,
              fontWeight: isTotal ? FontWeight.bold : null,
              color: color,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: isTotal ? 18 : 14,
              fontWeight: isTotal ? FontWeight.bold : null,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  IconData _getVehicleIcon(String type) {
    switch (type) {
      case 'BIKE':
        return Icons.two_wheeler;
      case 'AUTO':
        return Icons.electric_rickshaw;
      case 'CAR':
        return Icons.directions_car;
      default:
        return Icons.directions_car;
    }
  }

  final _promoCodeController = TextEditingController();

  @override
  void dispose() {
    _promoCodeController.dispose();
    super.dispose();
  }
}