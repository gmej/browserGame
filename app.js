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

//
// WARNING !!!
//
var DEBUG = true;


let USERS = {
    'a': 'a',
    'b': 'b',
    'c': 'c',
}

let isValidPassword = function (data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (USERS[data.username] === data.password)
                resolve();
            else
                reject();
        }, 500);
    });
}

let isUsernameTaken = function (data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (USERS[data.username])
                resolve();
            else
                reject();
        }, 500);
    });
}

let addUser = function (data) {
    console.log('data.username :', data.username);
    console.log('data.password :', data.password);
    USERS[data.username] = data.password;
}

var io = require('socket.io')(server);
io.sockets.on('connection', socket => {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    socket.number = "" + Math.floor(10 * Math.random());
    console.log('client connected: ', socket.id);

    socket.on('logIn', data => {
        isValidPassword(data)
            .then((result) => {
                Player.onConnect(socket);
                socket.emit('logInResponse', { success: true });
                console.log('Client logged in');
            }).catch((err) => {

                socket.emit('logInResponse', { success: false });
            });
    });

    socket.on('signUp', data => {
        isUsernameTaken(data)
            .then((result) => {
                socket.emit('signUpResponse', { success: false });
            }).catch((err) => {
                addUser(data);
                socket.emit('signUpResponse', { success: true });
                console.log('Client signed up');
            });
    });
    socket.on('changeGun', data => {
        let player = Player.getPlayerBySocketId(socket.id);
        player.changeGun(data.name);
    });


    socket.on('disconnect', () => {
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });

    socket.on('sendMsgToServer', data => {
        console.log(`[CHAT] ${data.id} says: ${data.msg}`);
        var playerName = "" + data.id;
        for (let i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data.msg);
        }
    });

    socket.on('evalServer', data => {
        if (!DEBUG)
            return;
        try {
            var res = eval(data);
        } catch (error) {
            console.log('[CHAT ERROR]: ');
            console.log(error);
        }
        socket.emit('evalAnswer', res);
    });


});



setInterval(() => {

    let packet = {
        player: Player.update(),
        bullet: Bullet.update(Player.getList()),
    }
    for (let i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPosition', packet);

    }
}, 1000 / 25);

module.exports.data = {

}