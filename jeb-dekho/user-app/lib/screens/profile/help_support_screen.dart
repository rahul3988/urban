import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../utils/theme.dart';

class HelpSupportScreen extends StatefulWidget {
  const HelpSupportScreen({super.key});

  @override
  State<HelpSupportScreen> createState() => _HelpSupportScreenState();
}

class _HelpSupportScreenState extends State<HelpSupportScreen> {
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _messageController = TextEditingController();
  
  String _selectedCategory = 'general';
  bool _isLoading = false;

  final List<Map<String, dynamic>> _faqCategories = [
    {
      'id': 'general',
      'title': 'General',
      'icon': Icons.help_outline,
      'color': AppTheme.transportPrimary,
    },
    {
      'id': 'transport',
      'title': 'Transport',
      'icon': Icons.directions_car,
      'color': AppTheme.transportSecondary,
    },
    {
      'id': 'food',
      'title': 'Food Delivery',
      'icon': Icons.restaurant,
      'color': AppTheme.foodPrimary,
    },
    {
      'id': 'mart',
      'title': 'Mart & Grocery',
      'icon': Icons.shopping_cart,
      'color': AppTheme.martPrimary,
    },
    {
      'id': 'payment',
      'title': 'Payment & Wallet',
      'icon': Icons.payment,
      'color': AppTheme.transportAccent,
    },
  ];

  final List<Map<String, dynamic>> _faqs = [
    {
      'category': 'general',
      'question': 'How do I create an account?',
      'answer': 'You can create an account by downloading the Jeb Dekho app and following the registration process. You\'ll need to provide your email, phone number, and create a password.',
    },
    {
      'category': 'general',
      'question': 'How do I reset my password?',
      'answer': 'Go to the login screen and tap "Forgot Password". Enter your email address and follow the instructions sent to your email to reset your password.',
    },
    {
      'category': 'transport',
      'question': 'How do I book a ride?',
      'answer': 'Open the app, select Transport service, enter your pickup and drop locations, choose your vehicle type, and confirm the booking.',
    },
    {
      'category': 'transport',
      'question': 'Can I cancel my ride booking?',
      'answer': 'Yes, you can cancel your ride booking before the driver arrives. Cancellation fees may apply based on the timing.',
    },
    {
      'category': 'food',
      'question': 'How do I place a food order?',
      'answer': 'Select Food service, browse restaurants, choose your items, add to cart, select delivery address, and proceed to checkout.',
    },
    {
      'category': 'food',
      'question': 'What if my food order is delayed?',
      'answer': 'If your order is delayed, you can track it in real-time. Contact support if the delay is significant and we\'ll assist you.',
    },
    {
      'category': 'mart',
      'question': 'How do I schedule grocery delivery?',
      'answer': 'Select Mart service, browse stores, add items to cart, choose a delivery slot, and complete your order.',
    },
    {
      'category': 'mart',
      'question': 'What if an item is out of stock?',
      'answer': 'If an item is out of stock, we\'ll notify you and suggest alternatives. You can also contact the store directly.',
    },
    {
      'category': 'payment',
      'question': 'How do I add money to my wallet?',
      'answer': 'Go to Profile > Wallet, tap "Add Money", enter the amount, and choose your payment method to recharge your wallet.',
    },
    {
      'category': 'payment',
      'question': 'Is my payment information secure?',
      'answer': 'Yes, we use industry-standard encryption to protect your payment information. We never store your card details.',
    },
  ];

