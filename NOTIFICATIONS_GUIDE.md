# Real-Time Sound Notifications

## Overview
FlashBites now features real-time sound and browser notifications for restaurant owners, users, and admins. Get instant alerts when new orders are placed or order status changes.

## Features

### 🔔 For Restaurant Owners
- **Real-time new order alerts** with sound notification
- **Instant notifications** when customers place orders
- **Browser notifications** even when tab is inactive
- **Customizable sound settings**

### 📦 For Users
- **Order status updates** with sound alerts
- Get notified when:
  - Order is confirmed
  - Restaurant is preparing your food
  - Order is ready
  - Order is out for delivery
  - Order is delivered

### 👑 For Admins
- **Monitor all orders** across the platform
- Receive alerts for every new order
- Track platform activity in real-time

## Technology Stack

### Backend
- **Socket.IO** - Real-time bidirectional communication
- **JWT Authentication** - Secure WebSocket connections
- **Event-based architecture** - Scalable notification system

### Frontend
- **Socket.IO Client** - WebSocket client library
- **Web Audio API** - Synthesized notification sounds
- **Browser Notification API** - Native OS notifications
- **React Hooks** - State management for notifications

## How It Works

1. **Connection**: When users log in, a WebSocket connection is established
2. **Authentication**: JWT token validates the connection
3. **Room Assignment**: Users join specific rooms based on their role
4. **Event Emission**: Server emits events when orders are created/updated
5. **Sound Playback**: Client plays notification sound using Web Audio API
6. **Browser Notification**: Native OS notification appears

## Notification Types

### New Order (`new-order`)
```javascript
{
  type: 'NEW_ORDER',
  order: { /* order details */ },
  sound: true,
  timestamp: '2026-01-12T15:00:00.000Z'
}
```

### Order Update (`order-update`)
```javascript
{
  type: 'ORDER_UPDATE',
  order: { /* order details */ },
  sound: true,
  timestamp: '2026-01-12T15:00:00.000Z'
}
```

### Delivery Update (`delivery-update`)
```javascript
{
  type: 'DELIVERY_UPDATE',
  delivery: { /* delivery details */ },
  sound: true,
  timestamp: '2026-01-12T15:00:00.000Z'
}
```

## Usage

### Backend Integration

```javascript
const { notifyRestaurantNewOrder } = require('./services/socketService');

// Notify restaurant of new order
notifyRestaurantNewOrder(restaurantId, orderData);
```

### Frontend Integration

```javascript
import { useNotifications } from './hooks/useNotifications';

function MyComponent() {
  const { connected, soundEnabled, toggleSound } = useNotifications();
  
  return (
    <div>
      <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={toggleSound}>
        {soundEnabled ? 'Mute' : 'Unmute'}
      </button>
    </div>
  );
}
```

## Sound Settings

Users can control notification sounds through:
1. **Notification Bell Icon** - Quick toggle in navbar
2. **Settings Page** - Detailed notification preferences
3. **LocalStorage** - Settings persist across sessions

## Browser Compatibility

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

## Security

- WebSocket connections are authenticated using JWT
- Only authorized users can connect and receive notifications
- Role-based access control for different notification types
- CORS configured for allowed origins only

## Performance

- Lightweight synthesized sounds (no audio files)
- Efficient event-based architecture
- Automatic reconnection on connection loss
- Ping-pong heartbeat for connection health

## Configuration

### Backend Environment Variables
```env
# No additional configuration needed
# Uses existing JWT_SECRET and FRONTEND_URL
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000
```

## Testing

### Test Real-time Notifications

1. Open FlashBites in two browser windows
2. Login as restaurant owner in window 1
3. Place an order as user in window 2
4. Observe notification in window 1 with sound

### Test Sound Settings

1. Click notification bell icon
2. Toggle sound on/off
3. Place a test order
4. Verify sound plays or doesn't play based on setting

## Troubleshooting

### No Sound Playing
- Click anywhere on page to initialize audio context
- Check browser sound settings
- Verify sound toggle is enabled

### Not Receiving Notifications
- Check connection status (green dot = connected)
- Verify JWT token is valid
- Check browser console for errors
- Ensure WebSocket port is not blocked

### Browser Notifications Not Working
- Check notification permission in browser settings
- Click "Enable Notifications" button
- Some browsers block notifications in incognito mode

## Future Enhancements

- [ ] Custom sound uploads
- [ ] Notification history
- [ ] Do Not Disturb mode
- [ ] Email notifications
- [ ] SMS notifications (Twilio)
- [ ] Push notifications (PWA)
- [ ] Notification preferences per order status

## Support

For issues or questions:
- Check browser console for errors
- Verify WebSocket connection status
- Contact support@flashbites.shop
