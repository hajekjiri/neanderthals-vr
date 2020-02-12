const Entity = require('./Entity.js');

/**
 * Moving entity class
 * @abstract
 */
class MovingEntity extends Entity.Entity {
  /**
   * Constructor
   * @param {number} type Entity type
   */
  constructor(type = Entity.TYPES['TYPE_MOVING']) {
    super(type);
  }
}

module.exports = {
  MovingEntity,
};
