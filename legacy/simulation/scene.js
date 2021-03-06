const CONSTANTS = {
    g: -9.8,            // Gravity
    timeScale: 1/1000,   // Multiply time increment
    canvasScale: 0.01
}
// TODO: Collisions with walls
let canonBall1 = new Projectile(CONSTANTS);
canonBall1.setPosition(40, 280);
canonBall1.setSize(20, 20);
canonBall1.setVelocity(150,150);
// =======
// canonBall1.setVelocity(400,250);
// >>>>>>> Analytical
canonBall1.mass = 10;
canonBall1.name = "canonBall1"
canonBall1.color = "purple"

let canonBall2 = new Projectile(CONSTANTS);
canonBall2.setPosition(600-20, 280);
canonBall2.setSize(20, 20);
canonBall2.setVelocity(-150,150);
// =======
// canonBall2.setVelocity(-400,250);
// >>>>>>> Analytical
canonBall2.mass = 10;
canonBall2.name = "canonBall2"
canonBall2.color = "white"

let canonBall3 = new Projectile(CONSTANTS);
canonBall3.setPosition(20, 20);
canonBall3.setSize(20, 20);
canonBall3.setVelocity(200,500);
canonBall3.mass = 10;
canonBall3.name = "canonBall3"
canonBall3.color = "yellow"

let canonBall4 = new Projectile(CONSTANTS);
canonBall4.setPosition(100, 280);
canonBall4.setSize(20, 20);
canonBall4.setVelocity(200,150);
canonBall4.mass = 10;
canonBall4.name = "canonBall4"
canonBall4.color = "pink"

