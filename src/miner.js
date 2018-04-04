var helper = require('./helper')
var blockChain = require('./blockChain')
var p2p = require('./p2p');
var fs =require('fs')

var bits = require('./config.json').bits
var nonce = 0;

var find =false;
/*
挖矿  PoW
1、算出block header hash
2、转成16进制
3、var target = coefficient * 2^(8 * (exponent – 3))
*/
function mineBlock(data){
  
  var previousBlock = blockChain.getLatestBlock();
  var nextIndex = previousBlock.index + 1;
  var nextTimestamp = new Date().getTime() / 1000;
  
  var nextHash = blockChain.calculateHash(nextIndex, previousBlock.hash, nextTimestamp,data,bits,nonce);
  nonce++;
  var hex = helper.strToHexCharCode(nextHash)
  
  var coefficient =  '0x' + bits.substr(4,6);
  var exponent = bits.substr(0,4);
  var target = coefficient * Math.pow(2,8*(exponent-3));

  target = target.toString(16);
  nextHash = nextHash.toString(16);
  
  // console.log(target)
  // console.log(nextHash)
  // console.log('>>',(('0x'+nextHash) - ('0x'+target))<0)
  if( (('0x'+nextHash) - ('0x'+target))<0 ){
    find = true;
    var newBlock = blockChain.generateNextBlock(data,nonce);
    blockChain.addBlock(newBlock,function(blockData){
      p2p.broadcast(blockData)
    });

    nonce = 0;
    
    //延时两秒再去挖下一个块
    setTimeout(function(){
      find = false;
      
      startMiner()
    },2000)
  }
  
}

function startMiner(){
  console.time('  ⏰  挖矿花费时间：')
  while (!find) {
    var str = 'Davie kong-' + nonce++;
    mineBlock(str)
  }
  console.timeEnd('  ⏰  挖矿花费时间：')
}
// startMiner()

module.exports = {
  startMiner
};
