const THREE = require('three');

let _nextEntityGlobalId = 0;

/**
 * Array of entity types
 */
const TYPES = {
  'TYPE_GENERIC': 0,
  'TYPE_TREE': 1,
  'TYPE_FOOD': 2,
  'TYPE_NEANDERTHAL': 3,
  'TYPE_HUMAN': 4,
  'TYPE_BASE': 5,
};

/**
 * Get next entity id
 * @return {number} Next available unique id
 */
function getNextEntityId() {
  return _nextEntityGlobalId++;
}


/**
 * Generic entity class
 */
class Entity {
  /**
   * Constructor
   * @param {number} type Entity type
   */
  constructor(type = TYPES['TYPE_GENERIC']) {
    this.id = getNextEntityId();
    this.type = type;
    this.model = new THREE.Group();
  }

  /**
   * Add default three model
   * @abstract
   */
  addDefaultModel() {
    // do nothing
  }
}

module.exports = {
  TYPES,
  Entity,
};
