import 'package:flutter/foundation.dart';

class CartItem {
  final String id;
  final String name;
  final double price;
  int quantity;
  final String vendorId;
  final Map<String, dynamic>? customizations;

  CartItem({
    required this.id,
    required this.name,
    required this.price,
    required this.quantity,
    required this.vendorId,
    this.customizations,
  });

  double get totalPrice => price * quantity;
}

class CartProvider extends ChangeNotifier {
  final Map<String, CartItem> _items = {};
  String? _currentVendorId;
  
  Map<String, CartItem> get items => {..._items};
  String? get currentVendorId => _currentVendorId;
  
  int get itemCount => _items.length;
  
  double get totalAmount {
    return _items.values.fold(0, (sum, item) => sum + item.totalPrice);
  }

  void addItem(
    String productId,
    String name,
    double price,
    String vendorId, {
    Map<String, dynamic>? customizations,
  }) {
    // Check if cart has items from different vendor
    if (_currentVendorId != null && _currentVendorId != vendorId) {
      throw Exception('Cannot add items from different vendors');
    }

    if (_items.containsKey(productId)) {
      _items[productId]!.quantity += 1;
    } else {
      _items[productId] = CartItem(
        id: productId,
        name: name,
        price: price,
        quantity: 1,
        vendorId: vendorId,
        customizations: customizations,
      );
      _currentVendorId = vendorId;
    }
    notifyListeners();
  }

  void removeItem(String productId) {
    _items.remove(productId);
    if (_items.isEmpty) {
      _currentVendorId = null;
    }
    notifyListeners();
  }

  void updateQuantity(String productId, int quantity) {
    if (!_items.containsKey(productId)) return;
    
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      _items[productId]!.quantity = quantity;
      notifyListeners();
    }
  }

  void clear() {
    _items.clear();
    _currentVendorId = null;
    notifyListeners();
  }

  List<Map<String, dynamic>> getOrderItems() {
    return _items.values.map((item) => {
      'id': item.id,
      'quantity': item.quantity,
      'customizations': item.customizations ?? [],
    }).toList();
  }
}