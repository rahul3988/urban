# Jeb Dekho Backend API

A comprehensive Node.js TypeScript backend for the Jeb Dekho multi-service platform.

## Features

- 🔐 JWT-based authentication with OTP verification
- 👥 Multi-role support (Customer, Vendor, Delivery Partner, Admin)
- 🚗 Transport booking with real-time tracking
- 🍕 Food ordering system
- 🛒 Mart/grocery ordering
- 💳 Payment integration (Wallet, Cards, UPI)
- ⭐ Ratings and reviews
- 📱 Real-time notifications
- 📊 Admin analytics dashboard
- 🔒 Rate limiting and security middleware

## Tech Stack

- Node.js + TypeScript
- Express.js
- JWT for authentication
- Mock in-memory database (ready for real DB integration)
- Express Validator for input validation
- Helmet for security
- CORS enabled

## Getting Started

### Prerequisites

- Node.js >= 16
- npm or yarn

### Installation

```bash
cd jeb-dekho/backend
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
OTP_EXPIRE_MINUTES=5
```

### Running the Server

```bash
# Development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Production mode
npm start

# Seed mock data
npm run seed
```

The server will start on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication

All protected routes require Bearer token in Authorization header:
```
Authorization: Bearer <token>
```

### API Endpoints

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/send-otp` | Send OTP to phone | No |
| POST | `/auth/verify-otp` | Verify OTP | No |
| POST | `/auth/refresh-token` | Refresh access token | No |

#### User Profile

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get user profile | Yes |
| PUT | `/users/profile` | Update profile | Yes |
| DELETE | `/users/profile` | Delete account | Yes |
| GET | `/users/addresses` | Get addresses | Yes |
| POST | `/users/addresses` | Add address | Yes |
| PUT | `/users/addresses/:id` | Update address | Yes |
| DELETE | `/users/addresses/:id` | Delete address | Yes |

#### Transport Services

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/transport/estimate` | Get fare estimate | Yes |
| POST | `/transport/book` | Create booking | Yes |
| GET | `/transport/bookings/:id` | Get booking details | Yes |
| PUT | `/transport/bookings/:id/cancel` | Cancel booking | Yes |
| GET | `/transport/bookings/:id/track` | Track booking | Yes |
| GET | `/transport/drivers/nearby` | Get nearby drivers | Yes |

#### Food Services

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/food/restaurants` | List restaurants | No |
| GET | `/food/restaurants/:id` | Restaurant details | No |
| GET | `/food/restaurants/:id/menu` | Get menu | No |
| POST | `/food/orders` | Create order | Yes |
| GET | `/food/orders/:id` | Get order details | Yes |
| GET | `/food/orders` | Order history | Yes |
| PUT | `/food/orders/:id/status` | Update order status | Yes (Vendor/Driver) |

#### Mart Services

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/mart/stores` | List stores | No |
| GET | `/mart/stores/:id/products` | Get products | No |
| POST | `/mart/cart` | Add to cart | Yes |
| GET | `/mart/cart` | Get cart | Yes |
| PUT | `/mart/cart/:itemId` | Update cart item | Yes |
| DELETE | `/mart/cart/:itemId` | Remove from cart | Yes |
| POST | `/mart/checkout` | Checkout | Yes |

#### Payment Services

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/payments/wallet` | Get wallet balance | Yes |
| POST | `/payments/wallet/add` | Add money to wallet | Yes |
| GET | `/payments/transactions` | Transaction history | Yes |
| POST | `/payments/initiate` | Initiate payment | Yes |
| POST | `/payments/confirm` | Confirm payment | Yes |

#### Reviews & Ratings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/reviews/vendor/:vendorId` | Get vendor reviews | No |
| POST | `/reviews` | Create review | Yes |
| PUT | `/reviews/:id` | Update review | Yes |
| DELETE | `/reviews/:id` | Delete review | Yes |

#### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get notifications | Yes |
| PUT | `/notifications/:id/read` | Mark as read | Yes |
| PUT | `/notifications/read-all` | Mark all as read | Yes |
| DELETE | `/notifications/:id` | Delete notification | Yes |

#### Admin APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/dashboard` | Dashboard stats | Yes (Admin) |
| GET | `/admin/users` | List all users | Yes (Admin) |
| PUT | `/admin/users/:id/status` | Update user status | Yes (Admin) |
| GET | `/admin/orders` | All orders | Yes (Admin) |
| GET | `/admin/revenue` | Revenue analytics | Yes (Admin) |

