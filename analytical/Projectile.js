function Projectile ({x, y, vxi, vyi, color="white", mass=10, radius=20, name="Untitled Projectile"}) {
    /* ----------
    /* Projectile
    /* ----------
    */
    this.pos = { x: x, y: y, initial: {x: x, y: y} };
    this.vel = { x: vxi, y: vyi, initial: {x: vxi, y: vyi}};
    this.color = color;
    this.mass = mass;
    this.radius = radius;
    this.name = name;

    console.log(this.name, ": ",this.pos, this.vel, this.color, this.radius);

    this.setVelocityFotTime = function (t) {
        this.vel.x = this.vel.initial.x;
        this.vel.y = this.vel.initial.y + CONSTANTS.g * t;
    }

    // Set position given time
    this.setPositionForTime = function (t) {
        // dx(t) = Vi*t + 1/2 * a * t^2
        this.pos.x = this.pos.initial.x + this.vel.initial.x * t;
        this.pos.y = 1/2 * -CONSTANTS.g * Math.pow(t, 2) - this.vel.initial.y * t + this.pos.initial.y;
        console.log(this.pos.y);
        this.setVelocityFotTime(t);
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
