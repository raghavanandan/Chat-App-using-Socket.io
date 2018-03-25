const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', {
    from: "server@server.com",
    text: "Hey. What's up ?!",
    creatAt: 123
  });

  socket.on('createMessage', (message) => {
    console.log('Created Message', message);
  })

  socket.on('disconnect', () => {
    console.log("Client disconencted");
  })
})

server.listen(port, () => {
  console.log(`Started the app on port ${port}`);
})
