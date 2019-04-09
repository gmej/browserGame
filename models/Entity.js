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

    getDistance(point) {
        //console.log(Math.sqrt(Math.pow(this.x - point.x,2) + Math.pow(this.y - point.y,2)));
        return Math.sqrt(Math.pow(this.x - point.x,2) + Math.pow(this.y - point.y,2))
    }
}

module.exports = Entity;