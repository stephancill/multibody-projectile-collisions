var Presets =  {
    default: function() {
        return [
            new Projectile({x: 40, y: 40, vxi: 150, vyi: -300, color: "red", radius: 40, mass: 40}),
            new Projectile({x: 490, y: 200, vxi: 0, vyi: 200, color: "green", radius: 20, mass: 20}),
            new Projectile({x: 40, y: 200, vxi: 0, vyi: -200, color: "blue", radius: 10, mass: 10})
        ]
    },
    fun: function() {
        var projs = []
        var colors = ["green", "purple", "blue", "red", "yellow"]
        for(var i = 25; i < cc.canvas.width-20; i+=100) {
            for(var j = 25; j < cc.canvas.height-20; j+=100) {
               var p = new Projectile({x: i, y: cc.canvas.height - j, vxi: getRandomArbitrary(-5000, 5000), vyi: getRandomArbitrary(-5000, 5000), color: colors[Math.round(getRandomArbitrary(0, colors.length-1))], radius: getRandomArbitrary(5, 25)})
               projs.push(p)
            }
        }

        return projs
    },
    two: function() {
        return [
            new Projectile({x: 20, y: 20, vxi: 150, vyi: 150, color: "red", radius: 20, mass: 20}),
            new Projectile({x: cc.canvas.width-20, y: 20, vxi: -150, vyi: 150, color: "green", radius: 20, mass: 20}),
        ]
    }
}