let Entity = require('./Entity');
var Bullet = require('./Bullet');
var guns = {
    shotgun: {
        name: 'shotgun',
        period: 15,
        bulletSpeed: 10
    },
    minigun: {
        name: 'minigun',
        period: 0,
        bulletSpeed: 10
    },
    sniper: {
        name: 'sniper',
        period: 25,
        bulletSpeed: 30
    }
}

selectRandomGun = () => {
    let keys = Object.keys(guns)
    return guns[keys[keys.length * Math.random() << 0]]
}

class Player extends Entity {
    constructor(id, socketId) {
        super();
        this.id = id;
        this.number = "" + Math.floor(10 * Math.random());
        this.gun = selectRandomGun();
        this.bulletCounter = 0;
        this.pressingDown = false;
        this.pressingLeft = false;
        this.pressingRight = false;
        this.pressingUp = false;
        this.pressingAttack = false;
        this.mouseAngle = 0;
        this.maxSpeed = 10;
        Player.list[id] = this;
    }



    updateSpeed() {
        if (this.pressingDown)
            this.ySpeed = this.maxSpeed;

        else if (this.pressingUp)
            this.ySpeed = -this.maxSpeed;

        else
            this.ySpeed = 0;

        if (this.pressingRight)
            this.xSpeed = this.maxSpeed;

        else if (this.pressingLeft)
            this.xSpeed = -this.maxSpeed;

        else
            this.xSpeed = 0;
    }


    updatePlayer() {
        this.updateSpeed();
        super.updateEntity();

        if (this.pressingAttack) {
            if (this.bulletCounter-- < 0) {
                this.shootBullet(this.mouseAngle);
                this.bulletCounter = this.gun.period;
            }
        } else {
            this.bulletCounter < this.gun.period ? this.bulletCounter-- : null;
        }

        return this;
    }

    shootBullet(angle) {
        switch (this.gun.name) {
            case 'shotgun':
                new Bullet(this, angle, this.gun.bulletSpeed);
                new Bullet(this, angle - 0.35, this.gun.bulletSpeed);
                new Bullet(this, angle + 0.35, this.gun.bulletSpeed);
                break;

            default:
                new Bullet(this, angle, this.gun.bulletSpeed);
                break;
        }
    }

    changeGun(name) {
        this.gun = guns[name];
        this.bulletCounter = guns[name].period;
        Player.list[this.id] = this;
    }

}

Player.list = {};

Player.getPlayerBySocketId = function (id) {
    for (let player in Player.list) {
        if (player == id)
            return Player.list[player];
    }
}

Player.getList = function () {
    return Player.list;
}

Player.onDisconnect = function (socket) {
    delete Player.list[socket.id];

}

Player.onConnect = function (socket) {

    var player = new Player(socket.id);

    let clientConfiguration = {
        number: player.number,
        otro: 'jejejeje'
    }
    socket.emit('clientConfiguration', clientConfiguration);
    socket.on('keyPress', data => {
        if (data.inputId == 'left')
            player.pressingLeft = data.state;
        if (data.inputId == 'right')
            player.pressingRight = data.state;
        if (data.inputId == 'up')
            player.pressingUp = data.state;
        if (data.inputId == 'down')
            player.pressingDown = data.state;
        if (data.inputId == 'attack')
            player.pressingAttack = data.state;
        if (data.inputId == 'mouseAngle')
            player.mouseAngle = data.state;
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