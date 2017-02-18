function Equations() {
    this.solveQuadratic = function(a, b, c) {
        /*
        returns positive x or null
        */
        let descriminant = Math.pow(Math.pow(b, 2) - 4*a*c, 0.5);
        if (descriminant >= 0) {
            let x1 = (-b + descriminant)/(2*a);
            let x2 = (-b - descriminant)/(2*a);
            if (x1 > 0) {
                return x1;
            } else {
                return x2;
            }
            console.log(x1, x2);
        } else {
            return null;
        }
    }

    this.solveLinear = function(y, m, c) {
        if (m === 0) {return null};
        let x = (y-c) / m;
        if (x > 0) {
            return x;
        } else {
            return null;
        }
    }
}
