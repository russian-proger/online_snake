const fs   = require('fs');
const http = require('http');

const express = require('express');
const WebSocket = require('ws');

const app = express();

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const wsServer = new WebSocket.Server({ port: 8080 });

let positions = new Object();

function sendAll(excludeID=null) {
  wsServer.clients.forEach(v => {
    if (v.id == excludeID) return;
    v.send(JSON.stringify({ ...positions, [v.id]: undefined }));
  });
}

let lastID = 0;

/**
 * 
 * @param {WebSocket} wsClient 
 */
function onConnect(wsClient) {
  wsClient.id = ++lastID;
  wsClient.on("message", (data) => {
    let json = JSON.parse(data);
    positions[wsClient.id] = json;
    sendAll(wsClient.id);
  });

  wsClient.on('close', () => {
    delete positions[wsClient.id];
    sendAll(wsClient.id);
  })
}

wsServer.on('connection', onConnect)

const server = http.createServer(app);
server.listen(80);