// Time
let lastFrame = null
let deltaTime = 0
let startTime = null
let time = 0 // (s)
let stop = false
let pause = false

// Collisions
let next_collision = null
let current_collision = 0

// Constants
let G = -10

var projectiles_map = {
  //  0: new Projectile({x: 20, y: 20, vxi: 100, vyi: -100, color: "red", name: "Projectile 1", radius: 20}),
    1: new Projectile({x: 490, y: 200, vxi: 0, vyi: 0, color: "green", name: "Projectile 2", radius: 20}),
  //  2: new Projectile({x: 20, y: 380, vxi: -100, vyi: 100, color: "blue", name: "Projectile 3", radius: 20})
}

var projectiles = Object.keys(projectiles_map).map(function (i) {projectiles_map[i].id = i; return i})


function addProjectile(id, pr) {
    var p = pr
    if (!p) {
        var px = Number(document.getElementById("inputPosX").value)
        var py = Number(document.getElementById("inputPosY").value)
        var vx = Number(document.getElementById("inputVelX").value)
        var vy = Number(document.getElementById("inputVelY").value)
        var color = document.getElementById("inputColor").value

        p = new Projectile({x: px, y: cc.canvas.height - py, vxi: vx, vyi: vy, color: color, radius: 20})
    }

    if (id) {
        p.id = id
        projectiles_map[id] = p
        projectiles.push(id)
    } else {
        var i = Object.keys(projectiles_map).length
        p.id = i
        projectiles_map[i] = p
        projectiles.push(i)
    }

    render()
}

function calulateNextEvent() {
    var projs_initial = {}

    projectiles.forEach(function(i) {
        var p = projectiles_map[i]
        projs_initial[i] = {x: p.pos.x, y: p.pos.y, vxi: p.vel.x, vyi: p.vel.y, color: p.color} // TODO: Copy rest of properties
    })

    var t, pr, wall

    [t, pr, wall] = [wallCol(projectiles, cc.canvas.width, cc.canvas.height), minTime(projectiles)].sort(function(a, b) {
        var _a = a[0]
        var _b = b[0]
        if (_a === null) { _a = Number.MAX_VALUE }
        if (_b === null) { _b = Number.MAX_VALUE }
        return _a > _b
    })[0]

    var event = {
        t,    // Time of collision
        pr,   // Projectiles involved
        wall, // Wall (optional)
        new_vels: []
    }

    projectiles.forEach(function(i) {
        projectiles_map[i].setPositionForTime(t)
        projectiles_map[i].setVelocityForTime(t)
    })

    if (wall) {
        event.new_vels = resolveCollision(projectiles_map[pr[0]], null, wall)
    } else {
        event.new_vels = resolveCollision(projectiles_map[pr[0]], projectiles_map[pr[1]], null)
    }

    pr.forEach(function (p) {
        // console.log(p, i)
        projectiles_map[p].setVelocity(event.new_vels[p].vx, event.new_vels[p].vy)
    })

    projectiles.forEach(function(p) {
        projectiles_map[p].captureAsInitialConditions()
    })

    // Reset to initial conditions
    projectiles.forEach(function(p) {
        var initial = projs_initial[p]
        projectiles_map[p].setVelocity(initial.vxi, initial.vyi)
        projectiles_map[p].setPosition(initial.x, initial.y)
        projectiles_map[p].captureAsInitialConditions()
    })
    // console.log(event)
    return event
}


function start() {
    next_collision = calulateNextEvent()

    startTime = new Date()
    lastFrame = new Date()
    time = 0 // (s)
    current_collision = 0

    stop = false
    setInterval(update, 1000/60)
}

function update() {
    // Time calculation
    deltaTime = new Date() - lastFrame
    lastFrame = new Date()
    if (!stop) {
        time += deltaTime / 1000

        if (time >= next_collision.t) {
            var event = next_collision

            time = event.t
            console.log(event)

            projectiles.forEach(function(p) {
                projectiles_map[p].setPositionForTime(event.t)
                projectiles_map[p].setVelocityForTime(event.t)
            })

            event.pr.forEach(function (p) {
                projectiles_map[p].setVelocity(event.new_vels[p].vx, event.new_vels[p].vy)
            })

            projectiles.forEach(function(p) {
                projectiles_map[p].captureAsInitialConditions()
            })

            time = 0

            next_collision = calulateNextEvent()
            if (pause) {
              stop = true
            }
        } else {
            projectiles.forEach(function(p) {
                projectiles_map[p].setPositionForTime(time)
                projectiles_map[p].setVelocityForTime(time)
            })
        }
    }


    // Render background and projectiles
    render()

    // Display statistics
    // updateLogging()
}

function render() {
    // Render background
    cc.fillStyle = "black"
    cc.fillRect(0, 0, cc.canvas.width, cc.canvas.height)

    // Render projectiles
    projectiles.forEach(function (i) {
        projectiles_map[i].render(cc)
    })
}

function updateLogging(force=false) {
    document.getElementById("time").innerHTML = `
        Frame delta: ${deltaTime}ms
        <br>
        Time: ${Math.round(time*100)/100}s
    `

    let projectileLog = ""
    projectiles.forEach(i => {
        projectileLog += `
        <br><br>
        <span>Name: ${projectile_map[i].name}</span>
        <br>
        <span>Position (mx, my): ${Math.round(projectile_map[i].pos.x*100)/100}, ${Math.round(projectile_map[i].pos.y*100)/100}</span>
        <br>
        <span>Velocity (m/s): ${Math.round(projectile_map[i].vel.x*100)/100}, ${Math.round(projectile_map[i].vel.y*100)/100}</span>
        `
    })
    document.getElementById("projectiles").innerHTML = projectileLog
    document.getElementById("projectiles").innerHTML += `
    <br>
    <span>Next collision time: ${Math.round(nextCollision.t*100)/100}s</span>
    `

}
