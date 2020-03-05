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

    constructor(initNeanderthals, initHumans, planeX = 400, planeY = 200){
      super();
      this.initNeanderthals = initNeanderthals;
      this.initHumans = initHumans;
      this.planeX = planeX;
      this.planeY = planeY;

      // ground
      let geometry = new THREE.PlaneBufferGeometry(this.planeX, this.planeY);
      geometry.rotateX(-Math.PI / 2);
      let texture = new THREE.TextureLoader().load(
          '/assets/textures/eurasia.png',
      );
      texture.repeat.set(1, 1);
      let material = new THREE.MeshPhongMaterial({map: texture});
      let mesh = new THREE.Mesh(geometry, material);
      this.add(mesh);

      // fence
      const FENCE_HEIGHT = 1;
      for (let i = 0; i < 2; ++i) {
        geometry = new THREE.PlaneBufferGeometry(this.planeX, FENCE_HEIGHT);
        geometry.translate(0, FENCE_HEIGHT / 2, -this.planeY / 2);
        geometry.rotateY(Math.PI * i);
        material = new THREE.MeshPhongMaterial({color: 0x606060});
        mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);
      }

      for (let i = 0; i < 2; ++i) {
        geometry = new THREE.PlaneBufferGeometry(this.planeY, FENCE_HEIGHT);
        geometry.translate(0, FENCE_HEIGHT / 2, -this.planeX / 2);
        geometry.rotateY(Math.PI / 2 + Math.PI * i);
        material = new THREE.MeshPhongMaterial({color: 0x606060});
        mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);
      }

      // neanderthal base
      neanderthalBase = new Base.Base('Neanderthals', 0xff0000);

      neanderthalBase.radius = this.planeY / 4;
      neanderthalBase.model.position.set(
          -40,
          1,
          0,
      );

      neanderthalBase.preload(3 * this.initNeanderthals, Entity.TYPES['TYPE_NEANDERTHAL']);
      // neanderthalBase.show(this.initNeanderthals, Entity.TYPES['TYPE_NEANDERTHAL']);
      this.add(neanderthalBase.model);

      // human base
      humanBase = new Base.Base('humans', 0x00ff00);

      humanBase.radius = this.planeY / 4;
      humanBase.model.position.set(
          -160,
          1,
          80,
      );

      humanBase.preload(3 * this.initHumans, Entity.TYPES['TYPE_HUMAN']);
      // humanBase.show(this.initHumans, Entity.TYPES['TYPE_HUMAN']);
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
