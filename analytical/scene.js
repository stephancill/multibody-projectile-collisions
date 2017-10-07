// Time
let lastFrame = null
let deltaTime = 0
let startTime = null
let time = 0 // (s)

// Collisions
let collisions = [] // Queue
let current_collision = 0

// var projectiles = [
//     new Projectile({x: 25, y: 20, vxi: 100, vyi: 0, color: "red", name: "Projectile 1", radius: 20}),
//     new Projectile({x: 450, y: 20, vxi: -40, vyi: 0, color: "green", name: "Projectile 2", radius: 20})
// ]
var projectiles = [
    new Projectile({x: 20, y: 20, vxi: 100, vyi: 0, color: "red", name: "Projectile 1", radius: 20}),
    new Projectile({x: 420, y: 20, vxi: -100, vyi: 0, color: "green", name: "Projectile 2", radius: 20})
]

function addProjectile() {
    var px = Number(document.getElementById("inputPosX").value)
    var py = Number(document.getElementById("inputPosY").value)
    var vx = Number(document.getElementById("inputVelX").value)
    var vy = Number(document.getElementById("inputVelY").value)
    var color = document.getElementById("inputColor").value
    console.log(px, py, vx, vy, color)
    projectiles.push(new Projectile({x: px, y: py, vxi: vx, vyi: vy, color: color}))

    render()
    updateLogging(force=true)
}

function calculateCollisionEvents(time_limit) {
    var t_tot = 0
    var events = []

    var projs_initial = []

    projectiles.forEach(function(p) {
        projs_initial.push(new Projectile({x: p.pos.x, y: p.pos.y, vxi: p.vel.x, vyi: p.vel.y, color: p.color})) // TODO: Copy rest of properties
    })

    while(time_limit > t_tot) {
        var t, pr, wall

        [t, pr, wall] = [wallCol(projectiles, cc.canvas.width, cc.canvas.height), minTime(projectiles)].sort(function(a, b) {
            return (a[0] || Number.MAX_VALUE) > (b[0] || Number.MAX_VALUE)
        })[0]

        var event = {
            t,    // Time of collision
            pr,   // Projectiles involved
            wall, // Wall (optional)
            new_vels: []
        }

        projectiles.forEach(function(p) {
            p.setPositionForTime(t)
            p.setVelocityForTime(t)
        })

        if (wall) {
            event.new_vels = resolveCollision(pr[0], null, wall)
        } else {
            event.new_vels = resolveCollision(pr[0], pr[1], null)
        }

        projectiles.forEach(function(p) {
            p.captureAsInitialConditions()
        })
        // console.log(event)
        events.push(event)

        t_tot += event.t
    // console.log(events)
    }

    // Reset to initial conditions
    projectiles.forEach(function(p, i) {
        var initial = projs_initial[i]
        p.setVelocity(initial.vel.x, initial.vel.y)
        p.setPosition(initial.pos.x, initial.pos.y)
        p.captureAsInitialConditions()
    })

    // return events.sort(function(a, b) {return a.t < b.t})
    return events
}

function start() {
    collisions = calculateCollisionEvents(50)
    console.log(collisions)
    // // Time
    // lastFrame = new Date()
    // deltaTime = 0
    startTime = new Date()
    lastFrame = new Date()
    time = 0 // (s)
    current_collision = 0
    
    setInterval(update, 1000/60);    
}

function update() {
    // Time calculation
    deltaTime = new Date() - lastFrame
    lastFrame = new Date()
    time += deltaTime / 1000

    if (time >= collisions[current_collision].t) {
        var event = collisions[current_collision]
        
        time = event.t
        
        projectiles.forEach(function(p) {
            p.setPositionForTime(event.t)
            p.setVelocityForTime(event.t)
        })

        // if (event.wall) {
        //     // resolveCollision(event.pr[0], null, event.wall)
            
        // } else {
        //     // resolveCollision(event.pr[0], event.pr[1], null)
        // }
        event.pr.forEach(function (p, i) {
            // console.log(event)
            p.setVelocity(event.new_vels[i].vx, event.new_vels[i].vy)
        })

        projectiles.forEach(function(p) {
            p.captureAsInitialConditions()
        })

        time = 0

        current_collision += 1

    } else {
        projectiles.forEach(function(p) {
            p.setPositionForTime(time)
            p.setVelocityForTime(time)
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
    projectiles.forEach(function (p) {
        p.render(cc)
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
