const express = require('express');
const http = require('http');
const cors = require('cors');
const WebSocket = require('ws');
const app = express();

app.use(cors());

app.use(express.json());

let screenshotData = null;

app.route('/screenshot')
    .get((req, res) => {
        if (screenshotData) {
            res.status(200).send({ screenshot: screenshotData });
            console.log("Sent screenshot");
        } else {
            res.status(404).send({ error: 'No screenshot data available' });
        }
    })
    .post((req, res) => {
        const { screenshot } = req.body; 
        if (screenshot) {
            screenshotData = screenshot; 
            console.log("got screenshot");
            res.status(200).send({ message: 'Screenshot data stored successfully' });
        } else {
            res.status(400).send({ error: 'Invalid screenshot data' });
        }
    });

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        screenshotData = message;
        console.log("Received screenshot via WebSocket");

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
