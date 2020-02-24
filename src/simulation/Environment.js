const THREE = require('three');
const VRButton = require('three/examples/jsm/webxr/VRButton');
const UserRig = require('./UserRig');

const Base = require('./simulation/models/Base');
const Person = require('./simulation/models/Person');
const Entity = require('./simulation/models/Entity');

var entities = [];
var coords = [];

class Environment extends THREE.Group {

    constructor(){
      super();
      
    }
}

module.exports = {
  Environment,
};
