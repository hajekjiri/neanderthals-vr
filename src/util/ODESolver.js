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
