/*
区块
参数：区块索引 index，上一个区块哈希 previousHash，时间戳，数据，本区块哈希
bits :难度系数
nonce：随机数
*/
class Block {
    constructor(index, previousHash, timestamp, data, hash,bits,nonce) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
        this.bits = bits;
        this.nonce = nonce;
    }
}

module.exports = Block;