from binascii import unhexlify
from hashlib import sha256

#版本
version = '01000000'
#上一个区块hash
previous_hash = 'bddd99ccfda39da1b108ce1a5d70038d0a967bacb68b6b63065f626a00000000'
#默克尔树根
merkle_root = '44f672226090d85db9a9f2fbfe5f0f9609b387af7be5b7fbb7a1767c831c9e99'
#时间戳
time_stamp = '5dbe6649'
#难度系数
bits = 'ffff001d'
#运算次数
nonce = '05e0ed6d'

#拼接区块头
header = version + previous_hash + merkle_root + time_stamp + bits + nonce
print header

header = unhexlify(header)
print sha256(sha256(header).digest()).hexdigest()