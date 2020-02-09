# Neanderthals VR
## About
The goal of this project is to create a simulation of neanderthal and modern human populations that interact with each other and the environment they live in. The simulation will be visualized in VR using [three.js](https://github.com/mrdoob/three.js/).

This project is part of the CSC385 Computer Graphics course at [Union College](https://union.edu/) so **we cannot accept PRs at the moment**, though feel free to create [issues](https://github.com/hajekjiri/neanderthals-vr/issues).

## Getting started
### Requirements
* [Node.js](https://nodejs.org/en/)
* [npx](https://www.npmjs.com/package/npx)

### Setup
Clone the repository and install dependencies.
```
git clone https://github.com/hajekjiri/neanderthals-vr.git
cd neanderthals-vr
npm install
```

### Building the project
There are 2 building options.

#### Development
Builds the project without compression for easier debugging.
```
npm run build-dev
```

#### Production
Builds the project with compression on.
```
npm run build-prod
```

### Running the project
HTTPS is required to run VR apps in the browser. If you don't already have a certificate/key pair, generate a self-signed certificate with [OpenSSL](https://www.openssl.org/) and store the certificate as well as the key in a folder called `ssl`. Name the files `server.key` and `server.cert`.
```
mkdir ssl
cd ssl
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

Make sure to [build](#building-the-project) the project before you run it.
Use `node app.js [--port <port>]` to start an [Express](https://expressjs.com/) server on a specified port. If no port is specified, the server will start on port 3000 by default.
```
node app.js
# Your app is live at https://localhost:3000/ !
```

### Development
##### Watcher
Start the included watcher that will automatically rebuild the project whenever you make changes to the code.
```
npm run watch
```
**Note**: You don't have to restart the Express server for changes to take effect. Just hit refresh in your browser.

##### Testing
[Mocha](https://mochajs.org/) is the framework of choice for testing. All tests are located in the `test` folder. Use the `test` script to run tests.
```
npm run test
```

##### Code style
This project is following the [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html). Use the `lint` script to check whether the code is compliant.
```
npm run lint
```

### Documentation
Documentation can be generated using [JSDoc](https://jsdoc.app/) and then accessed at `docs/index.html`.
```
npm run doc
```

