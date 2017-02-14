const CONSTANTS = {
    g: -9.8,            // Gravity
    timeScale: 1/1000,   // Multiply time increment
    canvasScale: 0.01
}

let canonBall1 = new Projectile(CONSTANTS);
canonBall1.setPosition(150, 280);
canonBall1.setSize(20, 20);
canonBall1.setVelocity(50,100);
canonBall1.mass = 20;
canonBall1.name = "canonBall1"
canonBall1.color = "purple"

let canonBall2 = new Projectile(CONSTANTS);
canonBall2.setPosition(600-20, 280);
canonBall2.setSize(20, 20);
canonBall2.setVelocity(-200,100);
canonBall2.mass = 10;
canonBall2.name = "canonBall2"

let projectiles = [canonBall1, canonBall2];
let checked = [];
let collidingProjectiles = [];

let lastFrame = new Date();
let deltaTime = 0;

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

comparePositions = function (p1, p2) {
    // console.log("Dpos: ", Math.pow(Math.pow((this.pos.x - pos.x), 2)+Math.pow((this.pos.y - pos.y), 2), 0.5), "Radius: ", this.size.width + size.width   );
    if (Math.pow(Math.pow((p1.pos.x+p1.size.width/2 - p2.pos.x+p2.size.width/2), 2)+Math.pow((p1.pos.y+p1.size.height/2 - p2.pos.y+p2.size.height/2), 2), 0.5) <= p1.size.width/2 + p2.size.width/2) {
        // calculateCollision(p)
        console.log("col");
        return true
    } else {
        if (p1.colliding) {
            p1.colliding = false
        }
    }
}
calculateCollision = function (p1, p2) {
    if (!this.colliding) {
        console.log(p1.vel, p2.vel);
        let x1 = p1.pos.x+p1.size.width/2;
        let y1 = p1.pos.y+p1.size.height/2;
        let x1vi = p1.vel.x;
        let y1vi = p1.vel.y;
        let m1 = p1.mass;

        let x2 = p2.pos.x+p2.size.width/2;
        let y2 = p2.pos.y+p2.size.height/2;
        let x2vi = p2.vel.x;
        let y2vi = p2.vel.y;
        let m2 = p2.mass;

        let cang = 0;

        let ang1 = Math.atan(y1vi/x1vi);
        let ang2 = Math.atan(y2vi/x2vi);
        let v1 = Math.pow((Math.pow(x1vi,2)+Math.pow(y1vi,2)),0.5);
        let v2 = Math.pow((Math.pow(x2vi,2)+Math.pow(y2vi,2)),0.5);

        if (y1 == y2) {
            cang = 0*Math.PI/180;
        } else {
            cang = Math.atan((y1-y2)/(x1-x2));
        }
        // let tmp1xvf = ((v1*Math.cos(ang1-cang)*(m1-m2) + 2*m2*x2vi*Math.cos(ang2-cang)) / (m1+m2)) * Math.cos(cang) + x1vi*Math.sin(ang1-cang)*Math.cos(cang+Math.PI/2)
        // x1vf = (((v1*Math.cos(ang1-cang)*(m1-m2)+2*m2*v2*Math.cos(ang2-cang))/(m1+m2))*Math.cos(cang))+v1*Math.sin(ang1-cang)*Math.cos(cang+Math.PI/2);
        // y1vf = (((v1*Math.cos(ang1-cang)*(m1-m2)+2*m2*v2*Math.cos(ang2-cang))/(m1+m2))*Math.sin(cang))+v1*Math.sin(ang1-cang)*Math.sin(cang+Math.PI/2);
        //
        // x2vf = (((v2*Math.cos(ang2-cang)*(m2-m1)+2*m1*v1*Math.cos(ang1-cang))/(m2+m1))*Math.cos(cang))+v2*Math.sin(ang2-cang)*Math.cos(cang+Math.PI/2);
        // y2vf = (((v2*Math.cos(ang2-cang)*(m2-m1)+2*m1*v1*Math.cos(ang1-cang))/(m2+m1))*Math.sin(cang))+v2*Math.sin(ang2-cang)*Math.sin(cang+Math.PI/2);
        x1vf = ((x1vi*Math.cos(ang1-cang)*(m1-m2) + 2*m2*x2vi*Math.cos(ang2-cang)) / (m1+m2)) * Math.cos(cang) + x1vi*Math.sin(ang1-cang)*Math.cos(cang+Math.PI/2)
        y1vf = ((y1vi*Math.cos(ang1-cang)*(m1-m2) + 2*m2*y2vi*Math.cos(ang2-cang)) / (m1+m2)) * Math.sin(cang) + y1vi*Math.sin(ang1-cang)*Math.sin(cang+Math.PI/2)

        x2vf = ((x2vi*Math.cos(ang2-cang)*(m2-m1) + 2*m1*x1vi*Math.cos(ang1-cang)) / (m2+m1)) * Math.cos(cang) + x2vi*Math.sin(ang2-cang)*Math.cos(cang+Math.PI/2)
        y2vf = ((y2vi*Math.cos(ang2-cang)*(m2-m1) + 2*m1*y1vi*Math.cos(ang1-cang)) / (m2+m1)) * Math.sin(cang) + y2vi*Math.sin(ang2-cang)*Math.sin(cang+Math.PI/2)
        console.log("In: \n(obj1)", p1.name, x1vi, y1vi, m1, " \n(obj2)", p2.name, x2vi, y2vi, m2);
        console.log("Out: \n(obj1)", x1vf, y1vf, " \n(obj2)", x2vf, y2vf);

        p2.setVelocity(x2vf, y2vf);
        p1.setVelocity(x1vf, y1vf);

        p1.colliding = true;
        p2.colliding = true;
    }
}
function update() {
    if (!stop) {
        deltaTime = new Date()-lastFrame;
        lastFrame = new Date();
        updateLogging()
        cc.fillStyle = "black";
        cc.fillRect(0, 0, c.width, c.height);

        collidingProjectiles.map(pair => {
            pair.map(p => {
                p.colliding = false;
            })
        })
        for (var i = 0; i < projectiles.length; i++) {
            projectiles.map(p => {
                if (projectiles[i].name !== p.name && !checked.contains(projectiles[i])) {
                    if (comparePositions(projectiles[i], p)) {
                        console.log("Collision detected");
                        calculateCollision(projectiles[i], p);
                        collidingProjectiles.push([projectiles[i], p])
                        checked.push(...[projectiles[i], p]);
                    }
                }

            })
        }
        projectiles.map(p=> {
            // console.log(p.vel);
            p.render(cc);
        });
    }
}

function updateLogging() {
    document.getElementById("deltaTime").innerHTML = `Frame delta: ${deltaTime}ms`;

    let projectileLog = ""
    projectiles.map(p => {
        projectileLog += `
        <br><br>
        <span>Name: ${p.name}</span>
        <br>
        <span>Velocity: ${Math.round(p.vel.x*100)/100}, ${Math.round(p.vel.y*100)/100}</span>
        `
    });
    document.getElementById("projectiles").innerHTML = projectileLog;
}
