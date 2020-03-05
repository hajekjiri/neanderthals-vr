const ODESolver = require('../util/ODESolver');
const Person = require('./models/Person');
const Entity = require('./models/Entity');
const THREE = require('three');

/**
 * Simulation wrapper
 */
class Simulation {
  /**
   * Constructor
   * @param {number} initialPrey Initial amount of prey
   * @param {Base} neanderthalBase Neanderthal base
   * @param {Base} humanBase Human base
   * @param {number} secondsPerUnit Seconds per 1 time unit
   */
  constructor(initialPrey, neanderthalBase, humanBase, secondsPerUnit, step, paramMenu) {
    this.initialPrey = initialPrey;
    this.preyAmt = this.initialPrey;

    this.neanderthalBase = neanderthalBase;
    this.neanderthals = this.neanderthalBase;
    // this.initialNeanderthals = this.neanderthals.visibleAmt[Entity.TYPES['TYPE_NEANDERTHAL']];
    this.initialNeanderthals = 100;
    this.neanderthalAmt = this.initialNeanderthals;

    this.humanBase = humanBase;
    this.humans = this.humanBase;
    // this.initialHumans = this.humans.visibleAmt[Entity.TYPES['TYPE_HUMAN']];
    this.initialHumans = 100;
    this.humanAmt = this.initialHumans;

    this.solver = new ODESolver.ODESolver(
        [this.initialPrey, this.initialNeanderthals, this.initialHumans]);

    this.secondsPerUnit = secondsPerUnit;
    this.step = step;
    this.pauseButton = () => {
      throw Error('pauseButton function is undefined in Simulation');
    };

    // amt of time units from the start of the simulation
    this.timestamp = 0;
    this.delta = 0;

    this.paramMenu = paramMenu;

    this.STATUS = {
      'PAUSED': 0,
      'RUNNING': 1,
      'STOPPED': 2,
    };

    this.status = this.STATUS['PAUSED'];
    this.reset();
  }

  /**
  * Update ode solver to match the parameters on the menu
  */ updateODESolver(){
    this.solver = this.paramMenu.updateParameter([this.initialPrey, this.initialNeanderthals, this.initialHumans]);
  }

  /**
   * Advance simulation
   * @param {time} time Time units to advance the simulation by
   */
  advance(time) {
    this.timestamp += this.step * time;

    this.updatePopulationNumbers();

    const deltaNeanderthals = this.neanderthalAmt - this.neanderthals.visibleAmt[Entity.TYPES['TYPE_NEANDERTHAL']];
    for (let i = 0; i < Math.abs(deltaNeanderthals); ++i) {
      if (deltaNeanderthals > 0) {
        this.neanderthalBase.showOne(Entity.TYPES['TYPE_NEANDERTHAL']);
      } else {
        this.neanderthalBase.hideOne(Entity.TYPES['TYPE_NEANDERTHAL']);
      }
    }

    const deltaHumans = this.humanAmt - this.humans.visibleAmt[Entity.TYPES['TYPE_HUMAN']];
    for (let i = 0; i < Math.abs(deltaHumans); ++i) {
      if (deltaHumans > 0) {
        this.humanBase.showOne(Entity.TYPES['TYPE_HUMAN']);
      } else {
        this.humanBase.hideOne(Entity.TYPES['TYPE_HUMAN']);
      }
    }
  }

  /**
   * Advance the simulation by n seconds irl
   * Updates the timestamp depending on the seconsPerUnit setting
   * @param {number} seconds Seconds to advance the simulation by
   */
  advanceByOne() {
    this.advance(1);
  }

  /**
   * Update population numbers
   * @return {boolean} Whether the numbers were updated or not
   *     (fails if one of the species already went extinct)
   */
  updatePopulationNumbers() {
    this.updateODESolver();
    // calculate new population numbers using the diff eqn solver
    if (this.neanderthalAmt === 0 || this.humanAmt === 0) {
      this.stop();
      this.pauseButton();
      return false;
    }

    const population = this.solver.solveODE(this.timestamp);
    [this.preyAmt, this.humanAmt, this.neanderthalAmt] = population;

    if (this.preyAmt < 0) {
      this.preyAmt = 0;
    }

    if (this.neanderthalAmt < 0) {
      this.neanderthalAmt = 0;
    }

    if (this.humanAmt < 0) {
      this.humanAmt = 0;
    }

    return true;
  }

  /**
   * Add seconds to delta member and call update if necessary
   * @param {number} seconds Seconds to add to the delta
   */
  addDelta(seconds) {
    if (this.status === this.STATUS['PAUSED'] ||
        this.status === this.STATUS['STOPPED']) {
      return;
    }

    this.delta += seconds;
    if (this.delta >= this.secondsPerUnit) {
      this.delta = 0;
      this.advanceByOne();
    }
  }

  /**
   * Reset the simulation
   */
  reset() {
    this.timestamp = 0;
    this.delta = 0;
    this.advance(0);
    this.neanderthalBase.hide(this.neanderthalBase.visibleAmt[Entity.TYPES['TYPE_NEANDERTHAL']], Entity.TYPES['TYPE_NEANDERTHAL']);
    this.humanBase.hide(this.humanBase.visibleAmt[Entity.TYPES['TYPE_HUMAN']], Entity.TYPES['TYPE_HUMAN']);
    console.log(`show ${this.initialNeanderthals} neanderthals and ${this.initialHumans} humans`);
    // this.neanderthalBase.show(this.initialNeanderthals, Entity.TYPES['TYPE_NEANDERTHAL']);
    // this.humanBase.show(this.initialHumans, Entity.TYPES['TYPE_HUMAN']);
    this.neanderthalAmt = this.initialNeanderthals;
    this.humanAmt = this.initialHumans;
  }

  /**
   * Run the simulation
   */
  run() {
    if (this.status === this.STATUS['STOPPED']) {
      this.reset();
    }
    this.paramMenu.visible = false;
    this.paramMenu.gui.tmpCollider = this.paramMenu.gui.collider;
    this.paramMenu.gui.collider = new THREE.Group();
    this.status = this.STATUS['RUNNING'];
  }

  /**
   * Pause the simulation
   */
  pause() {
    this.status = this.STATUS['PAUSED'];
  }

  stop() {
    this.paramMenu.visible = true;
    this.paramMenu.gui.collider = this.paramMenu.gui.tmpCollider;
    this.status = this.STATUS['STOPPED'];
  }
}

module.exports = {
  Simulation,
};
