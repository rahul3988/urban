import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/orders_screen.dart';
import 'screens/earnings_screen.dart';
import 'screens/trip_detail_screen.dart';
import 'screens/profile_screen.dart';
import 'utils/theme.dart';

void main() {
  runApp(const JebDekhoDeliveryApp());
}

class JebDekhoDeliveryApp extends StatelessWidget {
  const JebDekhoDeliveryApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Jeb Dekho - Delivery Partner',
      theme: AppTheme.lightTheme,
      routerConfig: _router,
      debugShowCheckedModeBanner: false,
    );
  }
}

final _router = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => const DashboardScreen(),
    ),
    GoRoute(
      path: '/orders',
      builder: (context, state) => const OrdersScreen(),
    ),
    GoRoute(
      path: '/earnings',
      builder: (context, state) => const EarningsScreen(),
    ),
    GoRoute(
      path: '/trip-detail',
      builder: (context, state) {
        final tripId = state.extra as String? ?? 'TRIP001';
        final tripType = state.extra as String? ?? 'food';
        return TripDetailScreen(tripId: tripId, tripType: tripType);
      },
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => const DeliveryPartnerProfileScreen(),
    ),
  ],
);