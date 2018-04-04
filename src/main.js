'use strict';

var express = require("express");
var bodyParser = require('body-parser');
var fs = require('fs');

var Block = require('./block');
var p2p = require('./p2p');
var miner = require('./miner')

var http_port = process.env.HTTP_PORT || 3001;

var initHttpServer = () => {
    var app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => {
       fs.readFile('./blocks.json',function(err,data){
         if(err){
           console.log(err)
         }else{
           res.send(JSON.stringify(data.toString()))
         }
       })
    });
    
    //获取节点
    app.get('/peers', (req, res) => {
        res.send(p2p.sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    //添加节点
    app.post('/addPeer', (req, res) => {
        p2p.connectToPeers([req.body.peer]);
        res.send();
    });
    app.listen(http_port, () => console.log('Listening http on port: ' + http_port));
};


// initHttpServer();
p2p.initP2PServer();

setTimeout(function(){
  miner.startMiner()
},2000)
