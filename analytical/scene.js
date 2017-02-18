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

let projectiles = [
    // new Projectile({x: 600, y: 280, vxi: 10, vyi: 100, color: "red"}),
    new Projectile({x: 30, y: 180, vxi: 100, vyi: 100})
]

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
    console.table(this.collisions);
    this.collisions.map(c => {
        if (c.t != null) {
            collisions.push(c);
        }
    })
}

function collide(collision) {
    console.warn("Collided");
    let p = collision.p;
    let t = collision.t;

    // Set global time
    time = 0;
    startTime = new Date();

    // Update projectile position precisely
    p.setPositionForTime(t);

    // Update last collision time
    p.timeOfLastCollision = t;

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
}

function update() {
    if (!stop) {
        // Reset pause
        if (pause.paused) {
            pause.paused = false;
            pause.totalStandbyTime += pause.standbyTime;
        }

        // Time calculation
        let newTime = new Date();
        deltaTime = newTime-lastFrame;
        lastFrame = newTime;
        time = (newTime - startTime - pause.totalStandbyTime) * CONSTANTS.timeScale / 1000; // Time in seconds
        if (time >= nextCollision.t && nextCollision.t != null) {
            collide(nextCollision)
        }

        // Render background
        cc.fillStyle = "black";
        cc.fillRect(0, 0, c.width, c.height);

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
            // Remove nil collisions
            collisions = collisions.sort(function(a, b) {  return a.t - b.t;}); // Remove nil
            nextCollision = collisions[0];
            calculateCollisions = false;
            console.table(collisions);
            console.warn("Next collision: ", nextCollision.t);
        }

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

function updateLogging() {
    document.getElementById("time").innerHTML = `
        Frame delta: ${deltaTime}ms
        <br>
        Time: ${Math.round(time*100)/100}s
    `;

    let projectileLog = ""
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
