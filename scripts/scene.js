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
    console.log(p)
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
        var mass = Number(document.getElementById("inputMass").value)
        var radius = Number(document.getElementById("inputRadius").value)

        p = new Projectile({x: px, y: py, vxi: vx, vyi: vy, color, radius})
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

    var html = ""
    for (var key in projectiles_map) {
        if (projectiles_map.hasOwnProperty(key)) {
            html += `<option value="${key}">${key}</option>`
        }
    }

    document.getElementById("compare1").innerHTML = html
    document.getElementById("compare2").innerHTML = html


    // Render the new projectile if canvas is available
    if (cc) {
        if (startTime) {
            update()
        }
        p.render(cc, true)
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
 * Called on every frame update
 */
function update() {
    // 1.1 Time calculation
    deltaTime = new Date() - lastFrame
    lastFrame = new Date()
    
    if (!stop) {
        // 1.2 Update time
        time += deltaTime / 1000
        time_total += deltaTime / 1000

        // 2. Check if collision is due
        if (time >= next_collision.t) {
            var event = next_collision

            // a. Set time to exact time of collision
            time = event.t
            console.log(event)

            // b. Correct each projectile's position and velocity for the time of collision
            projectiles.forEach(function(p) {
                projectiles_map[p].setPositionForTime(event.t)
                projectiles_map[p].setVelocityForTime(event.t)
            })

            // c. Update the projectiles involved in the collision's velocities
            event.pr.forEach(function (p) {
                projectiles_map[p].setVelocity(event.new_vels[p].vx, event.new_vels[p].vy)
            })

            // d. Capture each projectile's current velocity and position as its initial conditions
            projectiles.forEach(function(p) {
                projectiles_map[p].captureAsInitialConditions()
            })

            // e. Set the time to 0
            time = 0

            // f. Calculate the next collision
            next_collision = calulateNextEvent()

        } else {
            // 3. Simulate projectile's motion
            projectiles.forEach(function(p) {
                projectiles_map[p].setPositionForTime(time)
                projectiles_map[p].setVelocityForTime(time)
            })
        }
    }


    // 4.1 Render background and projectiles
    render()

    // 4.2 Display statistics
    updateLogging(projectiles_map, projectiles)
}

/**
 * Render scene and all projectiles
 */
function render(debugging=false) {
    cc.canvas.width  = window.innerWidth - 40;
    cc.canvas.height = window.innerHeight/2

    // Render background
    cc.fillStyle = "black"
    cc.fillRect(0, 0, cc.canvas.width, cc.canvas.height)

    // Render projectiles
    projectiles.forEach(function (i) {
        projectiles_map[i].render(cc, document.getElementById("debugging").checked || debugging)
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

    projComparison()

    var projectileLog = ""
    projectiles.forEach(i => {
        projectileLog += `
        <br><br>
        <span>Name: ${projectile_map[i].name}</span>
        <br>
        <span>Pos(x, y): ${Math.round(projectile_map[i].pos.x*100)/100}, ${Math.round(projectile_map[i].pos.y*100)/100}</span>
        <br>
        <span>Vel(vx, vy): ${Math.round(projectile_map[i].vel.x*100)/100}, ${Math.round(projectile_map[i].vel.y*100)/100}</span>
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
    projectiles_to_add = Presets[name]()
    current_preset = name

    projectiles_map = {}
    projectiles = []

    // Update scene settings
    document.getElementById("gravity").value = G

    // Add programmatically added projectiles
    for (var i = 0; i < projectiles_to_add.length; i++) {
        addProjectile(projectiles_to_add[i])
    }

    // Clear queue
    projectiles_to_add = []

    render(true)
}

function projComparison() {
    var p1 = projectiles_map[document.getElementById("compare1").value]
    var p2 = projectiles_map[document.getElementById("compare2").value]

    if (document.getElementById("compare2").value == document.getElementById("compare1").value) {
        return
    }

    var t = timeUntilCollision(p1,p2)
    var isCol = 'Yes'
    var Pcol = null
    if (t == null) {
        isCol = 'No'
    }
    var D = Math.pow(Math.pow(p1.pos.x-p2.pos.x,2) + Math.pow(p1.pos.y-p2.pos.y,2),0.5)-p1.radius-p2.radius
    if (t!=null) {
    var np1x, np1y, np2x, np2y
    np1x = p1.pos.xi + p1.vel.x * t;
    if (((p1.pos.y-p1.radius)!=0) || (p1.vel.y!=0)) {
        np1y = 1/2 * -G * Math.pow(t, 2) + p1.vel.y * t + p1.pos.yi
        }
    np2x = p2.pos.xi + p2.vel.x * t;
    if (((p2.pos.y-p2.radius)!=0) || (p2.vel.y!=0)) {
        np2y = 1/2 * -G * Math.pow(t, 2) + p2.vel.y * t + p2.pos.yi
        }
    Pcol = (p1.pos.x-(p1.pos.x-p2.pos.x)/(p1.radius+p2.radius)*p1.radius,p1.pos.y-(p1.pos.y-p2.pos.y)/(p1.radius+p2.radius)*p1.radius)
    }

    cc.beginPath()
    cc.moveTo(p1.pos.x, cc.canvas.height - p1.pos.y)
    cc.lineTo(p2.pos.x, cc.canvas.height - p2.pos.y)
    cc.strokeStyle = "white"
    cc.stroke()
    cc.closePath()

    // Velocity
    cc.fillStyle = "white"
    cc.font = '12px Arial';
    cc.fillText(`${roundToDecimalPlace(D, 2)}`, (p1.pos.x + p2.pos.x)/2,((cc.canvas.height - p2.pos.y) + (cc.canvas.height - p1.pos.y))/2);

    document.getElementById("comparison").innerHTML = `Will collide: ${isCol}<br> Time of collision: ${t},<br> Position of collision: ${Pcol},<br> Distance between: ${roundToDecimalPlace(D, 2)}`
    return `${isCol}, ${t}, ${Pcol}, ${D}`
}

function updateSceneProperties() {
    G = Number(document.getElementById("gravity").value)
}
