var getTarget = require('./pow');

var CryptoJS = require("crypto-js");


var bits = "0x1749500d";

var target = getTarget(bits);

console.log("target:",target)


function getHash(){
    var  version = "01000000";
    // 上一块的hash：00000000000008a3a41b85b8b29ad444def299fee21793cd8b9e567eab02cd81
    var pre_hash = "81cd02ab7e569e8bcd9317e2fe99f2de44d49ab2b8851ba4a308000000000000";
    // merkle根：2b12fcf1b09288fcaff797d71e950e71ae42b91e8bdb2304758dfcffc2b620e3
    var merkle_root = "e320b6c2fffc8d750423db8b1eb942ae710e951ed797f7affc8892b0f1fc122b";
    // 时间戳：1305998791 （May 22, 2011 1:26:31 AM ）
    var timeStamp = "c7f5d74d";
    // bits：1a44b9f2 (10进制为：440711666)
    var bits = "f2b9441a";
    // nonce：2504433986，10进制转16进制为：9546a142
    var nonce = "42a14695";

    var header_hex = version + pre_hash + merkle_root + timeStamp + bits + nonce;
  
    var header_str =  new Buffer(header_hex, 'hex').toString()
    console.log("hex:",header_hex)
    console.log("str:",header_str)
    return CryptoJS.SHA256(CryptoJS.SHA256(header_str)).toString();
    
}

var hash = getHash()

console.log("hash:",hash)
console.log('hashlength:',hash.length)