const Entity = require('./Entity.js');
const MovingEntity = require('./MovingEntity.js');
const THREE = require('three');
const MODEL = require('./PersonModel.js');


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
      const neanModel = new THREE.Mesh(
           new THREE.CircleBufferGeometry(0.5, 3),
          new THREE.MeshPhongMaterial({color: 0x326FC7}),
      );
      neanModel.translateY(0.01);
      neanModel.rotateX(-Math.PI / 2);
      this.model.add(neanModel);
    } else {
      const humanModel = new THREE.Mesh(
          new THREE.CircleBufferGeometry(0.5, 3),
          new THREE.MeshPhongMaterial({color: 0x8c3320}),
      );
      humanModel.translateY(0.01);
      humanModel.rotateX(-Math.PI / 2);
      this.model.add(humanModel);
    }
  }
}

module.exports = {
  Person,
};
