'use strict'
let Entity = require('./Entity');
var Player = require('./Player');

class Bullet extends Entity {
    constructor(parentId, angle, parent) {
        super();
        this.id = Math.random();
        this.speed = 10;
        this.timer = 0;
        this.parentId = parentId;
        this.parent = parent;
        this.xSpeed = this.speed * Math.cos(angle);
        this.ySpeed = this.speed * Math.sin(angle);
        this.toRemove = false;
        Bullet.list[this.id] = this;
    }
}

Bullet.list = {};

Bullet.update = function (playerList) {
    var packet = [];
    for (let i in Bullet.list) {
        var bullet = Bullet.list[i];
        bullet.updateBullet(playerList);
        if (bullet.toRemove)
            delete Bullet.list[i]
        else
            packet.push({
                x: bullet.x,
                y: bullet.y
            })
    }
    return packet;
}

Bullet.prototype.updateBullet = function (playerList) {
    if (this.timer++ > 35) {

        this.toRemove = true;
    }
    this.updateEntity();

    for (let i in playerList) {
        var player = playerList[i];
        if (this.getDistance(player) < 32 && this.parentId !== player.id) {
            //handle collission
            console.log('hit');
            this.toRemove = true;
        }
    }
}

module.exports = Bullet;