  List<Map<String, dynamic>> get _filteredFaqs {
    return _faqs.where((faq) {
      return faq['category'] == _selectedCategory;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: AppTheme.transportPrimary,
        elevation: 0,
        title: const Text(
          'Help & Support',
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
      body: Column(
        children: [
          // Search Bar
          Container(
            color: AppTheme.transportPrimary,
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search for help...',
                prefixIcon: const Icon(Icons.search, color: AppTheme.transportPrimary),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
              ),
              onChanged: (value) {
                // Implement search functionality
              },
            ),
          ),
          
          // Quick Actions
          _buildQuickActions(),
          
          // FAQ Categories
          _buildFaqCategories(),
          
          // FAQ List
          Expanded(
            child: _buildFaqList(),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
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
          const Text(
            'Quick Actions',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildQuickActionButton(
                  'Contact Support',
                  Icons.support_agent,
                  AppTheme.transportSecondary,
                  _contactSupport,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildQuickActionButton(
                  'Live Chat',
                  Icons.chat,
                  AppTheme.foodSecondary,
                  _startLiveChat,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildQuickActionButton(
                  'Call Us',
                  Icons.phone,
                  AppTheme.martSecondary,
                  _callSupport,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionButton(
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                color: color,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFaqCategories() {
    return Container(
      height: 100,
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _faqCategories.length,
        itemBuilder: (context, index) {
          final category = _faqCategories[index];
          final isSelected = category['id'] == _selectedCategory;
          
          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: InkWell(
              onTap: () {
                setState(() {
                  _selectedCategory = category['id'];
                });
              },
              borderRadius: BorderRadius.circular(12),
              child: Container(
                width: 80,
                decoration: BoxDecoration(
                  color: isSelected 
                      ? category['color'].withOpacity(0.2)
                      : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isSelected 
                        ? category['color']
                        : Colors.grey[300]!,
                    width: isSelected ? 2 : 1,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      category['icon'],
                      color: isSelected 
                          ? category['color']
                          : Colors.grey[600],
                      size: 24,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      category['title'],
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        color: isSelected 
                            ? category['color']
                            : Colors.grey[600],
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFaqList() {
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
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                const Text(
                  'Frequently Asked Questions',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                Text(
                  '${_filteredFaqs.length} questions',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: ListView.builder(
              itemCount: _filteredFaqs.length,
              itemBuilder: (context, index) {
                final faq = _filteredFaqs[index];
                return _buildFaqItem(faq);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFaqItem(Map<String, dynamic> faq) {
    return ExpansionTile(
      title: Text(
        faq['question'],
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
        ),
      ),
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          child: Text(
            faq['answer'],
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[700],
              height: 1.5,
            ),
          ),
        ),
      ],
    );
  }

  void _contactSupport() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.7,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          children: [
            Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                'Contact Support',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const Divider(),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    DropdownButtonFormField<String>(
                      value: _selectedCategory,
                      decoration: const InputDecoration(
                        labelText: 'Category',
                        border: OutlineInputBorder(),
                      ),
                      items: _faqCategories.map((category) {
                        return DropdownMenuItem(
                          value: category['id'],
                          child: Text(category['title']),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedCategory = value!;
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _messageController,
                      decoration: const InputDecoration(
                        labelText: 'Describe your issue',
                        hintText: 'Please provide details about your problem...',
                        border: OutlineInputBorder(),
                      ),
                      maxLines: 4,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please describe your issue';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _submitSupportRequest,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.transportPrimary,
                          padding: const EdgeInsets.symmetric(vertical: 16),
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
                                'Submit Request',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _submitSupportRequest() async {
    if (_messageController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please describe your issue'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    // Simulate API call
    await Future.delayed(const Duration(seconds: 2));

    if (mounted) {
      setState(() {
        _isLoading = false;
      });
      
      Navigator.pop(context); // Close bottom sheet
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Support request submitted successfully. We\'ll get back to you soon!'),
          backgroundColor: AppTheme.transportAccent,
        ),
      );
      
      _messageController.clear();
    }
  }

  void _startLiveChat() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Live Chat'),
        content: const Text('Live chat feature will be available soon. For now, please use the contact support option.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _callSupport() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Call Support'),
        content: const Text('Call our support team at:\n\n+91 1800-123-4567\n\nAvailable 24/7'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // Implement phone call functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Opening phone dialer...'),
                  backgroundColor: AppTheme.transportAccent,
                ),
              );
            },
            child: const Text('Call'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    _messageController.dispose();
    super.dispose();
  }
}
