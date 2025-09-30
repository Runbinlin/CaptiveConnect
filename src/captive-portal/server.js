const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

/**
 * CaptiveConnect Portal Server
 * Handles HTTP and WebSocket connections for the captive portal
 */

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients and their information
const clients = new Map();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Redirect all HTTP requests to the captive portal page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const ip = req.connection.remoteAddress;
  console.log(`New client connected: ${ip}`);
  
  // Store client connection details
  clients.set(ip, {
    ws,
    connectedAt: new Date(),
    deviceInfo: null
  });
  
  // Send welcome message to the new client
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to CaptiveConnect'
  }));
  
  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'deviceInfo') {
        // Store device information
        clients.get(ip).deviceInfo = data.info;
        console.log(`Device info received from ${ip}:`, data.info);
        
        // Notify host application about new device
        broadcastToHost({
          type: 'newDevice',
          ip,
          info: data.info
        });
      }
    } catch (e) {
      console.error('Error processing message:', e);
    }
  });
  
  // Handle client disconnection
  ws.on('close', () => {
    console.log(`Client disconnected: ${ip}`);
    clients.delete(ip);
    
    // Notify host application about device disconnection
    broadcastToHost({
      type: 'deviceDisconnected',
      ip
    });
  });
});

/**
 * Broadcasts a message to the host device (Android app)
 * @param {Object} message - The message to send to the host
 */
function broadcastToHost(message) {
  // Android hotspot typically uses 192.168.43.1
  const hostClient = Array.from(clients.entries())
    .find(([ip]) => ip.includes('192.168.43.1'));
  
  if (hostClient && hostClient[1].ws.readyState === WebSocket.OPEN) {
    hostClient[1].ws.send(JSON.stringify(message));
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});