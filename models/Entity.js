class Entity {
    constructor(id) {
        this.x = 250;
        this.y = 250;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.id = "";
    }

    updateEntity() {
        this.updatePosition();
    }

    updatePosition () {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }
}

module.exports = Entity;