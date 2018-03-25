const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const {genMsg, genLocationMsg} = require('./utils/messaging');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', genMsg('Admin', 'Welcome to the Chat App'));

  socket.broadcast.emit('newMessage', genMsg('Admin', 'New user has joined the conversation'));

  socket.on('createMessage', (message, callback) => {
    console.log('Created Message', message);

    /*****socket.emit() emits to only one connection********/
    /*****io.emit() emits to all connected users*******/
    io.emit('newMessage', genMsg(message.from, message.text));
    callback('This is from the server');
    /******** Broadcast messages ***********/
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', genLocationMsg('Admin', coords.latitude, coords.longitude))
  });

  socket.on('disconnect', () => {
    console.log("Client disconencted");
  })
})

server.listen(port, () => {
  console.log(`Started the app on port ${port}`);
})
