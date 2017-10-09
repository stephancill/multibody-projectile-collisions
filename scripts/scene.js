// Time
let lastFrame = null
let deltaTime = 0
let startTime = null
let time = 0 // (s)
let time_total = 0
let stop = false
let pause = false

// Collisions
let next_collision = null

// Constants
let G = -100

// Programmatically added projectiles
var projectiles_to_add = [
    new Projectile({x: 40, y: 40, vxi: 150, vyi: -300, color: "red", radius: 40, mass: 40}),
    new Projectile({x: 490, y: 200, vxi: 0, vyi: 200, color: "green", radius: 20, mass: 20}),
    new Projectile({x: 20, y: 380, vxi: -100, vyi: 250, color: "blue", radius: 10, mass: 10})
]

var projectiles_map = {}
var projectiles = []

// Add programmatically added projectiles
for (var i = 0; i < projectiles_to_add.length; i++) {
    addProjectile(projectiles_to_add[i])
}

// Clear queue
projectiles_to_add = []

/**
 * Add, register projectile to the scene and render
 * @param {Projectile} pr 
 * @param {String} id 
 */
function addProjectile(pr, id) {
    var p = pr
    
    // Instantiate new Projectile from GUI
    if (!p) {
        var px = Number(document.getElementById("inputPosX").value)
        var py = Number(document.getElementById("inputPosY").value)
        var vx = Number(document.getElementById("inputVelX").value)
        var vy = Number(document.getElementById("inputVelY").value)
        var color = document.getElementById("inputColor").value

        p = new Projectile({x: px, y: cc.canvas.height - py, vxi: vx, vyi: vy, color: color, radius: 20})
    }

    // Set or assign new ID
    if (id) {
        p.setID(id)
        projectiles_map[id] = p
        projectiles.push(id)
    } else {
        var i = Object.keys(projectiles_map).length
        p.setID(i)
        projectiles_map[i] = p
        projectiles.push(i)
    }

    // Render the new projectile if canvas is available
    if (cc) {
        p.render(cc)
    }
}

/**
 * Calculates and returns an event object that contains 
 * information about the next collision event
 * @returns {{Float, [Projectile], String, {ID: {vx, vy}}}}
 */
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

/**
 * Start the simulation
 */
function start() {
    next_collision = calulateNextEvent()

    startTime = new Date()
    lastFrame = new Date()
    time = 0 // (s)
    time_total = 0

    stop = false
    setInterval(update, 1000/120)
}

/**
 * Called on ever frame update
 */
function update() {
    // Time calculation
    deltaTime = new Date() - lastFrame
    lastFrame = new Date()
    if (!stop) {
        time += deltaTime / 1000
        time_total += deltaTime / 1000

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
    updateLogging(projectiles_map, projectiles)
}

/**
 * Render scene and all projectiles
 */
function render() {
    // Render background
    cc.fillStyle = "black"
    cc.fillRect(0, 0, cc.canvas.width, cc.canvas.height)

    // Render projectiles
    projectiles.forEach(function (i) {
        projectiles_map[i].render(cc)
    })
}

/**
 * Update information about scene and projectiles
 * @param {{ID: Projectile}} projectile_map - Hashmap of projectiles
 * @param {[String]} projectiles - Array of Projectile IDs
 */
function updateLogging(projectile_map, projectiles) {
    document.getElementById("time").innerHTML = `
        Frame delta: ${deltaTime}ms
        <br>
        Time: ${Math.round(time_total*100)/100}s
        <br>
        Next collision in ${next_collision.t}s between ${next_collision.pr.length === 1 ? `ID ${next_collision.pr[0]} and wall` : `ID ${next_collision.pr[0]} and ID ${next_collision.pr[1]}`}
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
    `

}

/**
 * Fill the scene with projectiles with a random size, velocity and color
 */
function fun() {
    projectiles_map = {}
    projectiles = []
    render()
    var colors = ["green", "purple", "blue", "red", "yellow"]
    
    for(var i = 25; i < cc.canvas.width-20; i+=100) {
        for(var j = 25; j < cc.canvas.height-20; j+=100) {
           var p = new Projectile({x: i, y: cc.canvas.height - j, vxi: getRandomArbitrary(-5000, 5000), vyi: getRandomArbitrary(-5000, 5000), color: colors[Math.round(getRandomArbitrary(0, colors.length-1))], radius: getRandomArbitrary(5, 25)})
           addProjectile(p)
        }
    }
}
