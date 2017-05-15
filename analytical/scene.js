const eq = new Equations();

// Constants
const CONSTANTS = {
    g : -9.8,
    canvasScale : 1,
    timeScale : 4
}

// Time
let lastFrame = new Date();
let deltaTime = 0;
let startTime = new Date();
let time = 0; // (s)
let pause = {
    totalStandbyTime: 0,
    standbyTime: 0,
    started: new Date(),
    paused: false
}

// Collisions
let collisions = [];
let nextCollision = {t: null, p: null};
let calculateCollisions = true;

var projectiles = [
    // new Projectile({x: 600, y: 280, vxi: 50, vyi: 50, color: "red"}),
    // new Projectile({x: 30, y: 180, vxi: 50, vyi: 25})
]

function addProjectile() {
    var px = Number(document.getElementById("inputPosX").value)
    var py = Number(document.getElementById("inputPosY").value)
    var vx = Number(document.getElementById("inputVelX").value)
    var vy = Number(document.getElementById("inputVelY").value)
    var color = document.getElementById("inputColor").value
    console.log(px, py, vx, vy, color);
    projectiles.push(new Projectile({x: px, y: py, vxi: vx, vyi: vy, color: color}))

    projectiles.map(p => {
        p.captureAsInitialConditions()
    })

    time = 0

    render()
    updateLogging(force=true)
}

function calculateCollisionTime(p, c) {
    /*
    Solves for time, given initial conditions
    */
    console.warn("calculateCollisionTime");
    this.collisions = []
    // y conditions (top, bottom)
    if (Math.abs(1/2 * CONSTANTS.g) > 0) {
        this.collisions.push({t: eq.solveQuadratic({a: 1/2 * CONSTANTS.g, b: p.vel.initial.y, c: -(p.pos.initial.y - c.height + p.radius)}), p: p, axis: "y"});
        this.collisions.push({t: eq.solveQuadratic({a: 1/2 * CONSTANTS.g, b: p.vel.initial.y, c: -p.pos.initial.y + p.radius}), p: p, axis: "y"});
    } else {
        // a = 0
        if (p.vel.initial.y != 0) {
            let t1 = (0-p.pos.initial.y+p.radius)/p.vel.initial.y;
            let t2 = (c.height-p.pos.initial.y-p.radius)/p.vel.initial.y;
            if (t1 > 0) {
                this.collisions.push({t: t1, p: p, axis: "y"});
            }
            if (t2 > 0) {
                this.collisions.push({t: t2, p: p, axis: "y"});
            }
        }
    }

    // x conditions (right, left)
    if (p.vel.initial.x != 0) {
        let t1 = (0-p.pos.initial.x+p.radius)/p.vel.initial.x;
        let t2 = (c.width-p.pos.initial.x-p.radius)/p.vel.initial.x;
        if (t1 > 0) {
            this.collisions.push({t: t1, p: p, axis: "x"});
        }
        if (t2 > 0) {
            this.collisions.push({t: t2, p: p, axis: "x"});
        }
    }
    // this.collisions.push({t: eq.solveLinear({y: c.width-p.radius, m: p.vel.initial.x, c: p.pos.initial.x}), p: p, axis: "x"});
    // this.collisions.push({t: eq.solveLinear({y: 0+p.radius, m: p.vel.initial.x, c: p.pos.initial.x}), p: p, axis: "x"});
    this.collisions.map(c => {
        if (c.t != null && c.t > 0) {
            collisions.push(c);
        }
    })
    pause.totalStandbyTime = 0;
}

function collide(collision) {
    console.warn("Collided");
    let p = collision.p;
    let t = collision.t;

    time = t
    // Update projectile position precisely
    // p.setPositionForTime(t); // causes problems

    // Set global time
    time = 0;
    // startTime = new Date();

    // Change projectile initial conditions
    projectiles.map(tmp => {tmp.captureAsInitialConditions()});

    // Inverse velocity when hits edge
    if (collision.axis === "x") {
        p.setInitialVelocity(-p.vel.x, p.vel.y);
    } else if (collision.axis === "y") {
        p.setInitialVelocity(p.vel.x, -p.vel.y);
    }

    // Reset collision variables
    calculateCollisions = true;
    nextCollision = {t: null, p: null};
    collisions = [];
    // stop = true
}

function update() {
    if (!stop) {
        // Time calculation
        let newTime = new Date();


        // Reset pause
        if (pause.paused) {
            pause.paused = false;
            pause.totalStandbyTime += pause.standbyTime;
            lastFrame = newTime;
        }
        deltaTime = newTime-lastFrame;
        lastFrame = newTime;

        // time = (newTime - startTime - pause.totalStandbyTime) * CONSTANTS.timeScale / 1000; // Time in seconds
        time += deltaTime * CONSTANTS.timeScale / 1000;
        // console.log(time, " :: ", newTime, startTime, pause.totalStandbyTime);
        if (time >= nextCollision.t && nextCollision.t != null) {
            collide(nextCollision)
        }

        // Render background
        render()

        // Render projectiles
        projectiles.map(p => {
            p.setPositionForTime(time);
            p.render(cc);
            // Collision calculation
            if (calculateCollisions) {
                calculateCollisionTime(p, c);
            }
        });
        if (calculateCollisions) {
            // Sort collisions
            collisions = collisions.sort(function(a, b) {  return a.t - b.t;});
            if (collisions.length > 0) {
                nextCollision = collisions[0];
            }
            calculateCollisions = false;
            console.table(collisions);
            console.warn("Next collision: ", nextCollision.t);
        }
        // stop = true
    } else {
        // Paused
        if (!pause.paused) {
            // First frame paused
            pause.paused = true;
            pause.started = new Date();
        } else {
            pause.standbyTime = new Date() - pause.started;
        }
    }
    // Display statistics
    updateLogging();
}

function render() {
    // Render background
    cc.fillStyle = "black";
    cc.fillRect(0, 0, c.width, c.height);

    // Render projectiles
    projectiles.map(p => {
        p.render(cc);
    });
}

function updateLogging(force=false) {
    document.getElementById("time").innerHTML = `
        Frame delta: ${deltaTime}ms
        <br>
        Time: ${Math.round(time*100)/100}s
    `;

    let projectileLog = ""
    if (!stop || force) {
        projectiles.map(p => {
            projectileLog += `
            <br><br>
            <span>Name: ${p.name}</span>
            <br>
            <span>Position (mx, my): ${Math.round(p.pos.x*100)/100}, ${Math.round(p.pos.y*100)/100}</span>
            <br>
            <span>Velocity (m/s): ${Math.round(p.vel.x*100)/100}, ${Math.round(p.vel.y*100)/100}</span>
            <br>
            <span>Colliding: ${p.colliding}</span>
            `
        });
        document.getElementById("projectiles").innerHTML = projectileLog;
    }

}
