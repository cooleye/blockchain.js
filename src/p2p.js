const dgram = require('dgram');
const server = dgram.createSocket('udp4');

var blockChain = require('./blockChain');
var localIp = require('./helper').localIp;
// var p2p_port = process.env.P2P_PORT || 6001;
// var initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];



var sockets = [];


var initP2PServer = () => {
  console.log('init...')
  server.on('close',()=>{
      console.log('socket已关闭');
  });

  server.on('error',(err)=>{
      console.log(err);
  });

  server.on('listening',()=>{
      server.setBroadcast(true);//开启广播
      server.setTTL(128);
      console.log('节点持续监听中，等待其他节点的广播....');
  });

  /*
  接受到其他节点广播的数据，进行验证
  验证区块是否合法
  
  */
  server.on('message',(blockData,rinfo)=>{
      
      if(rinfo.address != localIp){
            console.log(`<<<<<<接受其他节点广播来的数据 ${rinfo.address}:${rinfo.port}-${blockData}`);
            blockChain.addBlock(JSON.parse(blockData),function(bd){
                console.log('验证其他节点产生的区块合法，添加到本地区块链中')
            })
          
      }
      
      // server.send('exit',rinfo.port,rinfo.address)
      
  });
  
  server.bind(8060);

};

var broadcast = (blockData) => {

  var bip = '255.255.255.255';
  // console.log('广播出去的区块>>>>>',JSON.stringify(blockData))
  server.send(JSON.stringify(blockData),8060,bip,function(err,bytes){
      console.log('>>把新加的区块数据广播到出去...')
  });
  
};

module.exports = {
  initP2PServer,
  sockets,
  broadcast
}
