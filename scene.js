const CONSTANTS = {
    g: -9.8,            // Gravity
    timeScale: 1/1000,   // Multiply time increment
    canvasScale: 0.01
}

let canonBall1 = new Projectile(CONSTANTS);
canonBall1.setPosition(0, 280);
canonBall1.setSize(20, 20);
canonBall1.setVelocity(100, 100);
canonBall1.name = "canonBall1"

let canonBall2 = new Projectile(CONSTANTS);
canonBall2.setPosition(600-20, 280);
canonBall2.setSize(20, 20);
canonBall2.setVelocity(-100, 100);
canonBall2.name = "canonBall2"

let projectiles = [canonBall1, canonBall2];

let lastFrame = new Date();
let deltaTime = 0;
function update() {
    if (!stop) {
        deltaTime = new Date()-lastFrame;
        lastFrame = new Date();
        updateLogging()
        cc.fillStyle = "black";
        cc.fillRect(0, 0, c.width, c.height);
        projectiles.map(p=> {
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
