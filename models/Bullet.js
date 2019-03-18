'use strict'
let Entit = require('./Entity');

class Bullet extends Entity {
    constructor(angle) {
        super();
        this.id = Math.random();
        this.speed = 10;
        this.xSpeed = this.speed * Math.cos(angle);
        this.ySpeed = this.speed * Math.sin(angle);
    }
}