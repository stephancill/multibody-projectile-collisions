function Projectile ({x, y, vxi, vyi, color="white", mass=10, radius=5, id=null}) {
    /*
    *  ----------
    *  Projectile
    *  ----------
    */
    this.pos = {x, y, xi: x, yi: y}
    this.vel = {x: vxi, y: vyi, xi: vxi, yi: vyi}
    this.color = color
    this.mass = mass
    this.radius = radius
    this.name = `${name} (ID: ${id})`
    this.id = id

    console.log(`New ${this.color} projectile at (${this.pos.x}, ${this.pos.y}) with velocity (${this.vel.x}, ${this.vel.y})`);

    this.setID = function(id) {
        this.id = id
        this.name = `${name} (ID: ${id})`
    }

    /**
     * Set this projectile's velocity for time
     * @param {Number} t
     */
    this.setVelocityForTime = function (t) {
        this.vel.x = this.vel.x;
        if (((this.pos.y-this.radius)!=0) || (this.vel.yi!=0)) {
            this.vel.y = this.vel.yi + t * G
        }
    }

    /**
     * Set this projectile's position for time
     * @param {Number} t
     */
    this.setPositionForTime = function (t) {
        // dx(t) = Vi*t + 1/2 * a * t^2
        // console.log(t)
        this.pos.x = this.pos.xi + this.vel.x * t;
        if (((this.pos.y-this.radius)!=0) || (this.vel.y!=0)) {
            this.pos.y = 1/2 * -G * Math.pow(t, 2) + this.vel.y * t + this.pos.yi
        }
    }

    /**
     * Set this projectile's velocity
     * @param {Number} vx
     * @param {Number} vy
     */
    this.setVelocity = function (vx, vy) {
        this.vel.x = vx;
        this.vel.y = vy;
    }

    /**
     * Set this projectile's position
     * @param {Number} vx
     * @param {Number} vy
     */
    this.setPosition = function (x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }

    /**
     * Set the projectile's initial position and velocity 
     * equal to the current position and velocity
     */
    this.captureAsInitialConditions = function () {
        // Position
        this.pos.xi = this.pos.x
        this.pos.yi = this.pos.y
        // Velocity
        this.vel.xi = this.vel.x
        this.vel.yi = this.vel.y
    }

    /**
     * Render this projectile on the scene canvas
     * @param {HTML Canvas Context} context 
     */
    this.render = function (context, debugging=true) {
        // Draw shape
        var startPoint = (Math.PI/180)*0;
        var endPoint = (Math.PI/180)*360;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.pos.x, context.canvas.height - this.pos.y, this.radius, startPoint, endPoint, true);
        context.fill();
        context.closePath();

        // Label
        context.fillStyle = "white"
        context.font = '20px serif';
        context.fillText(`${this.id}`, this.pos.x-5*`${this.id}`.length, context.canvas.height - this.pos.y + 6);
        

        if (debugging) {
            context.beginPath()
            context.moveTo(this.pos.x, context.canvas.height - this.pos.y)
            context.lineTo(this.pos.x + this.vel.x/2, context.canvas.height - (this.pos.y + this.vel.y/2))
            context.strokeStyle = "white"
            context.stroke()
            context.closePath()

            // Velocity
            context.fillStyle = "white"
            context.font = '11px Arial';
            context.fillText(`vx: ${roundToDecimalPlace(this.vel.x, 2)}`, this.pos.x + 5, context.canvas.height - this.pos.y);
            context.fillText(`vy: ${roundToDecimalPlace(this.vel.y, 2)}`, this.pos.x + 5, context.canvas.height - this.pos.y+11);
    
        }
    }
}
