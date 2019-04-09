class Entity {
    constructor(id = Math.random(), x = 250, y = 250) {
        this.x = x;
        this.y = y;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.id = id;
    }

    updateEntity() {
        this.updatePosition();
    }

    updatePosition() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    getDistance(point) {
        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2))
    }
}

module.exports = Entity;