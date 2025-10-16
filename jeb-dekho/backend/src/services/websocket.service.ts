import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { UserRole } from '@jeb-dekho/common';

interface SocketUser {
  id: string;
  email: string;
  role: UserRole;
}

export class WebSocketService {
  private io: SocketServer;
  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds[]

  constructor(server: Server) {
    this.io = new SocketServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication failed'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as SocketUser;
        socket.data.user = decoded;
        next();
      } catch (err) {
        next(new Error('Authentication failed'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      const user = socket.data.user as SocketUser;
      console.log(`User ${user.email} connected`);

      // Track user socket
      this.addUserSocket(user.id, socket.id);

      // Join role-based rooms
      socket.join(`role:${user.role}`);
      socket.join(`user:${user.id}`);

      // Handle events based on role
      switch (user.role) {
        case UserRole.CUSTOMER:
          this.handleCustomerEvents(socket);
          break;
        case UserRole.DELIVERY_PARTNER:
          this.handleDriverEvents(socket);
          break;
        case UserRole.VENDOR:
          this.handleVendorEvents(socket);
          break;
        case UserRole.ADMIN:
          this.handleAdminEvents(socket);
          break;
      }

      // Common events
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: new Date() });
      });

      socket.on('disconnect', () => {
        console.log(`User ${user.email} disconnected`);
        this.removeUserSocket(user.id, socket.id);
      });
    });
  }

  private handleCustomerEvents(socket: any) {
    // Track order
    socket.on('track:order', (orderId: string) => {
      socket.join(`order:${orderId}`);
      socket.emit('tracking:started', { orderId });
    });

    // Stop tracking
    socket.on('untrack:order', (orderId: string) => {
      socket.leave(`order:${orderId}`);
    });

    // Track ride
    socket.on('track:ride', (bookingId: string) => {
      socket.join(`booking:${bookingId}`);
      socket.emit('tracking:started', { bookingId });
    });
  }

  private handleDriverEvents(socket: any) {
    const driverId = socket.data.user.id;

    // Update location
    socket.on('location:update', (data: { lat: number; lng: number; bookingId?: string }) => {
      // Broadcast to customers tracking this driver
      if (data.bookingId) {
        this.io.to(`booking:${data.bookingId}`).emit('driver:location', {
          driverId,
          location: { latitude: data.lat, longitude: data.lng },
          timestamp: new Date()
        });
      }

      // Update driver's current location in system
      this.io.to(`driver:${driverId}`).emit('location:updated', data);
    });

    // Accept order
    socket.on('order:accept', (orderId: string) => {
      this.io.to(`order:${orderId}`).emit('order:accepted', {
        orderId,
        driverId,
        timestamp: new Date()
      });
    });

    // Update order status
    socket.on('order:status', (data: { orderId: string; status: string }) => {
      this.io.to(`order:${data.orderId}`).emit('order:status:changed', {
        ...data,
        timestamp: new Date()
      });
    });
  }

  private handleVendorEvents(socket: any) {
    const vendorId = socket.data.user.id;

    // Join vendor room
    socket.join(`vendor:${vendorId}`);

    // Update order status
    socket.on('order:update', (data: { orderId: string; status: string }) => {
      this.io.to(`order:${data.orderId}`).emit('order:status:changed', {
        ...data,
        vendorId,
        timestamp: new Date()
      });
    });

    // Toggle availability
    socket.on('availability:toggle', (isAvailable: boolean) => {
      this.io.to(`vendor:${vendorId}`).emit('availability:changed', {
        vendorId,
        isAvailable,
        timestamp: new Date()
      });
    });
  }

  private handleAdminEvents(socket: any) {
    // Join admin room for system-wide updates
    socket.join('admin:all');

    // Request analytics update
    socket.on('analytics:refresh', () => {
      socket.emit('analytics:data', {
        // This would fetch real analytics data
        timestamp: new Date()
      });
    });
  }

  // Helper methods
  private addUserSocket(userId: string, socketId: string) {
    const sockets = this.userSockets.get(userId) || [];
    sockets.push(socketId);
    this.userSockets.set(userId, sockets);
  }

  private removeUserSocket(userId: string, socketId: string) {
    const sockets = this.userSockets.get(userId) || [];
    const index = sockets.indexOf(socketId);
    if (index > -1) {
      sockets.splice(index, 1);
    }
    if (sockets.length === 0) {
      this.userSockets.delete(userId);
    } else {
      this.userSockets.set(userId, sockets);
    }
  }

  // Public methods for emitting events from other parts of the application
  public notifyUser(userId: string, event: string, data: any) {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  public notifyOrder(orderId: string, event: string, data: any) {
    this.io.to(`order:${orderId}`).emit(event, data);
  }

  public notifyBooking(bookingId: string, event: string, data: any) {
    this.io.to(`booking:${bookingId}`).emit(event, data);
  }

  public notifyVendor(vendorId: string, event: string, data: any) {
    this.io.to(`vendor:${vendorId}`).emit(event, data);
  }

  public notifyRole(role: UserRole, event: string, data: any) {
    this.io.to(`role:${role}`).emit(event, data);
  }

  public broadcastToAdmins(event: string, data: any) {
    this.io.to('admin:all').emit(event, data);
  }
}

// Singleton instance
let wsService: WebSocketService;

export const initWebSocket = (server: Server): WebSocketService => {
  if (!wsService) {
    wsService = new WebSocketService(server);
  }
  return wsService;
};

export const getWebSocketService = (): WebSocketService => {
  if (!wsService) {
    throw new Error('WebSocket service not initialized');
  }
  return wsService;
};