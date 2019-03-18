let Entity = require('./Entity');
class Player extends Entity {
    constructor(id) {
        super();
        this.id = id;
        this.number = "" + Math.floor(10 * Math.random());
        this.pressingDown = false;
        this.pressingLeft = false;
        this.pressingRight = false;
        this.pressingUp = false;
        this.maxSpeed = 10;
        Player.list[id] = this;
        console.log('Player saved in Player.list: ', Player.list);
    }


    updateSpeed() {
        if (this.pressingDown)
            this.ySpeed = this.maxSpeed;
        else if (this.pressingUp)
            this.ySpeed = -this.maxSpeed;
        else
            this.ySpeed = 0;

        if (this.pressingRight) {

            this.xSpeed = this.maxSpeed;
        }
        else if (this.pressingLeft)
            this.xSpeed = -this.maxSpeed;
        else
            this.xSpeed = 0;
    }

    updatePlayer() {
        this.updateSpeed();
        super.updateEntity();
    }


}

Player.list = {};

Player.onDisconnect = function (socket) {
    delete Player.list[socket.id];

}

Player.onConnect = function (socket) {

    var player = new Player(socket.id);

    socket.on('keyPress', data => {
        if (data.inputId == 'left')
            player.pressingLeft = data.state;
        if (data.inputId == 'right')
            player.pressingRight = data.state;
        if (data.inputId == 'up')
            player.pressingUp = data.state;
        if (data.inputId == 'down')
            player.pressingDown = data.state;
    })
}

Player.update = function () {
    var packet = [];
    for (let i in Player.list) {
        var player = Player.list[i];
        player.updatePlayer();
        packet.push({
            x: player.x,
            y: player.y,
            number: player.number
        })
    }
    return packet;
}
module.exports = Player;