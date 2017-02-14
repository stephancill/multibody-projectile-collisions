function Projectile (constants, pos={x: 0, y: 0}, size={width:0, height:0, radius: 0}, vi={x: 0, y:0}) {
    /*
    Constructor:
        {
            constants: { g },
            position: {x, y},
            size: {width === radius, height},
            vi: {vix, viy}
        }
    */
    this.t = 0
    this.g = constants.g;
    this.a = 0;
    this.mass = 10;
    this.pos = pos;
    this.size = size;
    this.vel = vi;
    this.name = "Unnamed Projectile";
    this.color = "white";
    this.colliding = false;

    // Computed
    this.updateVelocity = function () {
        // Kinematics
        this.t += 1 * constants.timeScale; // Increment time

        let vx = this.vel.x; // TODO: air resistance
        let vy = this.vel.y + this.g*this.t;
        // console.log(vx, vy);
        this.setVelocity(vx, vy)
    }
    this.updatePosition = function () {
        this.pos.x += this.vel.x*constants.canvasScale;
        this.pos.y -= this.vel.y*constants.canvasScale; // HTML5 Canvas y coordinates ascend from bottom to top, so we reverse it
    }

    // Getters
    this.getPosition = function () {
        return { x: this.pos.x, y: this.pos.y }
    }
    this.getSize = function () {
        return { width: this.size.width, height: this.size.height }
    }
    this.getVelocity = function () {
        return { x: this.vel.x, y: this.vel.y }
    }

    // Setters
    this.setPosition = function (x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }
    this.setSize = function (width, height) {
        this.size.width = width;
        this.size.height = height;
    }
    this.setVelocity = function (vx, vy) {
        this.vel.x = vx;
        this.vel.y = vy;
    }

    // Rendering
    this.render = function (context) {
        let tmpPos = {x: this.pos.x, y: this.pos.y};
        let tmpTime = this.t;
        if (!this.colliding) {
            this.updateVelocity();
        } else {
            this.t += 1 * constants.timeScale; // Increment time
            console.log("I'm colliding");
        }
        this.updatePosition();
        // this.setVelocity((tmpPos.x - this.pos.x)/(tmpTime-this.t)*0.1, (this.pos.y - tmpPos.y)/(tmpTime-this.t)*0.1)

        if (this.pos.x + this.size.width > context.canvas.width || this.pos.x - this.size.width < 0) {
            if (this.pos.x - this.size.width < 0) {
                this.setPosition(this.size.width, this.pos.y);
            } else {
                this.setPosition(context.canvas.width-this.size.width, this.pos.y);
            }
            this.setVelocity(-this.vel.x, this.vel.y)
        }
        if (this.pos.y - this.size.width < 0 || this.pos.y + this.size.width > context.canvas.height) { // Ground is already accounted for (undo this)
            if (this.pos.y > context.canvas.height-this.size.width) {
                this.setPosition(this.pos.x, context.canvas.height-this.size.width);
                // this.setVelocity(this.vel.x, -this.vel.y) // <- change this for no bounce
            } else {
                this.setPosition(this.pos.x, this.size.width)
            }
            this.setVelocity(this.vel.x, -this.vel.y)
        }

        // Draw
        var startPoint = (Math.PI/180)*0;
        var endPoint = (Math.PI/180)*360;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.pos.x,this.pos.y,this.size.width,startPoint,endPoint,true);
        context.fill();
        context.closePath();
        // context.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height)
    }
}
