# Jeb Dekho Admin Panel

A comprehensive React + TypeScript web application for administrators to manage the entire Jeb Dekho ecosystem, including users, vendors, drivers, orders, and system configuration.

## Features

### Authentication & Access Control
- **Login Screen** (`/login`) - Admin authentication
- **Role-based Access** - Different permission levels
- **Session Management** - Secure session handling

### Dashboard & Analytics
- **Dashboard** (`/dashboard`) - System overview and key metrics
- **Analytics** (`/analytics`) - Comprehensive analytics and reporting
- **Real-time Metrics** - Live system statistics
- **Performance Monitoring** - System health and performance

### User Management
- **User Management** (`/users`) - User accounts and profiles
- **User Analytics** - User behavior and engagement
- **Account Management** - User verification and status
- **Bulk Operations** - Mass user operations

### Vendor Management
- **Vendor Management** (`/vendors`) - Vendor accounts and businesses
- **Business Verification** - Document verification and approval
- **Commission Management** - Commission rates and payouts
- **Performance Tracking** - Vendor metrics and ratings

### Driver Management
- **Driver Management** (`/drivers`) - Driver accounts and vehicles
- **Document Verification** - License and vehicle document checks
- **Performance Monitoring** - Driver ratings and completion rates
- **Location Tracking** - Real-time driver locations

### Support System
- **Support Tickets** (`/support`) - Customer support management
- **Ticket Assignment** - Assign tickets to support agents
- **Response Management** - Track and manage responses
- **Knowledge Base** - FAQ and help documentation

### Financial Management
- **Financial Reports** (`/financial`) - Revenue and financial analytics
- **Commission Tracking** - Platform commission management
- **Payout Management** - Vendor and driver payouts
- **Payment Analytics** - Payment method analysis

### System Configuration
- **System Configuration** (`/configuration`) - Platform settings
- **Service Management** - Enable/disable services
- **Payment Gateway** - Payment method configuration
- **Notification Settings** - Email and SMS configuration

### Audit & Security
- **Audit Logs** (`/audit-logs`) - System activity tracking
- **Security Monitoring** - Security events and alerts
- **Access Logs** - User access tracking
- **Compliance Reports** - Regulatory compliance

## Navigation Structure

```
/ (root)
├── /login
├── /dashboard
├── /analytics
├── /users
├── /vendors
├── /drivers
├── /support
├── /financial
├── /configuration
└── /audit-logs
```

## Key Screens

### Dashboard Screen
- **System Overview** - Total users, vendors, drivers, orders
- **Revenue Metrics** - Total revenue, commission, payouts
- **Today's Activity** - Daily statistics and trends
- **Recent Activity** - Latest system events
- **Quick Actions** - Common administrative tasks

### User Management Screen
- **User List** - Searchable and filterable user list
- **User Details** - Profile information and activity
- **Account Status** - Active, suspended, verified status
- **Bulk Operations** - Mass user management
- **User Analytics** - User behavior and engagement

### Vendor Management Screen
- **Vendor List** - Business listings and status
- **Business Verification** - Document verification workflow
- **Commission Settings** - Service-wise commission rates
- **Performance Metrics** - Vendor ratings and metrics
- **Payout Management** - Payment schedules and history

### Driver Management Screen
- **Driver List** - Driver profiles and status
- **Document Verification** - License and vehicle checks
- **Performance Tracking** - Ratings and completion rates
- **Location Monitoring** - Real-time driver locations
- **Earnings Management** - Driver payment tracking

### Support Tickets Screen
- **Ticket Queue** - Open and assigned tickets
- **Ticket Details** - Customer communication history
- **Assignment System** - Assign tickets to agents
- **Response Tracking** - Response times and quality
- **Knowledge Base** - FAQ and documentation

### Financial Reports Screen
- **Revenue Analytics** - Revenue trends and analysis
- **Commission Tracking** - Platform commission data
- **Payout Management** - Vendor and driver payments
- **Payment Analytics** - Payment method breakdown
- **Financial Forecasting** - Revenue predictions

