import math

# Obj1 = [float(x) for x in input('Obj1: ').split(' ')]
# Obj2 = [float(x) for x in input('Obj2: ').split(' ')]


#Obj1 = [x1,y1,vx1,vy1,r1,m1]
#Obj2 = [x2,y2,vx2,vy2,r2,m2]

def solveQuad(a,b,c):
	if a == 0:
		if b == 0:
			if c == 0:
				return []
			else:
				return []
		else:
			return [-c/b]
	else:
		if b**2-4*a*c < 0:
			return []
		elif b**2-4*a*c == 0:
			return [-b/(2*a)]
		else:
			return [(-b+(b**2-4*a*c)**0.5)/(2*a),(-b-(b**2-4*a*c)**0.5)/(2*a)]

#finds the time of collision if there is a collision

def timeUntilCollision(p1, p2):
	X = p1["x"] - p2["x"]
	Y = p1["y"] - p2["y"]
	VX = p1["vx"] - p2["vx"]
	VY = p2["vy"] - p2["vy"]
	Rtot = p1["r"] + p2["r"]

	a = VX**2 + VY**2
	b = 2*X*VX + 2*Y*VY
	c = X**2 + Y**2 - Rtot**2

	times = [x for x in solveQuad(a,b,c) if x >= 0]
	# times += wallColl(projs, 500, 500)

	if len(times) == 0:
		return None
	else:
		t = min([x for x in times if x])
		dist = (X + p1["vx"] * (t+10**-4) - p2["vx"] * (t+10**-4))**2 + (Y + p1["vy"] * (t+10**-4) - p2["vy"] * (t+10**-4))**2
		#this is to check if they collide by simulating their positions 10**-4 s after "collision"
		if dist < (p1["r"]+p2["r"])**2:
			return t
		else:
			return None


#Takes objects which are touching/colliding (does not simulate till point of collision)
def resolveCollision(p1, p2, wall=None):
	if wall:
		return {
			"x": (-p1["vx"], p1["vy"]),
			"y": (p1["vx"], -p1["vy"])
		}[wall]
	
	a = 0
	if p1["x"] == p2["x"]:
		a = 0
	else:
		a = math.atan((p1["y"]-p2["y"])/(p1["x"]-p2["x"]))

	m1 = p1["m"]
	m2 = p2["m"]

	v1 = math.cos(a)*p1["vx"] + math.sin(a)*p1["vy"]
	v2 = math.cos(a)*p2["vx"] + math.sin(a)*p2["vy"]

	u1 = (2*v2 + v1*m1/m2-v1)/(1+m1/m2)
	u2 = (2*v1 + v2*m2/m1-v2)/(1+m2/m1)

	yu1 = math.cos(a)*p1["vy"] + math.sin(a)*p1["vx"]
	yu2 = math.cos(a)*p2["vy"] + math.sin(a)*p2["vx"]

	# [x1,y1,vx1,vy1,r1,m1]

	newvx1 = yu1*math.sin(a)+u1*math.cos(a)
	newvy1 = yu1*math.cos(a)+u1*math.sin(a)

	newvx2 = yu2*math.sin(a)+u2*math.cos(a)
	newvy2 = yu2*math.cos(a)+u2*math.sin(a)

	return (newvx1, newvy1, newvx2, newvy2)

# Example of updating the shits
# proj1["vx"], proj1["vy"], proj2["vx"], proj2["vy"] = resolveCollision(proj1 , proj2)

def minTime(projectiles):
	colliding_objects = [0, 1]
	time_col = timeUntilCollision(projectiles[0], projectiles[1])
	for i in range(len(projectiles)-1):
		for j in range(i+1,len(projectiles)):
			time_new = timeUntilCollision(projectiles[i], projectiles[j])
			if time_new < time_col:
				time_col = time_new
				colliding_objects = [i,j]
	return (time_col, (projectiles[colliding_objects[0]], projectiles[colliding_objects[1]]), None)

def wallColl(projectiles, height, width):
	#l/r walls
	time_col = None
	for i in range(len(projectiles)):
		proj = projectiles[i]
		if proj["vx"] > 0:
			if solveQuad(0, proj["vx"], proj["r"] + proj["x"] - width)[0] >= 0:
				time_new = solveQuad(0,proj["vx"],proj["r"]+proj["x"]-width)[0]
				if (time_col == None) or (time_new < time_col):
					time_col = time_new
					colliding_proj = i
					colliding_wall = 'x'
		elif proj["vx"]<0:
			if (solveQuad(0,proj["vx"],-proj["r"]+proj["x"]))[0] >= 0:
				time_new = (solveQuad(0,proj["vx"],-proj["r"]+proj["x"])[0])
				if (time_col == None) or (time_new < time_col):
					time_col = time_new
					colliding_proj = i
					colliding_wall = 'x'

		if proj["vy"] > 0:
			time_new = min([(x) for x in (solveQuad(0.5*g,proj["vy"],proj["r"]+proj["y"]-heigth)) if x >= 0 ])
			if (time_col == None) or (time_new < time_col):
				time_col = time_new
				colliding_proj = i
				colliding_wall = 'y'
		if (proj["y"]!=0) and (proj["vy"]!=0):
			time_new = min([(x) for x in (solveQuad(0.5*g,proj["vy"],-proj["r"]+proj["y"])) if x >=0 ])

			if (time_col == None) or (time_new < time_col):
				time_col = time_new
				colliding_proj = i
				colliding_wall = 'y'

		return (time_col, [colliding_proj], colliding_wall)

def componentsFromAngle(a,x):
	vx = math.cos(a)*x
	vy = math.sin(a)*x
	return (vx,vy)

if __name__ == "__main__":
	proj1 = {
		"x": 5,
		"y": 5,
		"vx": 1,
		"vy": 0,
		"r": 5,
		"m": 10
	}

	proj2 = {
		"x": 20,
		"y": 5,
		"vx": -5,
		"vy": 0,
		"r": 5,
		"m": 10
	}
	
	projs = [proj1, proj2]

	[print(x) for x in projs]

	for _ in range(10):
		# 1. Calculate time of next collision (TODO: include walls)
		time, projectiles, wall = min(minTime(projs), wallColl(projs, 500, 500), key=lambda x: x[0])
		print(time, projectiles, wall)

		# 2. Update pos/vel as a function of time (to time of collision)
		for proj in projs:
			proj["x"] = proj["vx"]*time + 0.5*proj["vx"]*time*time
			proj["y"] = proj["vy"]*time + 0.5*-9.8*time*time
		
		# 3. Resolve collision
		# 4. Update colliding projectiles pos/vel
		if len(projectiles) == 2:
			projectiles[0]["vx"], projectiles[0]["vy"], projectiles[1]["vx"], projectiles[1]["vy"] = resolveCollision(projectiles[0], projectiles[1])
		elif len(projectiles) == 1:
			projectiles[0]["vx"], projectiles[0]["vy"] = resolveCollision(projectiles[0], None, wall=wall)
	
		[print(x) for x in projectiles]
		# 5. Step 1
