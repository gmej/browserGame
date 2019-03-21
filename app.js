'use strict'
var express = require('express');
var app = express();
var server = require('http').Server(app);
var Player = require('./models/Player');
var Bullet = require('./models/Bullet');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

server.listen(2000);
console.log('Server started.');


var SOCKET_LIST = {};

var io = require('socket.io')(server);
io.sockets.on('connection', socket => {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    Player.onConnect(socket);
    
    socket.number = "" + Math.floor(10 * Math.random());
    console.log('client connected: ', socket.id);

    socket.on('disconnect', () => {
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });

    socket.on('sendMsgToServer', data => {
        console.log('data', data);
        console.log('recieved sendMsgToServer');
        console.log(`[CHAT] ${data.id} says: ${data.msg}`);
        var playerName = "" + data.id;
        for(let i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data.msg);
        }
    });
    

});



setInterval(() => {
    let packet = {
        player: Player.update(),
        bullet: Bullet.update(),
    }
    for (let i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPosition', packet);
        
    }
}, 1000 / 25);