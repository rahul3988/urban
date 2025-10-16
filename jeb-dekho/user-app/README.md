# Jeb Dekho User App

A comprehensive Flutter mobile application for the Jeb Dekho multi-service platform, providing users with access to transport, food delivery, and mart services.

## Features

### Authentication
- **Login Screen** (`/login`) - Email/phone login with password
- **Signup Screen** (`/signup`) - User registration with validation
- **OTP Verification** (`/otp`) - Phone/email verification
- **Forgot Password** (`/forgot-password`) - Password reset functionality

### Home Dashboard
- **Home Screen** (`/home`) - Service selection and promotional banners
- **Services Screen** (`/services`) - Detailed service categories

### Transport Services
- **Booking Screen** - Vehicle/service selection
- **Pickup/Drop Selection** - Location selection with map integration
- **Fare Estimation** - Real-time fare calculation
- **Driver Tracking** - Live location tracking and ETA
- **Trip Completion** - Rating and feedback system

### Food Delivery
- **Restaurants Screen** - Restaurant listing with filters
- **Menu Categories** - Food categories and items
- **Item Details** - Product details with customization
- **Cart Management** - Shopping cart with delivery scheduling
- **Order Tracking** - Real-time order status updates

### Mart Services
- **Stores Screen** (`/mart/stores`) - Mart store listing
- **Product Details** (`/mart/product-detail`) - Product information and pricing
- **Shopping Cart** (`/mart/cart`) - Cart management with delivery scheduling
- **Checkout** (`/mart/checkout`) - Payment and order confirmation

### Profile & Settings
- **Profile Screen** (`/profile`) - User profile overview
- **Personal Info** (`/profile/personal-info`) - Edit personal information
- **Saved Addresses** (`/profile/saved-addresses`) - Address book management
- **Wallet** (`/profile/wallet`) - Payment methods and wallet balance
- **Order History** (`/profile/order-history`) - Past orders and tracking
- **Help & Support** (`/profile/help-support`) - Customer support and FAQ

## Navigation Structure

```
/ (root)
├── /login
├── /signup
├── /otp
├── /forgot-password
├── /home
├── /services
├── /profile
│   ├── /profile/personal-info
│   ├── /profile/saved-addresses
│   ├── /profile/wallet
│   ├── /profile/order-history
│   └── /profile/help-support
├── /transport
│   ├── /booking
│   ├── /pickup-drop
│   ├── /fare-estimation
│   ├── /driver-tracking
│   └── /trip-completion
├── /food
│   ├── /restaurants
│   ├── /menu
│   ├── /item-detail
│   ├── /cart
│   └── /order-tracking
└── /mart
    ├── /stores
    ├── /product-detail
    ├── /cart
    └── /checkout
```

## Brand Colors

### Transport Services
- Primary: `#374151` (Gray)
- Secondary: `#3B82F6` (Blue)
- Accent: `#10B981` (Green)

### Food Services
- Primary: `#92400E` (Brown)
- Secondary: `#84CC16` (Lime)
- Accent: `#FEF3C7` (Light Yellow)

### Mart Services
- Primary: `#0D9488` (Teal)
- Secondary: `#F97316` (Orange)
- Accent: `#F0FDF4` (Light Green)

## Technical Stack

- **Framework**: Flutter
- **State Management**: Provider/Riverpod
- **Routing**: GoRouter
- **UI Components**: Material Design
- **HTTP Client**: Dio
- **Local Storage**: SharedPreferences
- **Maps**: Google Maps
- **Push Notifications**: Firebase Cloud Messaging

## Getting Started

### Prerequisites
- Flutter SDK (3.0+)
- Dart SDK (3.0+)
- Android Studio / VS Code
- Android/iOS device or emulator

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rahul3988/urban.git
cd urban/jeb-dekho/user-app
```

2. Install dependencies:
```bash
flutter pub get
```

3. Run the app:
```bash
flutter run
```

## API Integration

The app integrates with the Jeb Dekho backend API for:
- User authentication and management
- Service booking and ordering
- Real-time updates via WebSocket
- Payment processing
- Push notifications

### Key API Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /services/transport` - Transport services
- `GET /services/food` - Food services
- `GET /services/mart` - Mart services
- `POST /orders` - Create order
- `GET /orders/{id}` - Get order details
- `WebSocket /ws` - Real-time updates

## Testing

### Unit Tests
```bash
flutter test
```

### Integration Tests
```bash
flutter test integration_test/
```

### Widget Tests
```bash
flutter test test/widget_test.dart
```

## Build & Deployment

### Android
```bash
flutter build apk --release
```

### iOS
```bash
flutter build ios --release
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact:
- Email: support@jebdekho.com
- Documentation: https://docs.jebdekho.com
- Issues: https://github.com/rahul3988/urban/issues