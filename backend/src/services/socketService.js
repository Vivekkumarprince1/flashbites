const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;
const userSockets = new Map(); // Map userId to socket IDs
const restaurantSockets = new Map(); // Map restaurantId to socket IDs
const adminSockets = new Set(); // Set of admin socket IDs

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'https://flashbites.vercel.app',
        'https://flashbites.shop',
        'https://www.flashbites.shop',
        process.env.FRONTEND_URL
      ],
      credentials: true,
      methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling']
  });

  // Authentication middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id} | User: ${socket.userId} | Role: ${socket.userRole}`);

    // Register socket based on user role
    if (socket.userRole === 'admin') {
      adminSockets.add(socket.id);
      console.log(`👑 Admin connected: ${socket.userId}`);
    } else if (socket.userRole === 'restaurant_owner') {
      // Restaurant owner will join their restaurant room
      socket.on('join-restaurant', (restaurantId) => {
        if (!restaurantSockets.has(restaurantId)) {
          restaurantSockets.set(restaurantId, new Set());
        }
        restaurantSockets.get(restaurantId).add(socket.id);
        socket.join(`restaurant-${restaurantId}`);
        console.log(`🏪 Restaurant owner joined: ${restaurantId}`);
      });
    } else {
      // Regular user
      userSockets.set(socket.userId, socket.id);
      socket.join(`user-${socket.userId}`);
      console.log(`👤 User joined: ${socket.userId}`);
    }

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
      
      // Clean up
      if (socket.userRole === 'admin') {
        adminSockets.delete(socket.id);
      } else if (socket.userRole === 'restaurant_owner') {
        restaurantSockets.forEach((sockets, restaurantId) => {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            restaurantSockets.delete(restaurantId);
          }
        });
      } else {
        userSockets.delete(socket.userId);
      }
    });

    // Ping-pong for connection health
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  console.log('✅ Socket.IO initialized');
  return io;
};

// Emit new order notification to restaurant
const notifyRestaurantNewOrder = (restaurantId, orderData) => {
  if (io) {
    io.to(`restaurant-${restaurantId}`).emit('new-order', {
      type: 'NEW_ORDER',
      order: orderData,
      sound: true,
      timestamp: new Date().toISOString()
    });
    console.log(`📢 Notified restaurant ${restaurantId} of new order ${orderData._id}`);
  }
};

// Emit order status update to user
const notifyUserOrderUpdate = (userId, orderData) => {
  if (io) {
    io.to(`user-${userId}`).emit('order-update', {
      type: 'ORDER_UPDATE',
      order: orderData,
      sound: true,
      timestamp: new Date().toISOString()
    });
    console.log(`📢 Notified user ${userId} of order update ${orderData._id}`);
  }
};

// Emit new order notification to all admins
const notifyAdminNewOrder = (orderData) => {
  if (io) {
    adminSockets.forEach((socketId) => {
      io.to(socketId).emit('new-order', {
        type: 'NEW_ORDER',
        order: orderData,
        sound: true,
        timestamp: new Date().toISOString()
      });
    });
    console.log(`📢 Notified ${adminSockets.size} admins of new order ${orderData._id}`);
  }
};

// Emit delivery status update
const notifyDeliveryUpdate = (orderId, deliveryData) => {
  if (io) {
    io.to(`order-${orderId}`).emit('delivery-update', {
      type: 'DELIVERY_UPDATE',
      delivery: deliveryData,
      sound: true,
      timestamp: new Date().toISOString()
    });
  }
};

// Get online statistics
const getOnlineStats = () => {
  return {
    users: userSockets.size,
    restaurants: restaurantSockets.size,
    admins: adminSockets.size,
    total: io ? io.sockets.sockets.size : 0
  };
};

module.exports = {
  initializeSocket,
  notifyRestaurantNewOrder,
  notifyUserOrderUpdate,
  notifyAdminNewOrder,
  notifyDeliveryUpdate,
  getOnlineStats
};
