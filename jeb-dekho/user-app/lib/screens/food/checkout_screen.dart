import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/cart_provider.dart';
import '../../services/api_service.dart';
import '../../utils/theme.dart';
import 'order_tracking_screen.dart';

class CheckoutScreen extends StatefulWidget {
  final String restaurantId;
  final String restaurantName;
  final String? specialInstructions;
  final String? promoCode;
  final double discount;

  const CheckoutScreen({
    super.key,
    required this.restaurantId,
    required this.restaurantName,
    this.specialInstructions,
    this.promoCode,
    this.discount = 0,
  });

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  String _selectedPaymentMethod = 'CASH';
  Map<String, dynamic>? _selectedAddress;
  bool _isLoading = false;
  double _walletBalance = 0;
  
  // Mock addresses
  final List<Map<String, dynamic>> _addresses = [
    {
      'id': 'addr1',
      'type': 'HOME',
      'line1': '123 Main Street',
      'line2': 'Near City Mall',
      'city': 'Mumbai',
      'state': 'Maharashtra',
      'pincode': '400001',
      'isDefault': true,
    },
    {
      'id': 'addr2',
      'type': 'WORK',
      'line1': '456 Business Park',
      'line2': 'Tech Hub',
      'city': 'Mumbai',
      'state': 'Maharashtra',
      'pincode': '400002',
      'isDefault': false,
    },
  ];

  @override
  void initState() {
    super.initState();
    _selectedAddress = _addresses.firstWhere((addr) => addr['isDefault'] == true);
    _loadWalletBalance();
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

  Future<void> _placeOrder(CartProvider cart) async {
    if (_selectedAddress == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select delivery address')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await ApiService.createFoodOrder(
        vendorId: widget.restaurantId,
        items: cart.getOrderItems(),
        deliveryAddress: _selectedAddress!,
        paymentMethod: _selectedPaymentMethod,
        specialInstructions: widget.specialInstructions,
        promoCode: widget.promoCode,
      );

      if (mounted) {
        cart.clear();
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => OrderTrackingScreen(
              order: response['data'],
              restaurantName: widget.restaurantName,
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
    final cart = Provider.of<CartProvider>(context);
    final deliveryFee = 40.0;
    final taxes = cart.totalAmount * 0.05;
    final grandTotal = cart.totalAmount + deliveryFee + taxes - widget.discount;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Checkout'),
        backgroundColor: AppTheme.foodSecondary,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Delivery Address
          const Text(
            'Delivery Address',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          ..._addresses.map((address) => _buildAddressOption(address)),
          TextButton.icon(
            onPressed: () {
              // Navigate to add address screen
            },
            icon: const Icon(Icons.add),
            label: const Text('Add New Address'),
          ),
          
          const SizedBox(height: 24),
          
          // Payment Method
          const Text(
            'Payment Method',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          _buildPaymentOption('CASH', 'Cash on Delivery', Icons.money),
          _buildPaymentOption('WALLET', 'Wallet (₹$_walletBalance)', Icons.account_balance_wallet),
          _buildPaymentOption('UPI', 'UPI', Icons.phone_android),
          _buildPaymentOption('CARD', 'Credit/Debit Card', Icons.credit_card),
          
          const SizedBox(height: 24),
          
          // Order Summary
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey[300]!),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Order Summary',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                ...cart.items.values.map((item) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('${item.name} x ${item.quantity}'),
                      Text('₹${item.totalPrice}'),
                    ],
                  ),
                )),
                const Divider(height: 24),
                _buildSummaryRow('Subtotal', '₹${cart.totalAmount.toStringAsFixed(2)}'),
                _buildSummaryRow('Delivery Fee', '₹${deliveryFee.toStringAsFixed(2)}'),
                _buildSummaryRow('Taxes', '₹${taxes.toStringAsFixed(2)}'),
                if (widget.discount > 0)
                  _buildSummaryRow(
                    'Promo Discount',
                    '-₹${widget.discount.toStringAsFixed(2)}',
                    color: Colors.green,
                  ),
                const Divider(height: 24),
                _buildSummaryRow(
                  'Total',
                  '₹${grandTotal.toStringAsFixed(2)}',
                  isTotal: true,
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
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
        child: ElevatedButton(
          onPressed: _isLoading ? null : () => _placeOrder(cart),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.foodSecondary,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          child: _isLoading
              ? const CircularProgressIndicator(color: Colors.white)
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Place Order',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '₹${grandTotal.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _buildAddressOption(Map<String, dynamic> address) {
    final isSelected = _selectedAddress?['id'] == address['id'];
    
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedAddress = address;
        });
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? AppTheme.foodSecondary : Colors.grey[300]!,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
          color: isSelected ? AppTheme.foodSecondary.withOpacity(0.1) : null,
        ),
        child: Row(
          children: [
            Icon(
              address['type'] == 'HOME' ? Icons.home : Icons.work,
              color: isSelected ? AppTheme.foodSecondary : Colors.grey[600],
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    address['type'],
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(address['line1']),
                  if (address['line2'] != null) Text(address['line2']),
                  Text('${address['city']}, ${address['pincode']}'),
                ],
              ),
            ),
            if (isSelected)
              Icon(
                Icons.check_circle,
                color: AppTheme.foodSecondary,
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentOption(String value, String label, IconData icon) {
    final isSelected = _selectedPaymentMethod == value;
    final isDisabled = value == 'WALLET' && _walletBalance < (cart.totalAmount + 40 + (cart.totalAmount * 0.05) - widget.discount);
    
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
            color: isSelected ? AppTheme.foodSecondary : Colors.grey[300]!,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
          color: isDisabled 
              ? Colors.grey[100] 
              : isSelected 
                  ? AppTheme.foodSecondary.withOpacity(0.1) 
                  : null,
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: isDisabled 
                  ? Colors.grey[400] 
                  : isSelected 
                      ? AppTheme.foodSecondary 
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
                color: AppTheme.foodSecondary,
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isTotal = false, Color? color}) {
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
              color: color ?? (isTotal ? AppTheme.foodPrimary : null),
            ),
          ),
        ],
      ),
    );
  }

  CartProvider get cart => Provider.of<CartProvider>(context, listen: false);
}