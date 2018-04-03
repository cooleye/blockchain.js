const dgram = require('dgram');
const server = dgram.createSocket('udp4');

var blockChain = require('./blockChain');
var WebSocket = require("ws");
var p2p_port = process.env.P2P_PORT || 6001;
var initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];
var sockets = [];


var initP2PServer = () => {
  
  server.on('close',()=>{
      console.log('socket已关闭');
  });

  server.on('error',(err)=>{
      console.log(err);
  });

  server.on('listening',()=>{
      server.setBroadcast(true);//开启广播
      server.setTTL(128);
      console.log('socket正在监听中...');
  });

  server.on('message',(msg,rinfo)=>{
      console.log(`receive message from ${rinfo.address}:${rinfo.port}-${msg}`);
      // server.send('exit',rinfo.port,rinfo.address)
  });

};

var broadcast = (message) => {
  var message = '大家好啊，我是服务端>>>';
  var bip = '255.255.255.255';
  server.send(message,8061,bip,function(err,bytes){
      console.log('message send')
  });
};

module.exports = {
  connectToPeers,
  initP2PServer,
  sockets,
  broadcast,
  responseLatestMsg
}
