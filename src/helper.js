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



module.exports = {strToHexCharCode}



