const dgram = require('dgram');
const client = dgram.createSocket('udp4');

client.on('close',()=>{
    console.log('socket已关闭');
});

client.on('error',(err)=>{
    console.log(err);
});
client.on('listening',()=>{
    console.log('socket正在监听中...');
});
client.on('message',(msg,rinfo)=>{
    if(msg=='exit') client.close();
    console.log(`receive message from ${rinfo.address}:${rinfo.port}--${msg}`);
});
// client.send(`hello`,8060,'127.0.0.1');

client.bind(8061);

// if (require.main === module) {
//   var port = parseInt(process.argv[2])
//   var host = process.argv[3]
//   var msg = process.argv[4]
//   if (port) {
//     client.send(msg, port, host)
//   } else {
//     client.send('echo')
//   }
// }