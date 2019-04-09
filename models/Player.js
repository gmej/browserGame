let Entity = require('./Entity');
var Bullet = require('./Bullet');
//console.log('aaaaa', Bullet.toString());
var guns = {
    shotgun: {
        name: 'shotgun',
        period: 5
    },
    minigun: {
        name: 'minigun',
        period: 0
    },
    sniper: {
        name: 'sniper',
        period: 15
    }
}

selectRandomGun = () => {
    let keys = Object.keys(guns)
    return guns[keys[keys.length * Math.random() << 0]]
}

class Player extends Entity {
    constructor(id) {
        super();
        this.id = id;
        this.number = "" + Math.floor(10 * Math.random());
        this.gun = selectRandomGun();
        this.bulletCounter = this.gun.period;
        console.log(this.gun);
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
        let bullet = new Bullet(this.id, angle, this);
        bullet.x = this.x;
        bullet.y = this.y;
    }


}

Player.list = {};

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