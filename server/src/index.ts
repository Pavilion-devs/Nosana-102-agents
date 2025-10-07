import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { router } from './server/routes';
import { WebSocketManager } from './server/websocket';
import { seedDevices } from './simulator/seed-devices';
import { WSMessageType } from './shared';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket
const wsManager = new WebSocketManager(server);

// Broadcast telemetry updates every 5 seconds
setInterval(async () => {
  // This would be triggered by actual device updates in production
  wsManager.broadcast({
    type: WSMessageType.TELEMETRY,
    payload: { message: 'Telemetry update' },
    timestamp: new Date().toISOString(),
  });
}, 5000);

// Initialize demo devices
async function initialize() {
  try {
    await seedDevices();
    console.log('✅ Demo devices initialized');
  } catch (error) {
    console.error('❌ Error initializing devices:', error);
  }
}

// Start server
server.listen(PORT, async () => {
  console.log(`
🚀 NEXUS IoT Server is running!

   HTTP API: http://localhost:${PORT}/api
   WebSocket: ws://localhost:${PORT}/ws
   Health: http://localhost:${PORT}/api/health

   📡 Initializing IoT devices...
  `);

  await initialize();

  console.log(`
   ✨ Server ready! Connected clients: ${wsManager.getClientCount()}
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
