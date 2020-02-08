const Entity = require('./Entity.js');
const MovingEntity = require('./MovingEntity.js');
const THREE = require('three');


/**
 * Human class
 */
class Human extends MovingEntity.MovingEntity {
  /**
   * Constructor
   */
  constructor() {
    super(Entity.TYPES['TYPE_HUMAN']);
    this.addDefaultModel();
  }

  /**
   * Add default three model
   */
  addDefaultModel() {
    const geometry = new THREE.BoxBufferGeometry(5, 1, 5);
    geometry.translate(0, 0.5, 0);
    geometry.scale(1, 30, 1);

    const material =
        new THREE.MeshPhongMaterial({color: 0xffff00, flatShading: true});

    const mesh = new THREE.Mesh(geometry, material);

    this.model.add(mesh);
  }
}

module.exports = {
  Human,
};