#### Vendor APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/vendor/dashboard` | Vendor dashboard | Yes (Vendor) |
| GET | `/vendor/orders` | Vendor orders | Yes (Vendor) |
| PUT | `/vendor/menu/:id` | Update menu item | Yes (Vendor) |
| PUT | `/vendor/products/:id` | Update product | Yes (Vendor) |
| PUT | `/vendor/availability` | Toggle availability | Yes (Vendor) |

## Request/Response Examples

### Register User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "9876543210",
  "role": "CUSTOMER",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "user_123456",
      "email": "john@example.com",
      "role": "CUSTOMER",
      "status": "PENDING_VERIFICATION"
    },
    "token": "jwt.token.here",
    "message": "OTP sent to 9876543210"
  }
}
```

### Create Food Order
```bash
POST /api/v1/food/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendorId": "vendor1",
  "items": [
    {
      "id": "menu1",
      "quantity": 2,
      "customizations": []
    }
  ],
  "deliveryAddress": {
    "line1": "123 Main St",
    "city": "Mumbai",
    "pincode": "400001"
  },
  "paymentMethod": "UPI",
  "specialInstructions": "Extra spicy please"
}

Response:
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": "order_123456",
    "orderNumber": "FOOD123456",
    "status": "PENDING",
    "totalAmount": 598,
    "finalAmount": 668,
    "estimatedDeliveryTime": "2024-01-15T10:45:00Z"
  }
}
```

### Get Transport Estimate
```bash
POST /api/v1/transport/estimate
Authorization: Bearer <token>
Content-Type: application/json

{
  "pickupLat": 19.0760,
  "pickupLng": 72.8777,
  "dropLat": 19.1136,
  "dropLng": 72.8697
}

Response:
{
  "success": true,
  "message": "Fare estimate calculated",
  "data": [
    {
      "vehicleType": "BIKE",
      "fare": 85,
      "estimatedTime": 15,
      "distance": 5.2
    },
    {
      "vehicleType": "AUTO",
      "fare": 120,
      "estimatedTime": 18,
      "distance": 5.2
    }
  ]
}
```

## Frontend Integration

### Using the API Client

```typescript
import { AuthService, FoodService } from '@jeb-dekho/api-client';

// Initialize services
const authService = new AuthService();
const foodService = new FoodService();

// Login
const loginResponse = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Get restaurants
const restaurants = await foodService.getRestaurants({
  page: 1,
  limit: 10,
  search: 'pizza'
});

// Create order
const order = await foodService.createOrder({
  vendorId: 'vendor1',
  items: [{ id: 'menu1', quantity: 2 }],
  deliveryAddress: address,
  paymentMethod: 'UPI'
});
```

### React Example

```tsx
import { useEffect, useState } from 'react';
import { FoodService } from '@jeb-dekho/api-client';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const foodService = new FoodService();

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const response = await foodService.getRestaurants();
        setRestaurants(response.data.items);
      } catch (error) {
        console.error('Failed to load restaurants:', error);
      }
    }
    loadRestaurants();
  }, []);

  return (
    <div>
      {restaurants.map(restaurant => (
        <div key={restaurant.id}>{restaurant.name}</div>
      ))}
    </div>
  );
}
```

### Flutter Example

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  final String baseUrl = 'http://localhost:5000/api/v1';
  String? token;

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      token = data['data']['token'];
      return data;
    } else {
      throw Exception('Failed to login');
    }
  }

  Future<List<dynamic>> getRestaurants() async {
    final response = await http.get(
      Uri.parse('$baseUrl/food/restaurants'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['data']['items'];
    } else {
      throw Exception('Failed to load restaurants');
    }
  }
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Validation failed",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  }
}
```

Common error codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation on all endpoints
- Rate limiting on auth endpoints
- CORS configuration
- Helmet.js for security headers
- SQL injection prevention (when connected to real DB)

## Mock Data

The backend uses an in-memory mock database with pre-seeded data:

- Sample users (customers, vendors, drivers)
- Sample restaurants and menu items
- Sample products for mart
- Sample orders and transactions

Default test credentials:
- Customer: `john@example.com` / `password123`
- Vendor: `pizzapalace@example.com` / `password123`
- Driver: `ravi@example.com` / `password123`

## Production Considerations

Before deploying to production:

1. Replace mock database with real database (PostgreSQL/MongoDB)
2. Implement proper OTP service (Twilio/AWS SNS)
3. Add payment gateway integration (Razorpay/Stripe)
4. Set up Redis for caching and sessions
5. Configure proper logging (Winston/Morgan)
6. Set up monitoring (New Relic/Datadog)
7. Implement WebSocket for real-time updates
8. Add file upload for images (AWS S3/Cloudinary)
9. Set up CI/CD pipeline
10. Configure proper environment variables

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary and confidential.