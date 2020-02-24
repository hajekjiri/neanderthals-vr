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
      const neanModel = new MODEL.PersonModel(0x326FC7);
      this.model.add(neanModel);
    } else {
      const humanModel = new MODEL.PersonModel(0x8C3320);
      this.model.add(humanModel);
    }
  }
}

module.exports = {
  Person,
};
