function Projectile ({x, y, vxi, vyi, color="white", mass=10, radius=20, name="Untitled Projectile"}) {
    /*
    *  ----------
    *  Projectile
    *  ----------
    */
    this.pos = { x: x, y: y, initial: {x: x, y: y} };
    this.vel = { x: vxi, y: vyi, initial: {x: vxi, y: vyi}};
    this.color = color;
    this.mass = mass;
    this.radius = radius;
    this.name = name;

    console.log(`New ${this.color} projectile at ${this.pos.x}, ${this.pos.y} with velocity ${this.vel.x}, ${this.vel.y}`);

    this.setVelocityFotTime = function (time) {
        let t = time;
        this.vel.x = this.vel.initial.x;
        this.vel.y = this.vel.initial.y + CONSTANTS.g * t;
    }

    // Set position given time
    this.setPositionForTime = function (time) {
        // dx(t) = Vi*t + 1/2 * a * t^2
        let t = time;
        this.pos.x = this.pos.initial.x + this.vel.initial.x * t;
        this.pos.y = 1/2 * -CONSTANTS.g * Math.pow(t, 2) - this.vel.initial.y * t + this.pos.initial.y;

        this.setVelocityFotTime(t);
    }

    this.setInitialVelocity = function (vxi, vyi) {
        this.vel.initial.x = vxi;
        this.vel.initial.y = vyi;
    }
    this.setInitialPosition = function (x, y) {
        this.pos.initial.x = x;
        this.pos.initial.y = y;
    }

    this.captureAsInitialConditions = function () {
        this.resetPositionWithinBounds()
        this.setInitialPosition(this.pos.x, this.pos.y);
        this.setInitialVelocity(this.vel.x, this.vel.y);
    }

    this.resetPositionWithinBounds = function() {
        if (this.pos.x > rect.right-this.radius) {
            console.log("x > rect.right-this.radius");
            this.pos.x = rect.right-this.radius
        } else if (this.pos.x < this.radius) {
            console.log("x < this.position.radius");
            this.pos.x = this.radius
        }
        if (this.pos.y > rect.bottom-this.radius) {
            this.pos.y = rect.bottom-this.radius
        } else if (this.pos.y < this.radius) {
            this.pos.y = this.radius
        }
    }

    // Rendering
    this.render = function (context) {
        // Draw
        var startPoint = (Math.PI/180)*0;
        var endPoint = (Math.PI/180)*360;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.pos.x*CONSTANTS.canvasScale, this.pos.y*CONSTANTS.canvasScale, this.radius*CONSTANTS.canvasScale, startPoint, endPoint, true);
        context.fill();
        context.closePath();
    }
}
