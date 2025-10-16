import { 
  Customer, 
  Vendor, 
  DeliveryPartner, 
  UserRole, 
  UserStatus,
  ServiceType,
  VehicleType,
  OrderStatus,
  PaymentStatus,
  PaymentMethod
} from '@jeb-dekho/common';

// Mock database - In production, this would be replaced with actual database
export class MockDatabase {
  private static instance: MockDatabase;
  
  users: Map<string, any> = new Map();
  orders: Map<string, any> = new Map();
  menuItems: Map<string, any> = new Map();
  products: Map<string, any> = new Map();
  addresses: Map<string, any> = new Map();
  reviews: Map<string, any> = new Map();
  notifications: Map<string, any> = new Map();
  otps: Map<string, { otp: string; expires: Date }> = new Map();

  private constructor() {
    this.seedData();
  }

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  private seedData() {
    // Seed users
    const customers = [
      {
        id: 'cust1',
        email: 'john@example.com',
        phone: '9876543210',
        password: '$2a$10$YourHashedPasswordHere', // password: password123
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        firstName: 'John',
        lastName: 'Doe',
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const vendors = [
      {
        id: 'vendor1',
        email: 'pizzapalace@example.com',
        phone: '9876543220',
        password: '$2a$10$YourHashedPasswordHere',
        role: UserRole.VENDOR,
        status: UserStatus.ACTIVE,
        businessName: 'Pizza Palace',
        businessType: ServiceType.FOOD,
        businessAddress: {
          id: 'addr1',
          line1: '123 Food Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        businessLicense: 'FSSAI123456',
        rating: 4.5,
        totalReviews: 125,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'vendor2',
        email: 'freshmart@example.com',
        phone: '9876543221',
        password: '$2a$10$YourHashedPasswordHere',
        role: UserRole.VENDOR,
        status: UserStatus.ACTIVE,
        businessName: 'Fresh Mart',
        businessType: ServiceType.MART,
        businessAddress: {
          id: 'addr2',
          line1: '456 Market Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400002'
        },
        businessLicense: 'MART123456',
        rating: 4.3,
        totalReviews: 89,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const deliveryPartners = [
      {
        id: 'driver1',
        email: 'ravi@example.com',
        phone: '9876543230',
        password: '$2a$10$YourHashedPasswordHere',
        role: UserRole.DELIVERY_PARTNER,
        status: UserStatus.ACTIVE,
        firstName: 'Ravi',
        lastName: 'Kumar',
        vehicleType: VehicleType.BIKE,
        vehicleNumber: 'MH01AB1234',
        drivingLicense: 'DL123456789',
        isOnline: true,
        currentLocation: { latitude: 19.0760, longitude: 72.8777 },
        rating: 4.7,
        totalDeliveries: 342,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Add users to database
    [...customers, ...vendors, ...deliveryPartners].forEach(user => {
      this.users.set(user.id, user);
    });

    // Seed menu items
    const menuItems = [
      {
        id: 'menu1',
        vendorId: 'vendor1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with mozzarella and basil',
        category: 'Pizza',
        price: 299,
        isVeg: true,
        isAvailable: true,
        preparationTime: 20,
        tags: ['pizza', 'italian', 'vegetarian']
      },
      {
        id: 'menu2',
        vendorId: 'vendor1',
        name: 'Chicken Tikka Pizza',
        description: 'Spicy chicken tikka with onions and peppers',
        category: 'Pizza',
        price: 399,
        isVeg: false,
        isAvailable: true,
        preparationTime: 25,
        tags: ['pizza', 'non-veg', 'spicy']
      }
    ];

    menuItems.forEach(item => {
      this.menuItems.set(item.id, item);
    });

    // Seed products
    const products = [
      {
        id: 'prod1',
        vendorId: 'vendor2',
        name: 'Fresh Milk',
        description: 'Farm fresh pasteurized milk',
        category: 'Dairy',
        price: 60,
        mrp: 65,
        unit: '1L',
        quantity: 100,
        isAvailable: true,
        tags: ['dairy', 'milk', 'fresh']
      },
      {
        id: 'prod2',
        vendorId: 'vendor2',
        name: 'Organic Tomatoes',
        description: 'Fresh organic tomatoes',
        category: 'Vegetables',
        price: 40,
        mrp: 50,
        unit: '1kg',
        quantity: 50,
        isAvailable: true,
        tags: ['vegetables', 'organic', 'fresh']
      }
    ];

    products.forEach(product => {
      this.products.set(product.id, product);
    });

    // Seed sample orders
    const orders = [
      {
        id: 'order1',
        orderNumber: 'ORD001',
        customerId: 'cust1',
        vendorId: 'vendor1',
        deliveryPartnerId: 'driver1',
        serviceType: ServiceType.FOOD,
        status: OrderStatus.DELIVERED,
        items: [
          {
            id: 'item1',
            menuItemId: 'menu1',
            name: 'Margherita Pizza',
            quantity: 2,
            price: 299
          }
        ],
        totalAmount: 598,
        deliveryFee: 40,
        taxes: 30,
        discount: 50,
        finalAmount: 618,
        paymentMethod: PaymentMethod.UPI,
        paymentStatus: PaymentStatus.SUCCESS,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(Date.now() - 82800000)
      }
    ];

    orders.forEach(order => {
      this.orders.set(order.id, order);
    });
  }

  // Helper methods for data access
  findUserByEmail(email: string): any {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  findUserByPhone(phone: string): any {
    return Array.from(this.users.values()).find(u => u.phone === phone);
  }

  getVendorMenuItems(vendorId: string): any[] {
    return Array.from(this.menuItems.values()).filter(item => item.vendorId === vendorId);
  }

  getVendorProducts(vendorId: string): any[] {
    return Array.from(this.products.values()).filter(product => product.vendorId === vendorId);
  }

  getUserOrders(userId: string): any[] {
    return Array.from(this.orders.values()).filter(order => 
      order.customerId === userId || 
      order.vendorId === userId || 
      order.deliveryPartnerId === userId
    );
  }
}