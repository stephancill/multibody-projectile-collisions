// Constants
const CONSTANTS = {
    g : 0,
    canvasScale : 0.001
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

let projectiles = [new Projectile({x: 20, y: 280, vxi: 50, vyi: -50})]

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
        time = newTime - startTime - pause.totalStandbyTime;

        // Render background
        cc.fillStyle = "black";
        cc.fillRect(0, 0, c.width, c.height);

        // Render projectiles
        projectiles.map(p => {
            p.setPositionForTime(time);
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
        <span>Position (mx, my): ${Math.round(p.pos.x*CONSTANTS.canvasScale*100)/100}, ${Math.round(p.pos.y*CONSTANTS.canvasScale*100)/100}</span>
        <br>
        <span>Velocity (m/s): ${Math.round(p.vel.x*100)/100}, ${Math.round(p.vel.y*100)/100}</span>
        <br>
        <span>Colliding: ${p.colliding}</span>
        `
    });
    document.getElementById("projectiles").innerHTML = projectileLog;
}