let projectiles = [canonBall1, canonBall2, canonBall3];
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
    if (Math.pow(Math.pow((p1.pos.x - p2.pos.x), 2)+Math.pow((p1.pos.y - p2.pos.y), 2), 0.5) < p1.size.width + p2.size.width) {
        // calculateCollision(p)
        console.log("col");
        return true
    } else {
        if (p1.colliding) {
            p1.colliding = false
        }
        return false
    }
}
calculateCollision = function (p1, p2) {
    if (!this.colliding) {
        // console.log(p1.pos.x, p1.pos.y);
        // console.log(p1.pos.x, p1.pos.y);

        // console.log(p1.vel, p2.vel);
        let x1 = p1.pos.x;
        let y1 = p1.pos.y;
        let x1vi = p1.vel.x;
        let y1vi = p1.vel.y;
        let m1 = p1.mass;

        let x2 = p2.pos.x;
        let y2 = p2.pos.y;
        let x2vi = p2.vel.x;
        let y2vi = p2.vel.y;
        let m2 = p2.mass;

        let tcol = 0;

        let a = Math.pow((x1vi-x2vi),2)+Math.pow((y1vi-y2vi),2);
        let b = 2*(x1-x2)*(x1vi-x2vi)+2*(y1-y2)*(y1vi-y2vi);
        let c = Math.pow((x1-x2),2)+Math.pow((y1-y2),2)-Math.pow((p1.size.width+p2.size.width),2);

        console.log(Math.pow(b,2)-4*a*c);

        tcol = (-1*b-Math.pow(Math.pow(b,2)-4*a*c,0.5))/(2*a);

        if (tcol < 0) {

          tcol = (-1*b+Math.pow(Math.pow(b,2)-4*a*c,0.5))/(2*a);

        }

        console.log('Time: ',tcol);

        x1 = p1.pos.x + p1.vel.x*tcol + 1/2*p1.a*Math.pow(tcol,2);
        y1 = p1.pos.y + p1.vel.y*tcol + 1/2*p1.g*Math.pow(tcol,2);
        // x doesn't change
        yvi1 = p1.vel.y + CONSTANTS.g*tcol;

        x2 = p2.pos.x + p2.vel.x*tcol + 1/2*p2.a*Math.pow(tcol,2);
        y2 = p2.pos.y + p2.vel.y*tcol + 1/2*p2.g*Math.pow(tcol,2)
        // x doesn't change
        yvi2 = p2.vel.y + CONSTANTS.g*tcol;
        //
        let cang = 0;
        //
        let ang1 = Math.atan(y1vi/x1vi);
        let ang2 = Math.atan(y2vi/x2vi);
        let v1 = Math.pow((Math.pow(x1vi,2)+Math.pow(y1vi,2)),0.5);
        let v2 = Math.pow((Math.pow(x2vi,2)+Math.pow(y2vi,2)),0.5);

        if (x1 === x2) {
            cang = 90*Math.PI/180;
        } else {
            cang = Math.atan((y1-y2)/(x1-x2));
        }
        // cang = Math.round(cang*100)/100
        console.log("CANG: ", cang*180/Math.PI);

        x1vf = ((x1vi*Math.cos(ang1-cang)*(m1-m2) + 2*m2*x2vi*Math.cos(ang2-cang)) / (m1+m2)) * Math.cos(cang) + x1vi*Math.sin(ang1-cang)*Math.cos(cang+Math.PI/2)
        y1vf = ((y1vi*Math.cos(ang1-cang)*(m1-m2) + 2*m2*y2vi*Math.cos(ang2-cang)) / (m1+m2)) * Math.sin(cang) + y1vi*Math.sin(ang1-cang)*Math.sin(cang+Math.PI/2)

        x2vf = ((x2vi*Math.cos(ang2-cang)*(m2-m1) + 2*m1*x1vi*Math.cos(ang1-cang)) / (m2+m1)) * Math.cos(cang) + x2vi*Math.sin(ang2-cang)*Math.cos(cang+Math.PI/2)
        y2vf = ((y2vi*Math.cos(ang2-cang)*(m2-m1) + 2*m1*y1vi*Math.cos(ang1-cang)) / (m2+m1)) * Math.sin(cang) + y2vi*Math.sin(ang2-cang)*Math.sin(cang+Math.PI/2)
        console.log("In: \n(obj1)", p1.name, x1vi, y1vi, m1, " \n(obj2)", p2.name, x2vi, y2vi, m2);
        console.log("Out: \n(obj1)", x1vf, y1vf, " \n(obj2)", x2vf, y2vf);

        console.log(p1.pos.x, p1.pos.y);

        p2.setVelocity(x2vf, y2vf);
        p1.setVelocity(x1vf, y1vf);

        console.log(p1.pos.x, p1.pos.y);

        p1.colliding = true;
        p2.colliding = true;

    }
}
function update() {
    if (!stop) {
        // console.log(checked);
        // checked = []
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

                        let p1 = projectiles[i];
                        let p2 = p;
                        p2.setVelocity(-p2.vel.x, -p2.vel.y);
                        p1.setVelocity(-p1.vel.x, -p1.vel.y);

                        while (comparePositions(p1, p2)) {
                            console.log("asdfasdfasdfasdfadsfasdfsd");
                            p1.updatePosition();
                            p2.updatePosition();
                        }
                        // p1.updatePosition();
                        // p2.updatePosition();
                        p2.setVelocity(-p2.vel.x, -p2.vel.y);
                        p1.setVelocity(-p1.vel.x, -p1.vel.y);

                        calculateCollision(projectiles[i], p);
                        collidingProjectiles.push([projectiles[i], p])
                        checked.push(...[projectiles[i], p]);
                    }
                }

            })
        }
        checked = []
        projectiles.map(p=> {
            // console.log(p.t);
            p.render(cc);
            // p.setComputeVelocity();
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
        <span>Position: ${Math.round(p.pos.x*100)/100}, ${Math.round(p.pos.y*100)/100}</span>
        <br>
        <span>Velocity: ${Math.round(p.vel.x*100)/100}, ${Math.round(p.vel.y*100)/100}</span>
        <br>
        <span>Colliding: ${p.colliding}</span>
        `
    });
    document.getElementById("projectiles").innerHTML = projectileLog;
}
