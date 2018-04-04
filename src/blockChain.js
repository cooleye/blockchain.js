var Block = require('./block')
var fs = require('fs');
var CryptoJS = require("crypto-js");

var bits = require('./config.json').bits
//获取创世区块
var getGenesisBlock = () => {
    return new Block(0, "0", 1465154705, "my genesis block!!", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
};

var blockchain = [getGenesisBlock()];

//添加区块
var addBlock = (newBlock,cb) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
        
        fs.readFile('./blocks.json',function(err,res){
          if(err){
            console.log(err)
          }else{
            var res = JSON.parse(res.toString())
            res.push(newBlock)
            fs.writeFile(__dirname + '/blocks.json',JSON.stringify(res),function(err){
                if(err){
                  console.log(err)
                }else{
                  cb(newBlock)
                  console.log(' 🔨 🔨 🔨  添加区块: ' + JSON.stringify(newBlock));
                }
            })
          }
        })
    }
};

//检查一个区块是否合法
var isValidNewBlock = (newBlock, previousBlock) => {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
};


//获得上一个区块
var getLatestBlock = () => blockchain[blockchain.length - 1];

//产生下一个区块
var generateNextBlock = (blockData,nonce) => {
    var previousBlock = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = new Date().getTime() / 1000;
    var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash,bits,nonce);
};
//替换区块链
var replaceChain = (newBlocks) => {
    if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        blockchain = newBlocks;
        broadcast(responseLatestMsg());
    } else {
        console.log('Received blockchain invalid');
    }
};
//检测区块链是否合法
var isValidChain = (blockchainToValidate) => {
    if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(getGenesisBlock())) {
        return false;
    }
    var tempBlocks = [blockchainToValidate[0]];
    for (var i = 1; i < blockchainToValidate.length; i++) {
        if (isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
            tempBlocks.push(blockchainToValidate[i]);
        } else {
            return false;
        }
    }
    return true;
};

//根据区块计算区块的哈希
var calculateHashForBlock = (block) => {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data,block.bit,block.non);
};

//计算区块的哈希
var calculateHash = (index, previousHash, timestamp, data,bits,nonce) => {
    return CryptoJS.SHA256(index + previousHash + timestamp + data + bits + nonce).toString();
};

module.exports = {addBlock,getLatestBlock,generateNextBlock,replaceChain,blockchain,calculateHash}

