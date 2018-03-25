var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = $('<li></li>');
  li.text(`${message.from} : ${message.text} ${formattedTime}`);

  $('#convo').append(li);
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = $('<li></li>');
  var a = $('<a target="_blank">My current location</a> ')
  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href', message.url);
  li.append(a);
  $('#convo').append(li);
});

$('#chat-form').on('submit', function (event) {
  event.preventDefault();

  var textBox = $('[name=message]');

  if(textBox.val() !== '') {
    socket.emit('createMessage', {
      from: 'User',
      text: textBox.val()
    }, function () {
      textBox.val('');
    });
  }
});


var locBtn = $('#location');

locBtn.on('click', function () {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  locBtn.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locBtn.removeAttr('disabled').text('Send location');
    // console.log('Position', position);
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locBtn.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location');
  })
});
