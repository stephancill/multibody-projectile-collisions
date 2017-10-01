function Projectile ({x, y, vxi, vyi, color="white", mass=10, radius=5, name="Untitled Projectile"}) {
    /*
    *  ----------
    *  Projectile
    *  ----------
    */
    this.pos = {x, y};
    this.vel = {x: vxi, y: vyi};
    this.color = color;
    this.mass = mass;
    this.radius = radius;
    this.name = name;

    console.log(`New ${this.color} projectile at (${this.pos.x}, ${this.pos.y}) with velocity (${this.vel.x}, ${this.vel.y})`);

    this.setVelocityForTime = function (time) {
        let t = time;
        this.vel.x = this.vel.x;
        // this.vel.y = this.vel.y + t * -9.8;
    }

    // Set position given time
    this.setPositionForTime = function (time) {
        // dx(t) = Vi*t + 1/2 * a * t^2
        let t = time;
        this.pos.x = this.pos.x + this.vel.x * t;
        // this.pos.y = 1/2 * -9.8 * Math.pow(t, 2) + this.vel.y * t + this.pos.y;
    }

    this.setVelocity = function (vx, vy) {
        this.vel.x = vx;
        this.vel.y = vy;
    }
    this.setPosition = function (x, y) {
        this.pos.x = x;
        this.pos.y = y;
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
        context.arc(this.pos.x, this.pos.y, this.radius, startPoint, endPoint, true);
        context.fill();
        context.closePath();
    }
}