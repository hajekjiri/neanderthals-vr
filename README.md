# Neanderthals VR
## About
Neanderthals VR is a simple simulation of neanderthal and modern human populations visualized in VR. You can alter the outcome by changing various parameters and make one specie outlive the other. The simulation stops once one of the species goes extinct and shows you the elapsed time in years as well as the population numbers throughout the simulation. The simulation is based on [this research paper](https://doi.org/10.1016/j.jhevol.2018.07.006) (population numbers are determined by solving a differential equation provided in the paper).

This project was a part of the CSC385 Computer Graphics course at [Union College](https://union.edu/).

## Getting started
The app is live on my [GitHub pages](https://hajekjiri.github.io/neanderthals-vr). If you want to run it locally, follow the steps below.

### Running locally
#### 1. Clone the repository and install dependencies
```
git clone https://github.com/hajekjiri/neanderthals-vr.git
cd neanderthals-vr
npm install
```

#### 2. Build the project
There are 2 building options
* prod (compression on)
* dev (compression off)

```
# build for production
npm run build-prod

# build for development
npm run build-dev
```

#### 3. Run it
Put the project on your webserver and navigate to `index.html`.

### Development
##### Watcher
Start the included watcher to automatically rebuild the project whenever you make changes to the code.
```
npm run watch
```

##### Code style
This project follows the [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html). Use the `lint` script to check whether the code is compliant.
```
npm run lint
```

### Documentation
Documentation can be generated using [JSDoc](https://jsdoc.app/) and then accessed at `docs/index.html`.
```
npm run doc
```

## Used external modules
* [littleredcomputer/odex-js](https://github.com/littleredcomputer/odex-js) is licensed under the [BSD-2-Clause License](https://github.com/littleredcomputer/odex-js/blob/master/LICENSE)
* [mrdoob/three.js](https://github.com/mrdoob/three.js) is licensed under the [MIT license](https://github.com/mrdoob/three.js/blob/dev/LICENSE)
