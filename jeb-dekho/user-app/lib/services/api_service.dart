import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'package:flutter/foundation.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:5000/api/v1';
  static String? _token;
  
  static void setToken(String? token) {
    _token = token;
  }

  static Map<String, String> get _headers {
    final headers = {'Content-Type': 'application/json'};
    if (_token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

  // Auth APIs
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200 && data['success']) {
      _token = data['data']['token'];
      return data;
    } else {
      throw Exception(data['error']?['message'] ?? 'Login failed');
    }
  }

  static Future<Map<String, dynamic>> register(Map<String, dynamic> userData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(userData),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 201 && data['success']) {
      _token = data['data']['token'];
      return data;
    } else {
      throw Exception(data['error']?['message'] ?? 'Registration failed');
    }
  }

  static Future<Map<String, dynamic>> verifyOTP(String phone, String otp) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/verify-otp'),
      headers: _headers,
      body: jsonEncode({
        'phone': phone,
        'otp': otp,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200 && data['success']) {
      if (data['data']['token'] != null) {
        _token = data['data']['token'];
      }
      return data;
    } else {
      throw Exception(data['error']?['message'] ?? 'OTP verification failed');
    }
  }

  // Transport APIs
  static Future<Map<String, dynamic>> getTransportEstimate({
    required double pickupLat,
    required double pickupLng,
    required double dropLat,
    required double dropLng,
    String? vehicleType,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/transport/estimate'),
      headers: _headers,
      body: jsonEncode({
        'pickupLat': pickupLat,
        'pickupLng': pickupLng,
        'dropLat': dropLat,
        'dropLng': dropLng,
        if (vehicleType != null) 'vehicleType': vehicleType,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200 && data['success']) {
      return data;
    } else {
      throw Exception(data['error']?['message'] ?? 'Failed to get estimate');
    }
  }

  static Future<Map<String, dynamic>> createBooking({
    required Map<String, double> pickupLocation,
    required Map<String, double> dropLocation,
    required String vehicleType,
    required String paymentMethod,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/transport/book'),
      headers: _headers,
      body: jsonEncode({
        'pickupLocation': pickupLocation,
        'dropLocation': dropLocation,
        'vehicleType': vehicleType,
        'paymentMethod': paymentMethod,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 201 && data['success']) {
      return data;
    } else {
      throw Exception(data['error']?['message'] ?? 'Failed to create booking');
    }
  }

  static Future<Map<String, dynamic>> trackBooking(String bookingId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/transport/bookings/$bookingId/track'),
      headers: _headers,
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200 && data['success']) {
      return data;
    } else {
      throw Exception(data['error']?['message'] ?? 'Failed to track booking');
    }
  }

  static Future<Map<String, dynamic>> cancelBooking(String bookingId, String reason) async {
    final response = await http.put(
      Uri.parse('$baseUrl/transport/bookings/$bookingId/cancel'),
      headers: _headers,
      body: jsonEncode({'reason': reason}),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200 && data['success']) {
      return data;
    } else {
      throw Exception(data['error']?['message'] ?? 'Failed to cancel booking');
    }
  }

  // Food APIs
  static Future<Map<String, dynamic>> getRestaurants({
    int page = 1,
    int limit = 10,
    String? search,
  }) async {
    final queryParams = {
      'page': page.toString(),
      'limit': limit.toString(),
      if (search != null) 'search': search,
    };

    final uri = Uri.parse('$baseUrl/food/restaurants').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: _headers);

    final data = jsonDecode(response.body);
    if (response.statusCode == 200 && data['success']) {
      return data;
    } else {
      throw Exception(data['error']?['message'] ?? 'Failed to load restaurants');
    }
  }

  static Future<Map<String, dynamic>> getMenu(String restaurantId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/food/restaurants/$restaurantId/menu'),
      headers: _headers,
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200 && data['success']) {
      return data;
    } else {
      throw Exception(data['error']?['message'] ?? 'Failed to load menu');
    }
  }

  static Future<Map<String, dynamic>> createFoodOrder({
    required String vendorId,
    required List<Map<String, dynamic>> items,
    required Map<String, dynamic> deliveryAddress,
    required String paymentMethod,
    String? specialInstructions,
    String? promoCode,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/food/orders'),
      headers: _headers,
      body: jsonEncode({
        'vendorId': vendorId,
        'items': items,
        'deliveryAddress': deliveryAddress,
        'paymentMethod': paymentMethod,
        if (specialInstructions != null) 'specialInstructions': specialInstructions,
        if (promoCode != null) 'promoCode': promoCode,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 201 && data['success']) {
      return data;
    } else {
      throw Exception(data['error']?['message'] ?? 'Failed to create order');
    }
  }

  // Wallet APIs
  static Future<Map<String, dynamic>> getWallet() async {
    final response = await http.get(
      Uri.parse('$baseUrl/payments/wallet'),
      headers: _headers,
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200 && data['success']) {
      return data;
    } else {
      throw Exception(data['error']?['message'] ?? 'Failed to get wallet');
    }
  }

  static Future<Map<String, dynamic>> addMoneyToWallet(double amount, String method) async {
    final response = await http.post(
      Uri.parse('$baseUrl/payments/wallet/add'),
      headers: _headers,
      body: jsonEncode({
        'amount': amount,
        'method': method,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200 && data['success']) {
      return data;
    } else {
      throw Exception(data['error']?['message'] ?? 'Failed to add money');
    }
  }

  // Promo APIs
  static Future<Map<String, dynamic>> validatePromoCode({
    required String code,
    required double orderValue,
    required String serviceType,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/promos/validate'),
      headers: _headers,
      body: jsonEncode({
        'code': code,
        'orderValue': orderValue,
        'serviceType': serviceType,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200 && data['success']) {
      return data;
    } else {
      throw Exception(data['error']?['message'] ?? 'Invalid promo code');
    }
  }
}