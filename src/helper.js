//字符串转16进制
var strToHexCharCode = str => {
　　if(str === "")
　　　　return "";
　　var hexCharCode = [];
　　hexCharCode.push("0x"); 
　　for(var i = 0; i < str.length; i++) {
　　　　hexCharCode.push((str.charCodeAt(i)).toString(16));
　　}
　　return hexCharCode.join("");
}


var os=require('os'),
    iptable={},
    localIp='',
    ifaces=os.networkInterfaces();
for (var dev in ifaces) {
  ifaces[dev].forEach(function(details,alias){
    if (details.family=='IPv4') {
      // console.log(details.address)
      if(details.address != '127.0.0.1'){
        localIp = details.address;
      }
      // iptable[dev+(alias?':'+alias:'')]=details.address;
    }
  });
}
console.log("IP:",localIp);
// var localIp = iptable['en0:1'];


module.exports = {strToHexCharCode,localIp}



