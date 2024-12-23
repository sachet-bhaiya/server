const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();

// Enable CORS for all routes

// Initialize Express app
const app = express();
app.use(cors())
// Variable to hold the screenshot data
let screenshotData = null;

// Define a route to return the screenshot data
app.get('/screenshot', (req, res) => {
    if (screenshotData) {
        res.status(200).send({ screenshot: screenshotData });
        console.log("sended screenshot")
    } else {
        res.status(404).send({ error: 'No screenshot data available' });
    }
});

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    ws.on('message', (message) => {

        // Store the message as screenshot data
        screenshotData = message;
        console.log("got screenshot")

        // Broadcast the message to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`WebSocket server is running.`);
    console.log(`HTTP server is available at http://localhost:${PORT}/screenshot`);
});
