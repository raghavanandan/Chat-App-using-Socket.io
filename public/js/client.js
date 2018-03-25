var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('New Message', message);
  var li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  $('#convo').append(li);
});

socket.on('newLocationMessage', function (message) {
  var li = $('<li></li>');
  var a = $('<a target="_blank">My current location</a>')
  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  $('#convo').append(li);
});

$('#chat-form').on('submit', function (event) {
  event.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val()
  }, function () {

  });
});


var locBtn = $('#location');

locBtn.on('click', function () {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  navigator.geolocation.getCurrentPosition(function (position) {
    console.log('Position', position);
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch location');
  })
});
