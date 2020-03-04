// Author: Woody
// CSC 385 Computer Graphics
// Version Winter 2020
// Group Project Neanderthal VR
// Environment Class: tracking and manipulating environment as well as both populations

const THREE = require('three');
const VRButton = require('three/examples/jsm/webxr/VRButton');
const UserRig = require('../UserRig');

const Base = require('./models/Base');
const Person = require('./models/Person');
const Entity = require('./models/Entity');

var entities = [];
var coords = [];

let neanderthalBase;
let humanBase;

class Environment extends THREE.Group {

    constructor(initNeanderthals, initHumans, planeDimension = 150){
      super();
      this.initNeanderthals = initNeanderthals;
      this.initHumans = initHumans;
      this.planeDimension = planeDimension;

      // ground
      let geometry = new THREE.PlaneBufferGeometry(this.planeDimension, this.planeDimension);
      geometry.rotateX(-Math.PI / 2);
      let texture = new THREE.TextureLoader().load(
          '/assets/textures/grass.jpg',
      );
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4,4);
      // let material = new THREE.MeshPhongMaterial({map: texture});
      let material = new THREE.MeshPhongMaterial({color: 0xa1a1a1});
      let mesh = new THREE.Mesh(geometry, material);
      this.add(mesh);

      // fence
      const FENCE_HEIGHT = 1;
      for (let i = 0; i < 4; ++i) {
        geometry = new THREE.PlaneBufferGeometry(this.planeDimension, FENCE_HEIGHT);
        geometry.translate(0, FENCE_HEIGHT / 2, -this.planeDimension / 2);
        geometry.rotateY(i * Math.PI / 2);
        texture = new THREE.TextureLoader().load(
            '/assets/textures/fence.jpg',
        );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 1);
        // material =
            // new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});
        material = new THREE.MeshPhongMaterial({color: 0x606060});
        mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);
      }

      // neanderthal base
      neanderthalBase = new Base.Base('Neanderthals', 0xff0000);

      neanderthalBase.radius = this.planeDimension / 4;
      neanderthalBase.model.position.set(
          this.planeDimension / 20 + Math.random() * 0.15 * this.planeDimension,
          1,
          this.planeDimension / 20 + Math.random() * 0.15 * this.planeDimension,
      );

      neanderthalBase.preload(3 * this.initNeanderthals, Entity.TYPES['TYPE_NEANDERTHAL']);
      neanderthalBase.show(this.initNeanderthals, Entity.TYPES['TYPE_NEANDERTHAL']);
      this.add(neanderthalBase.model);

      // human base
      humanBase = new Base.Base('humans', 0x00ff00);

      humanBase.radius = this.planeDimension / 4;
      humanBase.model.position.set(
          this.planeDimension / 20 + Math.random() * 0.15 * this.planeDimension,
          1,
          this.planeDimension / 20 + Math.random() * 0.15 * this.planeDimension,
      );

      humanBase.preload(3 * this.initHumans, Entity.TYPES['TYPE_HUMAN']);
      humanBase.show(this.initHumans, Entity.TYPES['TYPE_HUMAN']);
      this.add(humanBase.model);

      this.neanderthalBase = neanderthalBase;
      this.humanBase = humanBase;
    }

    getNeanderthalPopulation(){
      return this.neanderthalBase.entities[Entity.TYPES['TYPE_NEANDERTHAL']].length;
    }

    getHumanPopulation(){
      return this.humanBase.entities[Entity.TYPES['TYPE_HUMAN']].length;
    }
}

module.exports = {
  Environment,
};
