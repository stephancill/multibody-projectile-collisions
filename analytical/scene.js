// Constants
const CONSTANTS = {
    g : -9.8,
    canvasScale : 1,
    timeScale : 2
}

// Time
let lastFrame = new Date();
let deltaTime = 0;
let startTime = new Date();
let time = 0;
let pause = {
    totalStandbyTime: 0,
    standbyTime: 0,
    started: new Date(),
    paused: false
}

let projectiles = [
    new Projectile({x: 20, y: 280, vxi: 50, vyi: 100})
    // new Projectile({x: 600, y: 280, vxi: -50, vyi: 50, color: "red"})
]

function calculateCollisionTime({a, Vi, Pd, Pi}) {
    /*
    Quadratic equation
        a = accelleration
        Vi = initial velocity
        Pd = position delta
        Pi = position initial
    */
    console.warn("calculateCollisionTime");
    this.a = 1/2 * a;
    this.b = Vi;
    this.c = -(Pd + Pi);

    let descriminant = Math.pow(Math.pow(this.b, 2) - 4*this.a*this.c, 0.5);
    if (descriminant >= 0) {
        let x1 = (-this.b + descriminant)/(2*this.a);
        let x2 = (-this.b - descriminant)/(2*this.a);
        if (x1 > 0) {
            return x1;
        } else {
            return x2;
        }
    } else {
        return null;
    }
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
        time = (newTime - startTime - pause.totalStandbyTime) * CONSTANTS.timeScale;

        // Render background
        cc.fillStyle = "black";
        cc.fillRect(0, 0, c.width, c.height);

        // Render projectiles
        projectiles.map(p => {
            p.setPositionForTime(time/1000);
            p.render(cc);
        })
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
        Time: ${time/1000}s
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
