# BlockChain.js
使用javascript实现区块链，
实现了
* PoW工作量证明算法挖矿
* P2P网络，挖到的区块后广播给其他节点
    
不涉及交易功能
## 区块链基本概念：一个存储不断增加的有序记录的分布式数据库

这里我使用js实现了最基本的区块链和挖矿功能，帮助大家最直接的理解区块链。

## 区块结构
区块是一种被包含在公开账簿（区块链）里的聚合了交易信息的容器数据结构，包括区块头和区块体组成。
我们这里没有交易信息，所有省略了区块体部分，而由一个data字段来表示。
> block.js
```
/*
区块
参数：区块索引 index 同时也是区块的高度；
上一个区块哈希 previousHash；
时间戳 timestamp；
数据 data；
本区块哈希hash；
难度系数bits；
随机数 nonce；
挖出区块的矿机ip
*/
function Block(index, previousHash, timestamp, data, hash,bits,nonce,mip) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
        this.bits = bits;
        this.nonce = nonce;
        this.minerip = mip;
}

module.exports = Block;
```

## 使用Pow算法挖矿
```
/*
挖矿  PoW
1、算出block header hash
2、转成16进制
3、var target = coefficient * 2^(8 * (exponent – 3))
*/
function proof_of_work(data){
  
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
```
我们在区块中看到难度目标，其被标为"难度位"或简称"bits"。在 *config.json* 中，我把它的值为 0x1e500000。 这个标记的值被存为系数/指数格式，前两位十六进制数字为幂（exponent），接下来得六位为系数（coefficient）。在这个区块里，0x1e为幂，而 0x500000为系数。

### 难度目标计算的公式为：
> target = coefficient \* 2^\(8 \* \(exponent – 3\)\)
由此公式及难度位的值 0x1e500000，可得：

```
    target = 0x500000 * 2^(0x08 * (0x1e - 0x03))^

     => target = 0x500000 * 2^(0x08 * 0x1b)^

    => target = 238348 * 2^216^
```
计算结果为：
> 5.521397077432451e+71
转换为16进制后为
> 0x0000500000000000000000000000000000000000000000000000000000000000

我们要计算区块的hash，转为16进制后要小于刚才计算的target值，就可以产生一个区块。
计算区块hash
在 blockChain.js中
```
var calculateHash = (index, previousHash, timestamp, data,bits,nonce) => {
    return CryptoJS.SHA256(index + previousHash + timestamp + data + bits + nonce).toString();
};
```
区块中的数据只要不变,则SHA256就会算出同样的值，而一旦有一点的改变，就会计算出完全不一样的hash。我们的区块结构中，出了时间戳timestamp 和nonce之外其他字段都是固定不变的，所以每次我们只能去改变timestamp和nonce。timestamp每次获取当前时间。nonce从0开始自增。直到找出一个小于targe的值。
我在一个 while循环中，使得nonce++;调用挖矿函数
```
function startMiner(){
  console.time('  ⏰  挖矿花费时间：')
  while (!find) {
    var random = Math.random();
    var str = 'Davie kong-' + nonce + nonce++;
    proof_of_work(str)
  }
  console.timeEnd('  ⏰  挖矿花费时间：')
}
```

```
500000000000000000000000000000000000000000000000000000000000
000023aa60124ac235fd911100d0369b5badb3a2a3853e599e3bbcb4cff61820
  ⏰  挖矿花费时间：: 4317.532ms
 🔨 🔨 🔨  添加区块: {"index":1,"previousHash":"816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7","timestamp":1522984377.542,"data":"Davie kong-0.2835468136083028244236","hash":"ce6226b3eb8b5bfd2ea7dde12ee3391015587f0023d7d7b3d46ace2bc5012ce5","bits":"0x1e500000","nonce":244238,"minerip":"10.42.0.40"}
 ```

 目标值
 > 0x0000500000000000000000000000000000000000000000000000000000000000
 区块hash计算求得
 > 0x000023aa60124ac235fd911100d0369b5badb3a2a3853e599e3bbcb4cff61820

 可以看出我么算出了一个比目标值小的值，满足条件
 产生一个新区块，并且把区块添加到区跨链中
 ```
 var newBlock = blockChain.generateNextBlock(data,nonce);
    blockChain.addBlock(newBlock,function(blockData){
      p2p.broadcast(blockData)
    });
```

## 添加区块
```

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
```

产生的区块是使用fs模块，保存在 block.json 文件中。

## 创世区块
区块链的第一个区块是创世区块，内容是固定的
```
var getGenesisBlock = () => {
    return new Block(0, "0", 1465154705, "my genesis block!!", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
};
var blockchain = [getGenesisBlock()];

```
## 检查添加区块是否合法
```
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
```

## 与其他节点通信
在一个矿机产生了一个区块后，要把这个区块广播给其他节点，其他节点验证通过后，添加到自己的区块链上。
在这里，我写一个一个p2p模块，实现简单的数据传输功能。使用UDP协议，把数据广播出去。
```
var broadcast = (blockData) => {

  var bip = '255.255.255.255';
  server.send(JSON.stringify(blockData),8060,bip,function(err,bytes){
      console.log('>>把新加的区块数据广播到出去...')
  });
  
};
```
  UDP协议广播前，需要开启广播
  ```
    server.on('listening',()=>{
      server.setBroadcast(true);//开启广播
      server.setTTL(128);
      console.log('节点持续监听中，等待其他节点的广播....');
    });
  ```
  

其他节点监听
```
  server.on('message',(blockData,rinfo)=>{
      
      if(rinfo.address != localIp){
            console.log(`<<<<<<接受其他节点广播来的数据 ${rinfo.address}:${rinfo.port}-${blockData}`);
            blockChain.addBlock(JSON.parse(blockData),function(bd){
                console.log('验证其他节点产生的区块合法，添加到本地区块链中')
            })   
      }
  });
  
  server.bind(8060);
  ```
根据收到的数据ip判断广播是否来自其他节点。如果是其他节点在进行验证。否则有可能是本几点广播出去的数据。
获取本节点ip
```
var os=require('os'),
    localIp='',
    ifaces=os.networkInterfaces();
for (var dev in ifaces) {
  ifaces[dev].forEach(function(details,alias){
    if (details.family=='IPv4') {
      if(details.address != '127.0.0.1'){
        localIp = details.address;
      }
    }
  });
}
console.log("IP:",localIp);
```
然后对收到的区块进行验证，验证通过后，添加到区块链中。

### [在github获取代码](https://github.com/cooleye/blockchain.js)

### [挖矿和共识](http://book.8btc.com/books/6/masterbitcoin2cn/_book/ch10.html)
### [区块链p2p网络](https://keeganlee.me/post/blockchain/20180313)

