
var dgram = require("dgram");
var socket = dgram.createSocket("udp4");
socket.bind(function () {
  socket.setBroadcast(true);
});

var message = new Buffer("Hi");
socket.send(message, 0, message.length, 41234, '255.255.255.255', function(err, bytes) {
  socket.close();
});