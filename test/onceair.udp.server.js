var os        = require('os')
var fs        = require('fs')
var net       = require('net')
var dgram     = require('dgram')
var cp        = require('child_process')
var path      = require('path')
var udp       = dgram.createSocket('udp4')

udp.on('message', function(data, ipdr) {
  console.log('message')
  console.log(data.toString())
  console.log(ipdr)
})

udp.on('error', function(err) {
  console.log('error')
  console.log(arguments)
})

udp.on('listening', function(err) {
  console.log('listening')
  console.log(arguments)
})

udp.bind(8090)
console.log('udp listening on port 8090')


var send = function(message, port, host) {
  console.log('send')
  console.log(arguments)
  udp.send(Buffer.from(message), port || 8090, host || 'anynb.com')
}

//called directly in command line
if (require.main === module) {
  var port = parseInt(process.argv[2])
  var host = process.argv[3]
  if (port) {
    send('echo', port, host)
  } else {
    send('echo')
  }
}