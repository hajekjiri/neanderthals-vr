const Entity = require('./Entity.js');
const THREE = require('three');
const Person = require('./Person.js');

/**
 * Base class
 * @abstract
 */
class Base extends Entity.Entity {
  /**
   * Constructor
   * @param {string} name Name of the base
   * @param {number} color Color of the base
   * @param {number} type Entity type
   */
  constructor(name, color, type = Entity.TYPES['TYPE_BASE']) {
    super(type);
    this.name = name;
    this.entities = {};
    this.entities[Entity.TYPES['TYPE_HUMAN']] = [];
    this.entities[Entity.TYPES['TYPE_NEANDERTHAL']] = [];

    this.model = new THREE.Group();
    this.radius = 100;

    this.visibleAmt = {};
    this.visibleAmt[Entity.TYPES['TYPE_HUMAN']] = 0;
    this.visibleAmt[Entity.TYPES['TYPE_NEANDERTHAL']] = 0

    const geometry = new THREE.BoxBufferGeometry(1, 10, 1);
    geometry.translate(0, 5, 0);
    const material =
        new THREE.MeshPhongMaterial({color: color, flatShading: true});
    const mesh = new THREE.Mesh(geometry, material);
    this.model.add(mesh);
  }

  preload(amt, type) {
    this.add(amt, type);
  }

  add(amt, type) {
    for (let i = 0; i < amt; ++i) {
      const entity = new Person.Person(type);
      this.entities[type].push(entity);
      this.model.add(entity.model);
      entity.model.visible = false;
      entity.model.rotateY(Math.random() * 2 * Math.PI);
      entity.model.translateX(1 + Math.random() * this.radius);
      entity.model.rotation.y = 0;
    }
  }

  /**
   * Add an entity to the base
   * @param {Entity} entity Entity to be added
   */
  addOne(type) {
    this.add(1, type);
  }

  show(amt, type) {
    if (this.visibleAmt[type] + amt > this.entities[type].length) {
      this.add(this.visibleAmt[type] + amt - this.entities[type].length, type);
    }

    for (let i = this.visibleAmt[type]; i < this.visibleAmt[type] + amt; ++i) {
      this.entities[type][i].model.visible = true;
    }
    this.visibleAmt[type] += amt;
  }

  showOne(type) {
    this.show(1, type);
  }

  hide(amt, type) {
    let low;
    if (this.visibleAmt[type] - amt > 0) {
      low = this.visibleAmt[type] - amt;
    } else {
      low = 0;
    }

    for (let i = this.visibleAmt[type] - 1; i >= low; --i) {
      this.entities[type][i].model.visible = false;
    }
    this.visibleAmt[type] = low;
  }

  hideOne(type) {
    this.hide(1, type);
  }
}

module.exports = {
  Base,
};
