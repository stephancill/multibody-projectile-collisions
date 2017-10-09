function roundToDecimalPlace(x, n) {
	return Math.round(x * Math.pow(10, n)) / Math.pow(10, n)
}

function solveQuad(a, b, c) {
	if (a == 0) {
		if (b == 0) {
			if (c == 0) {
				return null
			} else {
				return null
			}
		} else{
			if (-c/b >= 0) {
				return -c/b
			} else {
				return null
			}
		}
	}
	else {
		if (Math.pow(b, 2)-4*a*c < 0) {
			return null
		} else if (Math.pow(b, 2)-4*a*c == 0) {
			return -b/(2*a)
		} else {
			var times = [(-b+Math.pow((Math.pow(b, 2)-4*a*c),0.5))/(2*a),(-b-Math.pow((Math.pow(b, 2)-4*a*c),0.5))/(2*a)].filter(function (x) { return x >= 0 } )
			if (times.length > 0) {
				return Math.min(...times)
			} else {
				return null
			}

		}
	}
}

function timeUntilCollision(p1, p2) {
	X = roundToDecimalPlace(p1.pos.x - p2.pos.x,5)
	Y = roundToDecimalPlace(p1.pos.y - p2.pos.y,5)
	VX = roundToDecimalPlace(p1.vel.x - p2.vel.x,5)
	VY = roundToDecimalPlace(p1.vel.y - p2.vel.y,5)
	Rtot = roundToDecimalPlace(p1.radius + p2.radius,5)

	a = Math.pow(VX,2) + Math.pow(VY,2)
	b = 2*X*VX + 2*Y*VY
	c = Math.pow(X,2) + Math.pow(Y,2) - Math.pow(Rtot,2)

	t = solveQuad(a,b,c)
//   console.log(t,p1,'POES')
	if (t != null) {
		var newt = t+Math.pow(10,-4)
		var dist = Math.pow((X + VX*(newt)),2) + Math.pow((Y + VY*newt),2)
		// this is to check if they collide by simulating their positions 10**-4 s after "collision"
		if (dist < Math.pow(Rtot, 2)) {
			return t
		} else {
			return null
		}
	} else {
		return null
	}
}

function resolveCollision(p1, p2, wall) {
	var out = {}

	// Handle collision with wall
	if (wall) {
		if (wall == 'x') {
			out[p1.id] = {vx: -p1.vel.x, vy: p1.vel.y}
		} else {
			out[p1.id] = {vx: p1.vel.x, vy: -p1.vel.y}
		}
		return out
	}

	// Handle collision with projectile
	var a

	if (p1.pos.x == p2.pos.x) {
		a = 0
	} else {
		a = Math.atan((p1.pos.y-p2.pos.y)/(p1.pos.x-p2.pos.x))
	}

	var m1 = p1.mass
	var m2 = p2.mass

	var v1 = Math.cos(a)*p1.vel.x + Math.sin(a)*p1.vel.y
	var v2 = Math.cos(a)*p2.vel.x + Math.sin(a)*p2.vel.y

	var u1 = (2*v2 + v1*m1/m2-v1)/(1+m1/m2)
	var u2 = (2*v1 + v2*m2/m1-v2)/(1+m2/m1)

	var yu1 = Math.cos(a)*p1.vel.y + Math.sin(a)*p1.vel.x
	var yu2 = Math.cos(a)*p2.vel.y + Math.sin(a)*p2.vel.x

	var newvx1 = yu1*Math.sin(a)+u1*Math.cos(a)
	var newvy1 = yu1*Math.cos(a)+u1*Math.sin(a)

	var newvx2 = yu2*Math.sin(a)+u2*Math.cos(a)
	var newvy2 = yu2*Math.cos(a)+u2*Math.sin(a)


	out[p1.id] = {vx: newvx1, vy: newvy1}
	out[p2.id] =  {vx: newvx2, vy: newvy2}

	return out
}

