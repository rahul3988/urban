# Jeb Dekho Delivery Partner App

A Flutter mobile application designed for delivery partners to manage trips, track earnings, and communicate with users and vendors in the Jeb Dekho ecosystem.

## Features

### Authentication & Onboarding
- **Login Screen** (`/login`) - Partner authentication
- **Registration** - Driver registration with document upload
- **Profile Setup** - Vehicle and personal information

### Trip Management
- **Dashboard** (`/dashboard`) - Status overview and trip queue
- **Trip Queue** - Available and assigned trips
- **Trip Details** (`/trip-detail`) - Detailed trip information with navigation
- **Map Integration** - Real-time navigation and location tracking
- **Trip Completion** - Mark trips as completed with photos

### Earnings & Analytics
- **Earnings Screen** (`/earnings`) - Daily, weekly, and monthly earnings
- **Performance Metrics** - Trip completion rates and ratings
- **Payout History** - Payment history and schedules
- **Commission Tracking** - Service-wise commission breakdown

### Communication
- **In-App Chat** - Direct communication with users and vendors
- **Call Integration** - One-tap calling to users/vendors
- **Notification Center** - Trip alerts and system notifications

### Profile Management
- **Profile Screen** (`/profile`) - Personal and vehicle information
- **Document Management** - License, registration, insurance uploads
- **Settings** - App preferences and notification settings
- **Support** - Help and customer support

## Navigation Structure

```
/ (root)
├── /login
├── /dashboard
├── /trip-detail
├── /earnings
├── /profile
├── /chat
├── /settings
└── /support
```

## Key Screens

### Dashboard Screen
- **Status Toggle** - Online/Offline status
- **Today's Summary** - Earnings, trips, ratings
- **Recent Trips** - Quick access to recent trips
- **Quick Actions** - Start/stop accepting trips

### Trip Detail Screen
- **Trip Information** - Pickup/drop locations, customer details
- **Navigation** - Integrated map with turn-by-turn directions
- **Customer Contact** - Call/message customer directly
- **Trip Actions** - Start trip, mark pickup, complete delivery

### Earnings Screen
- **Daily Earnings** - Today's income breakdown
- **Weekly/Monthly Stats** - Historical earnings data
- **Commission Details** - Service-wise commission rates
- **Payout Schedule** - Next payout information

### Profile Screen
- **Personal Info** - Name, phone, address
- **Vehicle Details** - Vehicle type, number, documents
- **Performance Stats** - Ratings, completion rate
- **Account Settings** - Payment methods, preferences

## Brand Colors

### Primary Colors
- Primary: `#1F2937` (Dark Gray)
- Secondary: `#3B82F6` (Blue)
- Accent: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)

## Technical Stack

- **Framework**: Flutter
- **State Management**: Provider/Riverpod
- **Routing**: GoRouter
- **UI Components**: Material Design
- **Maps**: Google Maps
- **HTTP Client**: Dio
- **Local Storage**: SharedPreferences
- **Push Notifications**: Firebase Cloud Messaging
- **Image Picker**: Image picker for document uploads

## Getting Started

### Prerequisites
- Flutter SDK (3.0+)
- Dart SDK (3.0+)
- Android Studio / VS Code
- Android/iOS device or emulator
- Google Maps API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rahul3988/urban.git
cd urban/jeb-dekho/delivery-partner-app
```

2. Install dependencies:
```bash
flutter pub get
```

3. Configure Google Maps:
   - Add your Google Maps API key to `android/app/src/main/AndroidManifest.xml`
   - Add your Google Maps API key to `ios/Runner/AppDelegate.swift`

4. Run the app:
```bash
flutter run
```

## API Integration

### Key API Endpoints
- `POST /auth/login` - Partner login
- `GET /trips/queue` - Get available trips
- `GET /trips/{id}` - Get trip details
- `POST /trips/{id}/accept` - Accept trip
- `POST /trips/{id}/start` - Start trip
- `POST /trips/{id}/complete` - Complete trip
- `GET /earnings` - Get earnings data
- `GET /profile` - Get partner profile
- `PUT /profile` - Update profile
- `WebSocket /ws` - Real-time trip updates

### WebSocket Events
- `trip_assigned` - New trip assigned
- `trip_cancelled` - Trip cancelled by user
- `location_update` - Real-time location sharing
- `chat_message` - In-app chat messages

## Real-time Features

### Location Tracking
- Continuous GPS tracking during active trips
- Location sharing with users and system
- Geofencing for pickup/drop locations

### Push Notifications
- New trip assignments
- Trip cancellations
- Payment confirmations
- System announcements

### Live Updates
- Real-time trip status changes
- Dynamic fare calculations
- Traffic and route optimization

## Testing

### Unit Tests
```bash
flutter test
```

### Integration Tests
```bash
flutter test integration_test/
```

### Driver Tests
```bash
flutter drive --target=test_driver/app.dart
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

## Performance Optimization

### Battery Optimization
- Efficient location tracking
- Background task management
- Power-saving modes

### Data Usage
- Offline map caching
- Compressed API responses
- Smart sync strategies

## Security Features

### Data Protection
- Encrypted local storage
- Secure API communication
- Biometric authentication

### Privacy
- Location data anonymization
- User data protection
- GDPR compliance

## Troubleshooting

### Common Issues

1. **Location not updating**
   - Check GPS permissions
   - Verify location services enabled
   - Test in different environments

2. **Maps not loading**
   - Verify Google Maps API key
   - Check internet connectivity
   - Clear app cache

3. **Push notifications not working**
   - Check notification permissions
   - Verify Firebase configuration
   - Test on different devices

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
- Email: partners@jebdekho.com
- Documentation: https://docs.jebdekho.com/partners
- Issues: https://github.com/rahul3988/urban/issues