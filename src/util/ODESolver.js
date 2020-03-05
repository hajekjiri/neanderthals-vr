// Author: Woody
// CSC 385 Computer Graphics
// Version Winter 2020
// Group Project Neanderthal VR
// ODESolver: gives the population in times t (year) according to the differential
// equation provided by [1]
//
// [1] Goldfield, Anna E., et al. “Modeling the Role of Fire and Cooking in the
// Competitive Exclusion of Neanderthals.” Journal of Human Evolution, vol. 124,
// Nov. 2018, pp. 91–104. ScienceDirect, doi:10.1016/j.jhevol.2018.07.006.


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

class ODESolver {
  constructor(initialPopulation, alpha=1, beta=1, h1=0.894334, h2=1, d1=0.1, d2=0.1, f1=0, f2=0, r=1, k=1, c1 = 0, c2 = 0) {
    this.population = initialPopulation;
    this.alpha = alpha;
    this.beta = beta;
    this.h1 = h1;
    this.h2 = h2;
    this.d1 = d1;
    this.d2 = d2;
    this.f1 = f1;
    this.f2 = f2;
    this.r = r;
    this.k = k;
    this.c1 = c1;
    this.c2 = c2;

    this.solver = new ODEX.Solver(3);

    this.ode = function(alpha, beta, h1, h2, d1, d2, f1, f2, r, k, c1, c2) {
      return function(x, y) {
        return [
          // x is t
          // y[0] is X prey source
          // y[1] is Y AMH population
          // y[2] is Z neanderthal population
          r*y[0]*(1-y[0]/k)-(alpha*y[0]*y[1])/(1+(h1-f1))-beta*y[0]*y[2]/(1+(h2-f2)*beta*y[0]),
          -d1*y[1]+alpha*y[0]*y[1]/(1+(h1-f1)*alpha*y[0])-c1*y[1]*y[2],
          -d2*y[2]+beta*y[0]*y[2]/(1+(h2-f2)*beta*y[0])-c2*y[1]*y[2],
        ];
      };
    };
  }

  solveODE(endTime) {
    const initialX = this.population[0];
    const initialY = this.population[1];
    const initialZ = this.population[2];
    const initialPopulationDensity = [1, 1, 1];
    const populationDensity = this.solver.solve(this.ode(this.alpha, this.beta,
        this.h1, this.h2, this.d1, this.d2, this.f1, this.f2, this.r, this.k, this.c1,
        this.c2), 0, initialPopulationDensity, endTime).y;
    return [
      Math.round(populationDensity[0]*initialX),
      Math.round(populationDensity[1]*initialY),
      Math.round(populationDensity[2]*initialZ)];
  }
}

/*
// default value, no fire use for either group
var solver = new ODESolver();
//uncomment this to see how it work:
var solverWithFireUse = new ODESolver([1000,500,500],1,1,0.894334,1,0.1,0.1,0.03,0,1,1);
for (var time = 0; time <= 6000; time ++){
  population = solverWithFireUse.solveODE(time);
  console.log(population[0],population[1],population[2]);
}
*/

module.exports = {
  ODESolver,
};
