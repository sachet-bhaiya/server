const express = require('express');
const http = require('http');
const cors = require('cors')
const WebSocket = require('ws');
const app = express();

app.use(cors())
let screenshotData = null;

app.get('/screenshot', (req, res) => {
    if (screenshotData) {
        res.status(200).send({ screenshot: screenshotData });
        console.log("sended screenshot")
    } else {
        res.status(404).send({ error: 'No screenshot data available' });
    }
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {

        screenshotData = message;
        console.log("got screenshot")

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
    console.log(`WebSocket server is running.`);
});
