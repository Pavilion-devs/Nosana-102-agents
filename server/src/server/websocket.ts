import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { WSMessage, WSMessageType } from '../shared';

/**
 * WebSocket manager for real-time updates
 */
export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket client connected');
      this.clients.add(ws);

      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          this.sendError(ws, 'Invalid message format');
        }
      });

      ws.on('close', () => {
        console.log('WebSocket client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Send welcome message
      this.send(ws, {
        type: WSMessageType.DEVICE_UPDATE,
        payload: { message: 'Connected to NEXUS IoT server' },
        timestamp: new Date().toISOString(),
      });
    });

    console.log('WebSocket server initialized on /ws');
  }

  private handleMessage(ws: WebSocket, message: any): void {
    console.log('Received message:', message);
    // Handle incoming messages from clients if needed
  }

  /**
   * Send message to a specific client
   */
  send(client: WebSocket, message: WSMessage): void {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  /**
   * Broadcast message to all connected clients
   */
  broadcast(message: WSMessage): void {
    const payload = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  /**
   * Send error message to a client
   */
  private sendError(client: WebSocket, error: string): void {
    this.send(client, {
      type: WSMessageType.ERROR,
      payload: { error },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get number of connected clients
   */
  getClientCount(): number {
    return this.clients.size;
  }

  /**
   * Close all connections
   */
  close(): void {
    this.clients.forEach((client) => client.close());
    this.wss.close();
  }
}
