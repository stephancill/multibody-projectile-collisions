// Time
var lastFrame = null
var deltaTime = 0
var startTime = null
var time = 0 // (s)
var time_total = 0
var stop = false
var pause = false
var timer_id

// Collisions
var next_collision = null

// Constants
var G = -100

// Programmatically added projectiles
var projectiles_to_add = [], projectiles_map = {}, projectiles =[]

var current_preset = null

/**
 * Add, register projectile to the scene and render
 * @param {Projectile} pr 
 * @param {String} id 
 */
function addProjectile(pr, id) {
    var p = pr

    if (p.type) {
        p = null
    }
    
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

    // Check if not already started
    if (!startTime) {
        next_collision = calulateNextEvent()
        
        startTime = new Date()
        lastFrame = new Date()
        time = 0 // (s)
        time_total = 0
    
        stop = false
        timer_id = setInterval(update, 1000/120)

        document.getElementById("load").disabled = true
    }
    
}

function reset() {
    // Cancel update
    clearInterval(timer_id)
    
    // Enable preset load button
    document.getElementById("load").disabled = false

    // Time
    lastFrame = null
    deltaTime = 0
    startTime = null
    time = 0 // (s)
    time_total = 0
    stop = false
    pause = false

    // Collisions
    next_collision = null

    // Load the selected preset
    loadScene(current_preset)

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
    cc.canvas.width  = window.innerWidth - 40;
    cc.canvas.height = window.innerHeight/2

    // Render background
    cc.fillStyle = "black"
    cc.fillRect(0, 0, cc.canvas.width, cc.canvas.height)

    // Render projectiles
    projectiles.forEach(function (i) {
        projectiles_map[i].render(cc)
    })

    // Update on-canvas logging
    updateCanvasLogging(cc)
}

/**
 * Update information about scene and projectiles
 * @param {{ID: Projectile}} projectile_map - Hashmap of projectiles
 * @param {[String]} projectiles - Array of Projectile IDs
 */
function updateLogging(projectile_map, projectiles) {

    var projectileLog = ""
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
}

/**
 * Update information about time and collisions on the canvas scene
 * @param {Canvas} cc 
 */
function updateCanvasLogging(cc) {
    // Time
    cc.fillStyle = "white"
    cc.font = "14px Arial";
    cc.fillText(`Time: ${Math.round(time_total*100)/100}s`, 5, 15);

    // Next collision
    if (next_collision) {
        var description = `Next collision in ${next_collision.t}s between ${next_collision.pr.length === 1 ? `ID ${next_collision.pr[0]} and wall` : `ID ${next_collision.pr[0]} and ID ${next_collision.pr[1]}`}`
        cc.fillText(description, 5, 29);
    }
    
    // Delta time
    cc.fillText(`Δ${deltaTime}ms`, cc.canvas.width - 50, cc.canvas.height - 12)
}

/**
 * Load a preset from Presets.js
 * @param {String} name - Preset identifier 
 */
function loadScene(name="default") {
    if (!name) {
        render()
        return
    }

     // Prevent mouse event from being passed
     if (name.type) {
        name = document.getElementById("presets").value
    }

    // Programmatically added projectiles
    console.log(Presets[name])
    projectiles_to_add = Presets[name]()
    current_preset = name

    projectiles_map = {}
    projectiles = []

    // Add programmatically added projectiles
    for (var i = 0; i < projectiles_to_add.length; i++) {
        addProjectile(projectiles_to_add[i])
    }

    // Clear queue
    projectiles_to_add = []

    render()
}
