const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const express = require('express');

const app = express();
const server = https.createServer({
    cert: fs.readFileSync('server.cert'),
    key: fs.readFileSync('server.key')
}, app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        console.log('received: %s', message);
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.use(express.static('public'));

server.listen(8080, () => {
    console.log('WebSocket server is running on https://nome-do-seu-computador-ou-ip-local:8080');
});
