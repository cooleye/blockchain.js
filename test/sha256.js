var CryptoJS = require("crypto-js");


var hex = new Buffer('1a').toString('hex')
// console.log('16进制字符串：',hex);
// 转换成十六进制字符串：3161



var str = new Buffer(hex, 'hex').toString()
// console.log("原来的字符串：",str);
// 还原十六进制字符串：1a


var hash = CryptoJS.SHA256("1a").toString()
// console.log("hash：",hash)
//a73fcf339640929207281fb8e038884806e2eb0840f2245694dbba1d5cc89e65


var st = '0x01000000bddd99ccfda39da1b108ce1a5d70038d0a967bacb68b6b63065f626a0000000044f672226090d85db9a9f2fbfe5f0f9609b387af7be5b7fbb7a1767c831c9e995dbe6649ffff001d05e0ed6d';
var h1 = CryptoJS.SHA256(new Buffer(st, 'hex').toString()).toString();
console.log(h1)
var h2 = CryptoJS.SHA256(new Buffer(h1,"hex").toString()).toString()
console.log(h2)