const Entity = require('./Entity.js');
const MovingEntity = require('./MovingEntity.js');
const THREE = require('three');


/**
 * Person class
 */
class Person extends MovingEntity.MovingEntity {
  /**
   * Constructor
   * @param {number} type Type (neanderthal or human)
   */
  constructor(type) {
    if (type !== Entity.TYPES['TYPE_NEANDERTHAL'] &&
        type !== Entity.TYPES['TYPE_HUMAN']) {
      throw exception(`invalid type ${type} for Person`);
    }
    super(type);
    this.type = type;
    this.addDefaultModel();
  }

  /**
   * Add default three model
   */
  addDefaultModel() {
    if (this.type === Entity.TYPES['TYPE_NEANDERTHAL']) {
      const geometry = new THREE.BoxBufferGeometry(2, 10, 2);
      geometry.translate(0, 5, 0);

      const material =
          new THREE.MeshPhongMaterial({color: 0x0000ff, flatShading: true});

      const mesh = new THREE.Mesh(geometry, material);

      this.model.add(mesh);
    } else {
      const geometry = new THREE.BoxBufferGeometry(2, 10, 2);
      geometry.translate(0, 5, 0);

      const material =
          new THREE.MeshPhongMaterial({color: 0xffff00, flatShading: true});

      const mesh = new THREE.Mesh(geometry, material);

      this.model.add(mesh);
    }
  }
}

module.exports = {
  Person,
};
