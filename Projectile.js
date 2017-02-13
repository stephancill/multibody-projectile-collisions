function Projectile (constants, pos={x: 0, y: 0}, size={width:0, height:0}, vi={x: 0, y:0}) {
    /*
    Constructor:
        {
            constants: { g },
            position: {x, y},
            size: {width, height},
            vi: {vix, viy}          // vi = velocity initial
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
        this.pos.y -= this.vel.y*constants.canvasScale; // HTML5 Canvas y coordinates ascend from bottom to top, so we reverse is
        // console.log(projectiles);
        let self = this
        // Detect collision
        projectiles.map(p => {
            if (p.name !== self.name) {
                self.comparePositions(p);
            }
        });
    }

    this.collision = function () {
        console.log("collision");
    }

    this.comparePositions = function (p) {
        // console.log("Dpos: ", Math.pow(Math.pow((this.pos.x - pos.x), 2)+Math.pow((this.pos.y - pos.y), 2), 0.5), "Radius: ", this.size.width + size.width   );
        if (Math.pow(Math.pow((this.pos.x - p.pos.x), 2)+Math.pow((this.pos.y - p.pos.y), 2), 0.5) <= this.size.width + p.size.width) {
            this.collision(p);
            this.calculateCollision(p)
        }
    }
    this.calculateCollision = function (p) {
        let x1 = this.pos.x+p.size.width/2;
        let y1 = this.pos.y+p.size.height/2;
        let x1vi = this.vel.x;
        let y1vi = this.vel.y;
        let m1 = this.mass;

        let x2 = p.pos.x+p.size.width/2;
        let y2 = p.pos.y+p.size.height/2;
        let x2vi = p.vel.x;
        let y2vi = p.vel.y;
        let m2 = p.mass;

        let cang = 0;

        if (y1 == y2) {
            cang = 0
        } else {
            cang = (180/Math.PI)*(Math.atan((x1-x2)/(y1-y2)))
        }

        x1vf = ((Math.pow((Math.pow(x1vi,2)+Math.pow(y1vi,2)),0.5)*Math.cos((Math.PI/180)*(90-2*cang))*(m1-m2)+2*m2*(Math.pow(Math.pow(x2vi,2)+Math.pow(y2vi,2)),0.5)*Math.cos((Math.PI/180)*((180/Math.PI)*(Math.atan(y2vi/x2vi))-cang)))*Math.cos((Math.PI/180)*(cang))/(m1+m2)) + (Math.pow(Math.pow(x1vi,2)+Math.pow(y1vi,2)),0.5)*Math.sin((Math.PI/180)*(90-2*cang))*Math.cos((Math.PI/180)*(cang)+Math.PI/2);
        y1vf = (((Math.pow(Math.pow(x1vi,2)+Math.pow(y1vi,2)),0.5)*Math.cos((Math.PI/180)*(90-2*cang))*(m1-m2)+2*m2*(Math.pow(Math.pow(x2vi,2)+Math.pow(y2vi,2)),0.5)*Math.cos((180/Math.PI)*((Math.PI/180)*(Math.atan(y2vi/x2vi))-cang)))*Math.sin((Math.PI/180)*(cang))/(m1+m2)) + (Math.pow(Math.pow(x1vi,2)+Math.pow(y1vi,2)),0.5)*Math.sin((Math.PI/180)*(90-2*cang))*Math.sin((Math.PI/180)*(cang)+Math.PI/2);

        x2vf = ((Math.pow((Math.pow(x2vi,2)+Math.pow(y2vi,2)),0.5)*Math.cos((Math.PI/180)*(90-2*cang))*(m2-m1)+2*m2*(Math.pow(Math.pow(x1vi,2)+Math.pow(y1vi,2)),0.5)*Math.cos((Math.PI/180)*((180/Math.PI)*(Math.atan(y1vi/x1vi))-cang)))*Math.cos((Math.PI/180)*(cang))/(m2+m1)) + (Math.pow(Math.pow(x2vi,2)+Math.pow(y2vi,2)),0.5)*Math.sin((Math.PI/180)*(90-2*cang))*Math.cos((Math.PI/180)*(cang)+Math.PI/2);
        y2vf = (((Math.pow(Math.pow(x2vi,2)+Math.pow(y2vi,2)),0.5)*Math.cos((Math.PI/180)*(90-2*cang))*(m2-m1)+2*m2*(Math.pow(Math.pow(x1vi,2)+Math.pow(y1vi,2)),0.5)*Math.cos((180/Math.PI)*((Math.PI/180)*(Math.atan(y1vi/x1vi))-cang)))*Math.sin((Math.PI/180)*(cang))/(m2+m1)) + (Math.pow(Math.pow(x2vi,2)+Math.pow(y2vi,2)),0.5)*Math.sin((Math.PI/180)*(90-2*cang))*Math.sin((Math.PI/180)*(cang)+Math.PI/2);

        console.log(x1vf, y1vf);
        if (!this.colliding) {
            this.setVelocity(x1vf*100, y1vf*100);
            this.colliding = true
        }
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

    this.render = function (context) {
        let tmpPos = {x: this.pos.x, y: this.pos.y};
        let tmpTime = this.t;
        this.updateVelocity();
        this.updatePosition();
        // console.log("Old velocity", this.vel.x, this.vel.y);
        if (this.pos.y > context.canvas.height-this.size.width) {
            this.pos.y = context.canvas.height-this.size.width;
        }
        // this.setVelocity((tmpPos.x - this.pos.x)/(tmpTime-this.t)*0.1, (this.pos.y - tmpPos.y)/(tmpTime-this.t)*0.1)

        // Draw
        context.fillStyle = this.color;
        context.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height)
    }
}
