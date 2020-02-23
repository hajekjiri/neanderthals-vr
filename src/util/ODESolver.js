const ODEX = require('odex');

/*
differential equation:

dX/dt = r*X*(1-x/k)-(alpha*X*Y)/(1+(h1-f1))-beta*X*Z/(1+(h2-f2)*beta*X)
dY/dt = -d1*Y+alpha*X*Y/(1+(h1-f1)*alpha*X)
dZ/dt = -d2*Z+beta*X*Z/(1+(h2-f2)*beta*X)

interspecific competition c1, c2 is added
dX/dt = r*X*(1-x/k)-(alpha*X*Y)/(1+(h1-f1))-beta*X*Z/(1+(h2-f2)*beta*X)
dY/dt = -d1*Y+alpha*X*Y/(1+(h1-f1)*alpha*X)-c1*Y*Z
dZ/dt = -d2*Z+beta*X*Z/(1+(h2-f2)*beta*X)-c2*Y*Z

variables:
X: Prey source
Y: AMH population
Z: Neanderthal population
t: time t

coefficients:
alpha: neanderthal hunting efficiency
h1: digestion rate of AMH
d1: death rate of AMH
f1: fire use of AMH

beta: AMH hunting efficiency
h2: digestion rate of Neanderthal
d2: death rate of neanderthal
f2: fire use of Neanderthal

r: prey's growth rate
k: prey's carrying capacity (nutrition value)
*/

export class ODESolver{


  constructor(alpha, beta, h1, h2, d1, d2, f1, f2, r, k, c1 = 0, c2 = 0){

    this.solver = new ODEX.Solver(3);

    this.ode = function(alpha, beta, h1, h2, d1, d2, f1, f2, r, k, c1, c2){
      return function(x,y){
        return[
          // x is t
          // y[0] is X prey source
          // y[1] is Y AMH population
          // y[2] is Z neanderthal population
          r*y[0]*(1-y[0]/k)-(alpha*y[0]*y[1])/(1+(h1-f1))-beta*y[0]*y[2]/(1+(h2-f2)*beta*y[0]),
          -d1*y[1]+alpha*y[0]*y[1]/(1+(h1-f1)*alpha*y[0])-c1*y[1]*y[2],
          -d2*y[2]+beta*y[0]*y[2]/(1+(h2-f2)*beta*y[0])-c2*y[1]*y[2]
        ];
      };
    };
  }

  solveODE(initialPopulation, endTime){
    var initialX = initialPopulation[0];
    var initialY = initialPopulation[1];
    var initialZ = initialPopulation[2];
    return this.solver.solve(this.ode(alpha, beta, h1, h2, d1, d2, f1, f2, r, k, c1, c2),0,[initialX, initialY, initialZ], endTime).y
  }

}
