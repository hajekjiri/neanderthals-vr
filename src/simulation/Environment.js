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
          '/assets/textures/grass-meadow-green-juicy-53504.jpg',
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

      neanderthalBase.radius = 100;
      neanderthalBase.model.position.set(
          50 + Math.random() * 150,
          1,
          50 + Math.random() * 150,
      );

      for (let i = 0; i < 10; ++i) {
        const n = new Person.Person(Entity.TYPES['TYPE_NEANDERTHAL']);
        neanderthalBase.addEntity(n);
        n.model.rotateY(Math.random() * 2 * Math.PI);
        n.model.translateX(5 + Math.random() * neanderthalBase.radius);
        n.model.rotation.y = 0;
      }
      this.add(neanderthalBase.model);

      // human base
      humanBase = new Base.Base('humans', 0x00ff00);

      humanBase.radius = 100;
      humanBase.model.position.set(
          -(50 + Math.random() * 150),
          1,
          -(50 + Math.random() * 150),
      );

      for (let i = 0; i < 10; ++i) {
        const h = new Person.Person(Entity.TYPES['TYPE_HUMAN']);
        humanBase.addEntity(h);
        h.model.rotateY(Math.random() * 2 * Math.PI);
        h.model.translateX(5 + Math.random() * humanBase.radius);
        h.model.rotation.y = 0;
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
