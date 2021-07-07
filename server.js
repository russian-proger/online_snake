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
const server = http.createServer(app);
server.listen(80);