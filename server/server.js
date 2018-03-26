const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const {genMsg, genLocationMsg} = require('./utils/messaging');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', genMsg('Admin', 'Welcome to the Chat App'));
    socket.broadcast.to(params.room).emit('newMessage', genMsg('Admin', `${params.name} has joined`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('Created Message', message);

    /*****socket.emit() emits to only one connection********/
    /*****io.emit() emits to all connected users*******/
    io.emit('newMessage', genMsg(message.from, message.text));
    callback();
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
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', genMsg('Admin', `${user.name} has left`));
    }
  })
})

server.listen(port, () => {
  console.log(`Started the app on port ${port}`);
})
