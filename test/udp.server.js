const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('close',()=>{
    console.log('socket已关闭');
});

server.on('error',(err)=>{
    console.log(err);
});

server.on('listening',()=>{
    console.log('socket正在监听中...');
  
    var message = '大家好啊，我是服务端>>>';
    var bip = '255.255.255.255';
    server.send(message,8061,bip,function(err,bytes){
        console.log('message send')
    });

});

server.on('message',(msg,rinfo)=>{
    console.log(`receive message from ${rinfo.address}:${rinfo.port}-${msg}`);
    // server.send('exit',rinfo.port,rinfo.address)
});

server.bind('8060',function(){
  server.setBroadcast(true);//开启广播
  server.setTTL(128);
});