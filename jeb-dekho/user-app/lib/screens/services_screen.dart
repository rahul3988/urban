import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../utils/theme.dart';

class ServicesScreen extends StatelessWidget {
  const ServicesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Services'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/home'),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'All Services',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Services Screen Ready',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 24),
            _buildServiceSection(
              'Transport Services',
              Icons.directions_car,
              AppTheme.transportPrimary,
              [
                _ServiceItem('Taxi', Icons.local_taxi),
                _ServiceItem('Bike Ride', Icons.two_wheeler),
                _ServiceItem('Auto', Icons.electric_rickshaw),
                _ServiceItem('Outstation', Icons.route),
              ],
            ),
            const SizedBox(height: 24),
            _buildServiceSection(
              'Food Services',
              Icons.restaurant,
              AppTheme.foodPrimary,
              [
                _ServiceItem('Food Delivery', Icons.delivery_dining),
                _ServiceItem('Dine In', Icons.restaurant_menu),
                _ServiceItem('Takeaway', Icons.takeout_dining),
                _ServiceItem('Catering', Icons.food_bank),
              ],
            ),
            const SizedBox(height: 24),
            _buildServiceSection(
              'Mart Services',
              Icons.shopping_cart,
              AppTheme.martPrimary,
              [
                _ServiceItem('Grocery', Icons.shopping_basket),
                _ServiceItem('Pharmacy', Icons.medical_services),
                _ServiceItem('Electronics', Icons.devices),
                _ServiceItem('Daily Essentials', Icons.inventory_2),
              ],
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 1,
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

  Widget _buildServiceSection(
    String title,
    IconData titleIcon,
    Color color,
    List<_ServiceItem> services,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(titleIcon, color: color, size: 28),
            const SizedBox(width: 8),
            Text(
              title,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: color,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.5,
          ),
          itemCount: services.length,
          itemBuilder: (context, index) {
            return Card(
              elevation: 2,
              child: InkWell(
                onTap: () {},
                borderRadius: BorderRadius.circular(8),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      services[index].icon,
                      size: 32,
                      color: color,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      services[index].name,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}

class _ServiceItem {
  final String name;
  final IconData icon;

  _ServiceItem(this.name, this.icon);
}