function Projectile ({x, y, vxi, vyi, color="white", mass=10, radius=20, name="Untitled Projectile"}) {
    /* ----------
    /* Projectile
    /* ----------
    */
    this.pos = { x: x, y: y };
    this.vel = { x: vxi, y: vyi};
    this.color = color;
    this.mass = mass;
    this.radius = radius;
    this.name = name;

    console.log(this.name, ": ",this.pos, this.vel, this.color, this.radius);

    // Set position given time
    this.setPositionForTime = function (t) {
        // dx(t) = Vi*t + 1/2 * a * t^2
        this.pos.x = this.vel.x * t;
        this.pos.y = -this.vel.y * t + 1/2 * CONSTANTS.g * Math.pow(t, 2);

        this.pos.x *= CONSTANTS.canvasScale;
        this.pos.y *= CONSTANTS.canvasScale;
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
