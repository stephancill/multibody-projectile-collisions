function Projectile ({x, y, vxi, vyi, color="white", mass=10, radius=20, name="Untitled Projectile"}) {
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
        context.arc(this.pos.x*CONSTANTS.canvasScale, this.pos.y*CONSTANTS.canvasScale, this.radius*CONSTANTS.canvasScale, startPoint, endPoint, true);
        context.fill();
        context.closePath();
    }
}

function solveQuad(a, b, c) {
    if (a == 0) {
		if (b == 0) {
			if (c == 0) {
                return null
            } else {
                return null
            }
        } else{
			if (-c/b >= 0) {
                return -c/b
            } else { 
                return null
            }
        }
    }
	else {
		if (Math.pow(b, 2)-4*a*c < 0) {
            return null
        } else if (Math.pow(b, 2)-4*a*c == 0) {
            return -b/(2*a)
        } else {
            var times = [(-b+Math.pow((Math.pow(b, 2)-4*a*c),0.5))/(2*a),(-b-Math.pow((Math.pow(b, 2)-4*a*c),0.5))/(2*a)].filter(function (x) { return x >= 0 } )
			if (times.length > 0) {
                return Math.min(...times)
            } else {
                return null
            }
                
        }
    }
}

function timeUntilCollision(p1, p2) {
    X = p1.pos.x - p2.pos.x
	Y = p1.pos.y - p2.pos.y
	VX = p1.vel.x - p2.vel.x
	VY = p1.vel.y - p2.vel.y
	Rtot = p1.radius + p2.radius

	a = Math.pow(VX,2) + Math.pow(VY,2)
	b = 2*X*VX + 2*Y*VY
	c = Math.pow(X,2) + Math.pow(Y,2) - Math.pow(Rtot,2)

    console.log(a, b, c);

	t = solveQuad(a,b,c)

	if (t) {
        var  dist = (X + p1.vel.x * (t+Math.pow(10,-4)) - p2.vel.x * Math.pow((t+Math.pow(10,-4))),2) + (Y + p1.vel.y * (t+Math.pow(10,-4)) - p2.vel.y * Math.pow((t+Math.pow(10,-4))),2)
		// this is to check if they collide by simulating their positions 10**-4 s after "collision"
		if (dist < Math.pow((p1.radius+p2.radius), 2)) {
            return t
        } else {
            return null
        }
    } else {
        return null
    }
}

function resolveCollision(p1, p2, wall) {
    // TODO: Unpack tuple js
    if (wall) {
        if (wall == 'x') {
            p1.setVelocity(-p1["vx"], p1["vy"])
            return [-p1["vx"], p1["vy"]]            
        } else {
            p1.setVelocity(p1["vx"], -p1["vy"])
            return [p1["vx"], -p1["vy"]]
        }
    } 

    var a

    if (p1.pos.x == p2.pos.x) {
        a = 0
    } else {
        a = Math.atan((p1.pos.y-p2.pos.y)/(p1.pos.x-p2.pos.x))
    }

    var m1 = p1.mass
    var m2 = p2.mass

    var v1 = Math.cos(a)*p1.vel.x + Math.sin(a)*p1.vel.y
    var v2 = Math.cos(a)*p2.vel.x + Math.sin(a)*p2.vel.y

    var u1 = (2*v2 + v1*m1/m2-v1)/(1+m1/m2)
    var u2 = (2*v1 + v2*m2/m1-v2)/(1+m2/m1)

    var yu1 = Math.cos(a)*p1.vel.y + Math.sin(a)*p1.vel.x
    var yu2 = Math.cos(a)*p2.vel.y + Math.sin(a)*p2.vel.x

    var newvx1 = yu1*Math.sin(a)+u1*Math.cos(a)
    var newvy1 = yu1*Math.cos(a)+u1*Math.sin(a)

    var newvx2 = yu2*Math.sin(a)+u2*Math.cos(a)
    var newvy2 = yu2*Math.cos(a)+u2*Math.sin(a)

    p1.setVelocity(newvx1, newvy1)
    p2.setVelocity(newvx2, newvy2)

    return [newvx1, newvy1, newvx2, newvy2]
}


var p1 = new Projectile({x: 5, y: 5, vxi: 1, vyi: 0, color: "red"})
var p2 = new Projectile({x: 20, y: 5, vxi: -1, vyi: 0, color: "red"})

var projs = [p1, p2]

// TODO: Fix
var t = timeUntilCollision(p1,p2)

console.log(t);
console.log(p1.vel, p2.vel);
projs.map(function(p) {
    p.setPositionForTime(t)
    p.setVelocityForTime(t)
})
console.log("Pos", p1.pos, p2.pos);

resolveCollision(p1, p2, null)
console.log(p1.vel, p2.vel);

// def minTime(projectiles):
// colliding_objects = None
// time_col = None

// for i in range(len(projectiles)-1):
//     for j in range(i+1,len(projectiles)):
//         time_new = timeUntilCollision(projectiles[i], projectiles[j])
//         if time_new != None:	
//             if time_col != None:	
//                 if time_new < time_col:
//                     time_col = time_new
//                     colliding_objects = [i,j]
//             else:
//                 time_col = time_new
//                 colliding_objects = [i,j]
                
// if time_col != None:
//     return (time_col, (projectiles[colliding_objects[0]], projectiles[colliding_objects[1]]), None)
// else:
//     return (None, None, None)