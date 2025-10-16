# Jeb Dekho - Multi-Service Platform Monorepo

Welcome to Jeb Dekho, a comprehensive multi-service platform that connects users with various services including transport, food delivery, and mart services.

## Project Structure

This monorepo contains the following applications:

- **user-app**: Flutter mobile application for end users
- **delivery-partner-app**: Flutter mobile application for delivery partners
- **vendor-panel**: React + TypeScript web application for vendors
- **admin-panel**: React + TypeScript web application for administrators
- **common**: Shared libraries, types, and utilities

## Getting Started

Each application has its own README with specific setup instructions. Navigate to the respective folders to get started with individual apps.

## Brand Colors

### Transport Services
- Primary: #374151 (Gray)
- Secondary: #3B82F6 (Blue)
- Accent: #10B981 (Green)

### Food Services
- Primary: #92400E (Brown)
- Secondary: #84CC16 (Lime)
- Accent: #FEF3C7 (Light Yellow)

### Mart Services
- Primary: #0D9488 (Teal)
- Secondary: #F97316 (Orange)
- Accent: #F0FDF4 (Light Green)

## Backend API Integration

The monorepo now includes a complete backend API server with the following features:

### Backend Features
- 🔐 JWT-based authentication with OTP verification
- 👥 Multi-role support (Customer, Vendor, Delivery Partner, Admin)  
- 🚗 Transport booking with fare estimation and tracking
- 🍕 Food ordering with restaurant browsing and order management
- 🛒 Mart/grocery shopping with cart functionality
- 💳 Payment integration (Wallet, Cards, UPI)
- ⭐ Ratings and reviews system
- 📱 Real-time notifications
- 📊 Admin analytics dashboard
- 🔒 Rate limiting and security middleware

### API Client Library

A TypeScript API client library (`@jeb-dekho/api-client`) is provided for easy integration with all frontend apps.

### Running the Backend

```bash
cd jeb-dekho/backend
npm install
npm run dev
```

The API server will run on `http://localhost:5000/api/v1`

### Quick Start

1. **Start Backend Server:**
   ```bash
   cd backend && npm install && npm run dev
   ```

2. **Install API Client in Frontend Apps:**
   ```bash
   # For React apps
   cd vendor-panel && npm install ../api-client
   
   # For Flutter apps, use the HTTP examples in backend README
   ```

3. **Use API Client:**
   ```typescript
   import { AuthService, FoodService } from '@jeb-dekho/api-client';
   
   const auth = new AuthService();
   await auth.login({ email: 'user@example.com', password: 'password' });
   ```

### Mock Data

The backend includes pre-seeded mock data with sample users, restaurants, products, and orders. Default credentials are available in the backend README.

## Full Project Structure

```
jeb-dekho/
├── user-app/              # Flutter mobile app for users
├── delivery-partner-app/  # Flutter mobile app for delivery partners
├── vendor-panel/          # React web app for vendors
├── admin-panel/           # React web app for administrators
├── common/                # Shared TypeScript types and utilities
├── backend/               # Node.js TypeScript API server
├── api-client/            # TypeScript API client library
└── PROJECT_SUMMARY.md     # Detailed project documentation
```

## License

This project is proprietary and confidential.