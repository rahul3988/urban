import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../utils/theme.dart';

class MartCheckoutScreen extends StatefulWidget {
  const MartCheckoutScreen({super.key});

  @override
  State<MartCheckoutScreen> createState() => _MartCheckoutScreenState();
}

class _MartCheckoutScreenState extends State<MartCheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final _addressController = TextEditingController();
  final _instructionsController = TextEditingController();
  
  String _selectedPaymentMethod = 'wallet';
  String _selectedDeliverySlot = 'today_evening';
  bool _isLoading = false;

  final List<Map<String, dynamic>> _paymentMethods = [
    {
      'id': 'wallet',
      'name': 'Wallet',
      'icon': Icons.account_balance_wallet,
      'balance': 1250.0,
    },
    {
      'id': 'upi',
      'name': 'UPI',
      'icon': Icons.payment,
      'balance': null,
    },
    {
      'id': 'card',
      'name': 'Credit/Debit Card',
      'icon': Icons.credit_card,
      'balance': null,
    },
    {
      'id': 'cod',
      'name': 'Cash on Delivery',
      'icon': Icons.money,
      'balance': null,
    },
  ];

  final List<Map<String, dynamic>> _deliverySlots = [
    {
      'id': 'today_evening',
      'label': 'Today Evening',
      'time': '6:00 PM - 9:00 PM',
      'fee': 30.0,
    },
    {
      'id': 'tomorrow_morning',
      'label': 'Tomorrow Morning',
      'time': '9:00 AM - 12:00 PM',
      'fee': 25.0,
    },
    {
      'id': 'tomorrow_evening',
      'label': 'Tomorrow Evening',
      'time': '6:00 PM - 9:00 PM',
      'fee': 30.0,
    },
  ];

  final List<Map<String, dynamic>> _cartItems = [
    {
      'name': 'Fresh Tomatoes',
      'price': 45.0,
      'quantity': 2,
      'unit': 'kg',
    },
    {
      'name': 'Bananas',
      'price': 60.0,
      'quantity': 1,
      'unit': 'dozen',
    },
    {
      'name': 'Milk',
      'price': 55.0,
      'quantity': 3,
      'unit': 'liter',
    },
  ];

  double get _subtotal {
    return _cartItems.fold(0.0, (sum, item) {
      return sum + (item['price'] * item['quantity']);
    });
  }

  double get _deliveryFee {
    final slot = _deliverySlots.firstWhere(
      (slot) => slot['id'] == _selectedDeliverySlot,
    );
    return slot['fee'];
  }

  double get _serviceFee => 5.0;
  double get _total => _subtotal + _deliveryFee + _serviceFee;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: AppTheme.martPrimary,
        elevation: 0,
        title: const Text(
          'Checkout',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Delivery Address
            _buildSection(
              'Delivery Address',
              Icons.location_on,
              _buildAddressSection(),
            ),
            
            // Delivery Slot
            _buildSection(
              'Delivery Slot',
              Icons.schedule,
              _buildDeliverySlotSection(),
            ),
            
            // Payment Method
            _buildSection(
              'Payment Method',
              Icons.payment,
              _buildPaymentMethodSection(),
            ),
            
            // Order Summary
            _buildSection(
              'Order Summary',
              Icons.receipt,
              _buildOrderSummary(),
            ),
            
            // Place Order Button
            _buildPlaceOrderButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, IconData icon, Widget content) {
    return Container(
      margin: const EdgeInsets.all(16),
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
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(icon, color: AppTheme.martPrimary),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          content,
        ],
      ),
    );
  }

  Widget _buildAddressSection() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            TextFormField(
              controller: _addressController,
              decoration: const InputDecoration(
                labelText: 'Delivery Address',
                hintText: 'Enter your complete address',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.home),
              ),
              maxLines: 3,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your delivery address';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _instructionsController,
              decoration: const InputDecoration(
                labelText: 'Delivery Instructions (Optional)',
                hintText: 'Any special instructions for delivery',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.note),
              ),
              maxLines: 2,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDeliverySlotSection() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: _deliverySlots.map((slot) {
          final isSelected = slot['id'] == _selectedDeliverySlot;
          return RadioListTile<String>(
            value: slot['id'],
            groupValue: _selectedDeliverySlot,
            onChanged: (value) {
              setState(() {
                _selectedDeliverySlot = value!;
              });
            },
            title: Text(slot['label']),
            subtitle: Text(slot['time']),
            secondary: Text(
              '₹${slot['fee']}',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: AppTheme.martPrimary,
              ),
            ),
            activeColor: AppTheme.martPrimary,
            contentPadding: EdgeInsets.zero,
          );
        }).toList(),
      ),
    );
  }

  Widget _buildPaymentMethodSection() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: _paymentMethods.map((method) {
          final isSelected = method['id'] == _selectedPaymentMethod;
          return RadioListTile<String>(
            value: method['id'],
            groupValue: _selectedPaymentMethod,
            onChanged: (value) {
              setState(() {
                _selectedPaymentMethod = value!;
              });
            },
            title: Row(
              children: [
                Icon(method['icon'], color: AppTheme.martPrimary),
                const SizedBox(width: 8),
                Text(method['name']),
              ],
            ),
            subtitle: method['balance'] != null
                ? Text('Balance: ₹${method['balance']}')
                : null,
            activeColor: AppTheme.martPrimary,
            contentPadding: EdgeInsets.zero,
          );
        }).toList(),
      ),
    );
  }

  Widget _buildOrderSummary() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Cart Items
          ..._cartItems.map((item) {
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      '${item['name']} x${item['quantity']}',
                      style: const TextStyle(fontSize: 14),
                    ),
                  ),
                  Text(
                    '₹${(item['price'] * item['quantity']).toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
          
          const Divider(),
          
          // Summary
          _buildSummaryRow('Subtotal', '₹${_subtotal.toStringAsFixed(2)}'),
          _buildSummaryRow('Delivery Fee', '₹${_deliveryFee.toStringAsFixed(2)}'),
          _buildSummaryRow('Service Fee', '₹${_serviceFee.toStringAsFixed(2)}'),
          const Divider(),
          _buildSummaryRow(
            'Total',
            '₹${_total.toStringAsFixed(2)}',
            isTotal: true,
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: isTotal ? 16 : 14,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
              color: isTotal ? AppTheme.martPrimary : Colors.grey[700],
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: isTotal ? 16 : 14,
              fontWeight: FontWeight.bold,
              color: isTotal ? AppTheme.martPrimary : Colors.grey[700],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlaceOrderButton() {
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
      child: SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          onPressed: _isLoading ? null : _placeOrder,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.martPrimary,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          child: _isLoading
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(
                    color: Colors.white,
                    strokeWidth: 2,
                  ),
                )
              : const Text(
                  'Place Order',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
        ),
      ),
    );
  }

  void _placeOrder() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    // Simulate API call
    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      setState(() {
        _isLoading = false;
      });
      
      // Show success dialog
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          title: const Row(
            children: [
              Icon(Icons.check_circle, color: AppTheme.martAccent),
              SizedBox(width: 8),
              Text('Order Placed!'),
            ],
          ),
          content: const Text(
            'Your order has been placed successfully. You will receive updates on your order status.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context); // Close dialog
                Navigator.pop(context); // Go back to cart
                Navigator.pop(context); // Go back to product screen
                context.go('/home'); // Go to home
              },
              child: const Text(
                'OK',
                style: TextStyle(
                  color: AppTheme.martPrimary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      );
    }
  }

  @override
  void dispose() {
    _addressController.dispose();
    _instructionsController.dispose();
    super.dispose();
  }
}
