function Equations() {
    this.solveQuadratic = solveQuad(a, b, c) {
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
}
