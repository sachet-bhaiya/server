const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();

const wss = new WebSocket.Server({ server });


wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`WebSocket server address:`, server.address());
});
