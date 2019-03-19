'use strict'
let Entity = require('./Entity');

class Bullet extends Entity {
    constructor(angle) {
        super();
        this.id = Math.random();
        this.speed = 10;
        this.timer = 0;
        this.toRemove = false;
        this.xSpeed = this.speed * Math.cos(angle);
        this.ySpeed = this.speed * Math.sin(angle);
        Bullet.list[this.id] = this;
    }
    updateBullet() {
        if (this.timer++ > 100) {
            this.toRemove = true;
            this.updateEntity();
        }
    }
}
Bullet.list = {};

Bullet.update = function () {
    if (Math.random() < 0.1){
        new Bullet(Math.random()*360);
    }

        var packet = [];
    for (let i in Bullet.list) {
        var bullet = Bullet.list[i];
        bullet.updateBullet();
        packet.push({
            x: bullet.x,
            y: bullet.y
        })
    }
    return packet;
}

module.exports = Bullet;