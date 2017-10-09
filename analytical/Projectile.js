function Projectile ({x, y, vxi, vyi, color="white", mass=10, radius=5, name="Untitled Projectile"}) {
    /*
    *  ----------
    *  Projectile
    *  ----------
    */
    this.pos = {x, y, xi: x, yi: y};
    this.vel = {x: vxi, y: vyi, xi: vxi, yi: vyi};
    this.color = color;
    this.mass = mass;
    this.radius = radius;
    this.name = name;
    this.id = null

    console.log(`New ${this.color} projectile at (${this.pos.x}, ${this.pos.y}) with velocity (${this.vel.x}, ${this.vel.y})`);

    this.setVelocityForTime = function (t) {
        this.vel.x = this.vel.x;
        if (((this.pos.y-this.radius)!=0) || (this.vel.y!=0)) {
            this.vel.y = this.vel.yi + t * G
        }
    }

    // Set position given time
    this.setPositionForTime = function (t) {
        // dx(t) = Vi*t + 1/2 * a * t^2
        // console.log(t)
        this.pos.x = this.pos.xi + this.vel.x * t;
        if (((this.pos.y-this.radius)!=0) || (this.vel.y!=0)) {
            this.pos.y = 1/2 * G * Math.pow(t, 2) + this.vel.y * t + this.pos.yi
        }
    }

    this.setVelocity = function (vx, vy) {
        this.vel.x = vx;
        this.vel.y = vy;
    }
    this.setPosition = function (x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    this.captureAsInitialConditions = function () {
        // Position
        this.pos.xi = this.pos.x
        this.pos.yi = this.pos.y
        // Velocity
        this.vel.xi = this.vel.x
        this.vel.yi = this.vel.y
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
        context.arc(this.pos.x, context.canvas.height - this.pos.y, this.radius, startPoint, endPoint, true);
        context.fill();
        context.closePath();
    }
}
