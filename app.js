var express = require('express');
var app = express();
var server = require('http').Server(app);

var SOCKET_LIST = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

server.listen(2000);
console.log('Server started.');



var io = require('socket.io')(server);
io.sockets.on('connection', socket => {
    socket.id = Math.random();
    socket.x = 0;
    socket.y = 0;
    socket.number = "" + Math.floor(10*Math.random());
    SOCKET_LIST[socket.id] = socket;
    console.log('client connected: ', socket.id);

    socket.on('disconnect', () => {
        delete SOCKET_LIST[socket.id];
    })
});



setInterval(() => {
    var packet = [];
    for (let i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.x += 3;
        socket.y += 3;
        packet.push({
            x: socket.x,
            y: socket.y,
            number: socket.number
        })

    }
    for (let i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPosition', packet);
    }
}, 1000 / 25);