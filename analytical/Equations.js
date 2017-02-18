function Equations() {
    this.solveQuadratic = function({a, b, c}) {
        /*
        Quadratic equation
        returns positive x or null
        */

        let descriminant = Math.pow(Math.pow(b, 2) - 4*a*c, 0.5);
        if (descriminant >= 0) {
            let x1 = (-b + descriminant)/(2*a);
            let x2 = (-b - descriminant)/(2*a);
            if (x1 > 0) {
                return x1;
            } else if (x2 > 0) {
                return x2;
            } else {
                return 0;
            }
            console.log(x1, x2);
        } else {
            return null;
        }
    }
}
