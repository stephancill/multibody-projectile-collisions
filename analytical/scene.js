// Time
let lastFrame = null
let deltaTime = 0
let startTime = null
let time = 0 // (s)

// Collisions
let next_collision = null
let current_collision = 0

// var projectiles = [
//     new Projectile({x: 25, y: 20, vxi: 100, vyi: 0, color: "red", name: "Projectile 1", radius: 20}),
//     new Projectile({x: 450, y: 20, vxi: -40, vyi: 0, color: "green", name: "Projectile 2", radius: 20})
// ]
var projectiles_map = {
    0: new Projectile({x: 20, y: 20, vxi: 500, vyi: 0, color: "red", name: "Projectile 1", radius: 20}),
    // 1: new Projectile({x: 420, y: 20, vxi: -1000, vyi: 0, color: "green", name: "Projectile 2", radius: 20}),
    2: new Projectile({x: 980, y: 20, vxi: -500, vyi: 0, color: "blue", name: "Projectile 3", radius: 20})
}

var projectiles = Object.keys(projectiles_map).map(function (i) {projectiles_map[i].id = i; return i})

function addProjectile() {
    var px = Number(document.getElementById("inputPosX").value)
    var py = Number(document.getElementById("inputPosY").value)
    var vx = Number(document.getElementById("inputVelX").value)
    var vy = Number(document.getElementById("inputVelY").value)
    var color = document.getElementById("inputColor").value
    console.log(px, py, vx, vy, color)
    // projectiles.push(new Projectile({x: px, y: py, vxi: vx, vyi: vy, color: color}))
    
    var p = new Projectile({x: px, y: py, vxi: vx, vyi: vy, color: color})
    var i = Object.keys(projectiles_map).length-1
    p.id = i
    projectiles_map[i] = p
    projectiles.push(p)

    render()
    updateLogging(force=true)
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
        console.log(_a, _b)
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
    
    setInterval(update, 1000/60)   
}

function update() {
    // Time calculation
    deltaTime = new Date() - lastFrame
    lastFrame = new Date()
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
    } else {
        projectiles.forEach(function(p) {
            projectiles_map[p].setPositionForTime(time)
            projectiles_map[p].setVelocityForTime(time)
        })
    }

    // Render background and projectiles
    render()

    // Display statistics
    updateLogging()
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
    if (!stop || force) {
        projectiles.forEach(p => {
            projectileLog += `
            <br><br>
            <span>Name: ${p.name}</span>
            <br>
            <span>Position (mx, my): ${Math.round(p.pos.x*100)/100}, ${Math.round(p.pos.y*100)/100}</span>
            <br>
            <span>Velocity (m/s): ${Math.round(p.vel.x*100)/100}, ${Math.round(p.vel.y*100)/100}</span>
            `
        })
        document.getElementById("projectiles").innerHTML = projectileLog
        document.getElementById("projectiles").innerHTML += `
        <br>
        <span>Next collision time: ${Math.round(nextCollision.t*100)/100}s</span>
        `
    }

}