### System Configuration Screen
- **General Settings** - App name, version, maintenance mode
- **Service Configuration** - Enable/disable services
- **Payment Gateway** - Payment method settings
- **Notification Settings** - Email and SMS configuration
- **Security Settings** - Authentication and security

### Audit Logs Screen
- **Activity Logs** - System activity tracking
- **User Actions** - User activity monitoring
- **Security Events** - Security-related events
- **System Events** - System-level activities
- **Compliance Reports** - Regulatory compliance

## Brand Colors

### Admin Theme
- Primary: `#1F2937` (Dark Gray)
- Secondary: `#3B82F6` (Blue)
- Accent: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)
- Success: `#059669` (Emerald)

## Technical Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context/Redux
- **HTTP Client**: Axios
- **UI Components**: Headless UI
- **Charts**: Chart.js/Recharts
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Tables**: React Table
- **Date Picker**: React DatePicker

## Getting Started

### Prerequisites
- Node.js (16+)
- npm or yarn
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rahul3988/urban.git
cd urban/jeb-dekho/admin-panel
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables:
```env
REACT_APP_API_URL=https://api.jebdekho.com
REACT_APP_WS_URL=wss://ws.jebdekho.com
REACT_APP_ADMIN_API_URL=https://admin-api.jebdekho.com
```

5. Start development server:
```bash
npm start
# or
yarn start
```

## API Integration

### Key API Endpoints
- `POST /auth/login` - Admin login
- `GET /dashboard/stats` - Dashboard metrics
- `GET /users` - Get users list
- `GET /vendors` - Get vendors list
- `GET /drivers` - Get drivers list
- `GET /support/tickets` - Get support tickets
- `GET /financial/reports` - Get financial data
- `GET /system/config` - Get system configuration
- `GET /audit/logs` - Get audit logs
- `WebSocket /ws` - Real-time updates

### WebSocket Events
- `user_registered` - New user registration
- `vendor_registered` - New vendor registration
- `driver_registered` - New driver registration
- `order_created` - New order created
- `payment_received` - Payment received
- `support_ticket_created` - New support ticket

## Real-time Features

### Live Dashboard
- Real-time system metrics
- Live user activity
- Instant notifications

### Monitoring
- System health monitoring
- Performance metrics
- Error tracking

### Alerts
- Critical system alerts
- Security notifications
- Performance warnings

## Testing

### Unit Tests
```bash
npm test
# or
yarn test
```

### Integration Tests
```bash
npm run test:integration
# or
yarn test:integration
```

### E2E Tests
```bash
npm run test:e2e
# or
yarn test:e2e
```

## Build & Deployment

### Development Build
```bash
npm run build:dev
# or
yarn build:dev
```

### Production Build
```bash
npm run build
# or
yarn build
```

### Docker Deployment
```bash
docker build -t admin-panel .
docker run -p 3000:3000 admin-panel
```

## Security Features

### Authentication
- Multi-factor authentication
- Role-based access control
- Session management
- Password policies

### Data Protection
- HTTPS communication
- Input validation
- XSS protection
- CSRF protection

### Audit Trail
- Complete activity logging
- User action tracking
- System event monitoring
- Compliance reporting

## Performance Optimization

### Code Splitting
- Route-based code splitting
- Lazy loading of components
- Dynamic imports

### Caching
- API response caching
- Static asset caching
- Browser cache optimization

### Bundle Optimization
- Tree shaking
- Minification
- Compression

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Mobile Responsiveness

- Responsive design for tablets
- Touch-friendly interface
- Mobile-optimized workflows

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check API URL configuration
   - Verify network connectivity
   - Check CORS settings

2. **Authentication Problems**
   - Clear browser cache
   - Check token expiration
   - Verify credentials

3. **Real-time Updates Not Working**
   - Check WebSocket connection
   - Verify firewall settings
   - Test on different networks

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
- Email: admin@jebdekho.com
- Documentation: https://docs.jebdekho.com/admin
- Issues: https://github.com/rahul3988/urban/issues