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

    constructor(){
      super();

      // ground
      let geometry = new THREE.PlaneBufferGeometry(1000, 1000);
      geometry.rotateX(-Math.PI / 2);
      let texture = new THREE.TextureLoader().load(
          '/assets/textures/grass.jpg',
      );
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10);
      let material = new THREE.MeshPhongMaterial({map: texture});
      let mesh = new THREE.Mesh(geometry, material);
      this.add(mesh);

      // fence
      for (let i = 0; i < 4; ++i) {
        geometry = new THREE.PlaneBufferGeometry(1000, 1);
        geometry.translate(0, 0.5, -500);
        geometry.rotateY(i * Math.PI / 2);
        geometry.scale(1, 50, 1);
        texture = new THREE.TextureLoader().load(
            '/assets/textures/fence.jpg',
        );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 1);
        material =
            new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});
        mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);
      }


      // neanderthal base
      neanderthalBase = new Base.Base('Neanderthals', 0xff0000);

      neanderthalBase.radius = 250;
      neanderthalBase.model.position.set(
          50 + Math.random() * 150,
          1,
          50 + Math.random() * 150,
      );

      for (let i = 0; i < 100; ++i) {
        const n = new Person.Person(Entity.TYPES['TYPE_NEANDERTHAL']);
        neanderthalBase.addEntity(n);
      }
      this.add(neanderthalBase.model);

      // human base
      humanBase = new Base.Base('humans', 0x00ff00);

      humanBase.radius = 250;
      humanBase.model.position.set(
          -(50 + Math.random() * 150),
          1,
          -(50 + Math.random() * 150),
      );

      for (let i = 0; i < 100; ++i) {
        const h = new Person.Person(Entity.TYPES['TYPE_HUMAN']);
        humanBase.addEntity(h);
      }
      this.add(humanBase.model);

      this.neanderthalBase = neanderthalBase;
      this.humanBase = humanBase;
    }

    getNeanderthalPopulation(){
      return this.neanderthalBase.entities.length;
    }

    getHumanPopulation(){
      return this.humanBase.entities.length;
    }
}

module.exports = {
  Environment,
};