function wallCol(projectiles, width, height) {
	var time_col, colliding_wall, colliding_proj, time_new
	for (var i = 0; i < projectiles.length; i++) {
		var proj = projectiles_map[projectiles[i]]
		if (proj.vel.x > 0) {
			time_new = (proj.radius + proj.pos.x - width)/-proj.vel.x
			if (time_new != null) {
				if (time_col != null) {
					if (time_new < time_col) {
						time_col = time_new
						colliding_proj = i
						colliding_wall = "x"
					}
				} else {
					time_col = time_new
					colliding_proj = i
					colliding_wall = 'x'
				}
			}
		} else if (proj.vel.x < 0) {
			time_new = -(-proj.radius+proj.pos.x)/proj.vel.x
			if (time_new != null) {
				if (time_col != null) {
					if (time_new < time_col) {
						time_col = time_new
						colliding_proj = i
						colliding_wall = 'x'
					}
				}else {
					time_col = time_new
					colliding_proj = i
					colliding_wall = 'x'
				}
			}
		}

		if (proj.vel.y > 0) {
			time_new = solveQuad(0.5*G,proj.vel.y,proj.radius+proj.pos.y-height)
			if (time_new != null) {
				if (time_col != null) {
					if (time_new < time_col) {
						time_col = time_new
						colliding_proj = i
						colliding_wall = 'y'
					}
				} else {
					time_col = time_new
					colliding_proj = i
					colliding_wall = 'y'
				}
			}
		}

		if (((proj.pos.y-proj.radius)!=0) || (proj.vel.y!=0)) {
			time_new = solveQuad(0.5*G,proj.vel.y,-proj.radius+proj.pos.y)
			if (time_new != null) {
				var newt = time_new+Math.pow(10,-4)
				var newp = proj.pos.y + newt*proj.vel.y + 0.5*G*Math.pow(newt,2)
				if (newp < proj.radius) {
				if (time_col != null) {
					if (time_new < time_col) {
						time_col = time_new
						colliding_proj = i
						colliding_wall = 'y'
					}
				} else {
					time_col = time_new
					colliding_proj = i
					colliding_wall = 'y'
				}
				}
			}
		}
	}
	// console.log(time_col,'WALL')
	if (time_col != null) {
		return [Math.abs(roundToDecimalPlace(time_col, 5)), [projectiles[colliding_proj]], colliding_wall]
	} else {
		return [null, null, null]
	}
}

function minTime(projectiles) {
	var colliding_objects, time_col
	for(var i = 0; i < projectiles.length-1; i++) {
		for (var j = i+1; j < projectiles.length; j++){
			time_new = timeUntilCollision(projectiles_map[projectiles[i]], projectiles_map[projectiles[j]])
			if (time_new  != null) {
				if (time_col  != null) {
					if (time_new < time_col) {
						time_col = time_new
						colliding_objects = [i,j]
					}
				} else {
					time_col = time_new
					colliding_objects = [i,j]
				}
			}
		}
	}

	if (time_col != null) {
		return [Math.abs(roundToDecimalPlace(time_col, 5)), [projectiles[colliding_objects[0]], projectiles[colliding_objects[1]]], null]
	} else {
		return [null, null, null]
	}
}


/*
--------------------------------------------------------------
Cycle
--------------------------------------------------------------
1. Calculate time of next collision (TODO: include walls)
2. Update pos/vel as a function of time (to time of collision)
3. Resolve collision
4. Update colliding projectiles pos/vel
5. Step 1
*/

// Example:

/*
var p1 = new Projectile({x: 5, y: 5, vxi: 1, vyi: 0, color: "red", name: "Projectile 1"})
var p2 = new Projectile({x: 20, y: 5, vxi: -2, vyi: 0, color: "red", name: "Projectile 2"})

var projs = [p1, p2]

var t, pr, wall

console.log('\n');

for(var i = 0; i < 10; i++) {
	[t, pr, wall] = [wallCol(projs, 200, 400), minTime(projs)].sort(function(a, b) {return (a[0] || Number.MAX_VALUE) > (b[0] || Number.MAX_VALUE)})[0]

	console.log("Time until next collision: ", t, wall, wall ? pr.name : "");
	console.log("Velocities: ", p1.vel, p2.vel);
	projs.map(function(p) {
		p.setPositionForTime(t)
		p.setVelocityForTime(t)
	})
	console.log("Positions at collision time: ", p1.pos, p2.pos)

	if (wall) {
		resolveCollision([pr], null, wall)
	} else {
		resolveCollision(pr[0], pr[1], null)
	}
	console.log("Velocities after collision: ", p1.vel, p2.vel);
	console.log('\n');
}
*/
