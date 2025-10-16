import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../utils/theme.dart';
import 'transport/booking_screen.dart';
import 'food/restaurants_screen.dart';
import 'mart/stores_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Jeb Dekho'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => context.go('/profile'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Welcome!',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Home Screen Ready',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Our Services',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 16),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              children: [
                _buildServiceCard(
                  context,
                  'Transport',
                  Icons.directions_car,
                  AppTheme.transportPrimary,
                  AppTheme.transportSecondary,
                ),
                _buildServiceCard(
                  context,
                  'Food',
                  Icons.restaurant,
                  AppTheme.foodPrimary,
                  AppTheme.foodSecondary,
                ),
                _buildServiceCard(
                  context,
                  'Mart',
                  Icons.shopping_cart,
                  AppTheme.martPrimary,
                  AppTheme.martSecondary,
                ),
                _buildServiceCard(
                  context,
                  'More',
                  Icons.apps,
                  Colors.grey[600]!,
                  Colors.grey[400]!,
                ),
              ],
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        onTap: (index) {
          switch (index) {
            case 0:
              context.go('/home');
              break;
            case 1:
              context.go('/services');
              break;
            case 2:
              context.go('/profile');
              break;
          }
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.grid_view),
            label: 'Services',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  Widget _buildServiceCard(
    BuildContext context,
    String title,
    IconData icon,
    Color primaryColor,
    Color secondaryColor,
  ) {
    return InkWell(
      onTap: () {
        if (title == 'Transport') {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const TransportBookingScreen(),
            ),
          );
        } else if (title == 'Food') {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const RestaurantsScreen(),
            ),
          );
        } else if (title == 'Mart') {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const MartStoresScreen(),
            ),
          );
        } else {
          context.go('/services');
        }
      },
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [primaryColor, secondaryColor],
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: primaryColor.withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 48,
              color: Colors.white,
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}