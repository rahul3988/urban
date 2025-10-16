# Jeb Dekho Vendor Panel

A comprehensive React + TypeScript web application for vendors to manage their business operations, orders, menu, and analytics in the Jeb Dekho ecosystem.

## Features

### Authentication & Onboarding
- **Login Screen** (`/login`) - Vendor authentication
- **Business Setup** - Business registration and verification
- **Document Upload** - License and certification management

### Dashboard & Analytics
- **Dashboard** (`/dashboard`) - Business overview and key metrics
- **Analytics** (`/analytics`) - Sales reports, payouts, and commissions
- **Performance Metrics** - Order trends, customer ratings, revenue analysis

### Order Management
- **Orders** (`/orders`) - Order listing and management
- **Order Details** - Detailed order information and status updates
- **Order History** - Historical order data and analytics
- **Real-time Updates** - Live order status notifications

### Menu & Product Management
- **Menu** (`/menu`) - Comprehensive menu management
- **Product CRUD** - Add, edit, delete products
- **Category Management** - Organize products by categories
- **Inventory Tracking** - Stock management and alerts
- **Pricing Management** - Dynamic pricing and discounts

### Customer Management
- **Customer Reviews** - Review display and response system
- **Customer Analytics** - Customer behavior and preferences
- **Loyalty Programs** - Customer retention tools

### Promotions & Marketing
- **Offers Management** - Create and manage promotional offers
- **Discount Codes** - Generate and track discount codes
- **Marketing Campaigns** - Targeted marketing tools

### Settings & Configuration
- **Settings** (`/settings`) - Business settings and preferences
- **Profile Management** - Business information and contact details
- **Payment Settings** - Payment methods and payout preferences
- **Notification Settings** - Communication preferences

## Navigation Structure

```
/ (root)
├── /login
├── /dashboard
├── /orders
├── /menu
├── /analytics
└── /settings
```

## Key Screens

### Dashboard Screen
- **Today's Revenue** - Daily earnings summary
- **Total Orders** - Order count and completion rate
- **Average Rating** - Customer satisfaction metrics
- **Recent Orders** - Latest order activity
- **Quick Actions** - Common tasks and shortcuts

### Orders Screen
- **Order List** - Filterable and searchable order list
- **Order Status** - Accept, prepare, ready, completed
- **Order Details** - Customer info, items, special instructions
- **Order Actions** - Update status, add notes, contact customer

### Menu Screen
- **Product Categories** - Organized product sections
- **Product Management** - Add/edit/delete products
- **Image Upload** - Product photos and galleries
- **Availability Toggle** - Enable/disable products
- **Bulk Operations** - Mass update prices and availability

### Analytics Screen
- **Sales Reports** - Revenue trends and analysis
- **Order Analytics** - Order patterns and insights
- **Customer Analytics** - Customer behavior and preferences
- **Commission Tracking** - Platform fees and payouts
- **Performance Metrics** - Key business indicators

### Settings Screen
- **Business Information** - Company details and contact info
- **Service Settings** - Delivery radius, timings, fees
- **Payment Settings** - Payout methods and schedules
- **Notification Preferences** - Email and SMS settings
- **Account Security** - Password and security settings

## Brand Colors

### Food Services Theme
- Primary: `#92400E` (Brown)
- Secondary: `#84CC16` (Lime)
- Accent: `#FEF3C7` (Light Yellow)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)

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

## Getting Started

### Prerequisites
- Node.js (16+)
- npm or yarn
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rahul3988/urban.git
cd urban/jeb-dekho/vendor-panel
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
REACT_APP_MAPS_API_KEY=your_google_maps_key
```

5. Start development server:
```bash
npm start
# or
yarn start
```

## API Integration

### Key API Endpoints
- `POST /auth/login` - Vendor login
- `GET /dashboard/stats` - Dashboard metrics
- `GET /orders` - Get orders list
- `GET /orders/{id}` - Get order details
- `PUT /orders/{id}/status` - Update order status
- `GET /menu` - Get menu items
- `POST /menu` - Add menu item
- `PUT /menu/{id}` - Update menu item
- `DELETE /menu/{id}` - Delete menu item
- `GET /analytics/sales` - Sales analytics
- `GET /analytics/orders` - Order analytics
- `WebSocket /ws` - Real-time updates

### WebSocket Events
- `order_created` - New order received
- `order_updated` - Order status changed
- `order_cancelled` - Order cancelled
- `payment_received` - Payment confirmation

## Real-time Features

### Live Order Updates
- Real-time order notifications
- Instant status updates
- Live order tracking

### Inventory Management
- Real-time stock updates
- Low stock alerts
- Automatic availability toggles

### Customer Communication
- Live chat integration
- Order status notifications
- Customer feedback system

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
docker build -t vendor-panel .
docker run -p 3000:3000 vendor-panel
```

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

## Security Features

### Authentication
- JWT token-based authentication
- Role-based access control
- Session management

### Data Protection
- HTTPS communication
- Input validation
- XSS protection

### Privacy
- GDPR compliance
- Data anonymization
- User consent management

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
- Email: vendors@jebdekho.com
- Documentation: https://docs.jebdekho.com/vendors
- Issues: https://github.com/rahul3988/urban/issues