const http = require('http');
const WebSocket = require('ws');

// Create an HTTP server
const server = http.createServer();

// Attach WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // Broadcast to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

// Start the HTTP server
const PORT = process.env.PORT || 8080; // Use the port provided by Render
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`WebSocket server address:`, server.address());
});
