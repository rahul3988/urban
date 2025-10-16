import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'dart:async';

class WebSocketService {
  static final WebSocketService _instance = WebSocketService._internal();
  factory WebSocketService() => _instance;
  WebSocketService._internal();

  IO.Socket? _socket;
  String? _token;
  
  final _locationStreamController = StreamController<Map<String, dynamic>>.broadcast();
  final _orderStatusStreamController = StreamController<Map<String, dynamic>>.broadcast();
  final _notificationStreamController = StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get locationStream => _locationStreamController.stream;
  Stream<Map<String, dynamic>> get orderStatusStream => _orderStatusStreamController.stream;
  Stream<Map<String, dynamic>> get notificationStream => _notificationStreamController.stream;

  void connect(String token) {
    _token = token;
    
    _socket = IO.io(
      'http://localhost:5000',
      IO.OptionBuilder()
        .setTransports(['websocket'])
        .setAuth({'token': token})
        .build(),
    );

    _socket!.onConnect((_) {
      print('WebSocket Connected');
    });

    _socket!.onDisconnect((_) {
      print('WebSocket Disconnected');
    });

    _socket!.onError((error) {
      print('WebSocket Error: $error');
    });

    // Listen for driver location updates
    _socket!.on('driver:location', (data) {
      _locationStreamController.add(data);
    });

    // Listen for order status updates
    _socket!.on('order:status:changed', (data) {
      _orderStatusStreamController.add(data);
    });

    // Listen for notifications
    _socket!.on('notification', (data) {
      _notificationStreamController.add(data);
    });
  }

  void trackBooking(String bookingId) {
    _socket?.emit('track:ride', bookingId);
  }

  void untrackBooking(String bookingId) {
    _socket?.emit('untrack:ride', bookingId);
  }

  void trackOrder(String orderId) {
    _socket?.emit('track:order', orderId);
  }

  void untrackOrder(String orderId) {
    _socket?.emit('untrack:order', orderId);
  }

  void disconnect() {
    _socket?.disconnect();
    _socket = null;
  }

  void dispose() {
    _locationStreamController.close();
    _orderStatusStreamController.close();
    _notificationStreamController.close();
    disconnect();
  }
}