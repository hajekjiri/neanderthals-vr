const Entity = require('./Entity.js');
const THREE = require('three');


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
    this.entities = [];
    this.model = new THREE.Group();
    this.radius = 100;

    const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    geometry.translate(0, 0.5, 0);
    geometry.scale(1, 100, 1);
    const material =
        new THREE.MeshPhongMaterial({color: color, flatShading: true});
    const mesh = new THREE.Mesh(geometry, material);
    this.model.add(mesh);
  }

  /**
   * Add an entity to the base
   * @param {Entity} entity Entity to be added
   */
  addEntity(entity) {
    this.entities.push(entity);
    this.model.add(entity.model);
  }
}

module.exports = {
  Base,
};
