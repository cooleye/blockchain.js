/*
区块
参数：区块索引 index；
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