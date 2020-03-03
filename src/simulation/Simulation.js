const ODESolver = require('../util/ODESolver');
const Person = require('./models/Person');
const Entity = require('./models/Entity');

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
  constructor(initialPrey, neanderthalBase, humanBase, secondsPerUnit, paramMenu) {
    this.initialPrey = initialPrey;
    this.preyAmt = this.initialPrey;

    this.neanderthalBase = neanderthalBase;
    this.neanderthals = this.neanderthalBase.entities;
    this.initialNeanderthals = this.neanderthals.length;
    this.neanderthalAmt = this.initialNeanderthals;

    this.humanBase = humanBase;
    this.humans = this.humanBase.entities;
    this.initialHumans = this.humans.length;
    this.humanAmt = this.initialHumans;

    this.solver = new ODESolver.ODESolver(
        [this.initialPrey, this.initialNeanderthals, this.initialHumans]);

    this.secondsPerUnit = secondsPerUnit;

    // amt of time units from the start of the simulation
    this.timestamp = 0;
    this.delta = 0;

    this.paramMenu = paramMenu;
  }

  /**
  * Update paramter menu
  */
  updateParamMenu(newMenu){
    this.paramMenu = newMenu;
  }

  /**
  * Update ode solver to match the parameters on the menu
  */
  updateODESolver(){
    this.solver = this.paramMenu.updateParameter([this.initialPrey, this.initialNeanderthals, this.initialHumans]);
  }

  /**
   * Advance simulation
   * @param {time} time Time units to advance the simulation by
   */
  advance(time) {
    this.timestamp += time;

    this.updatePopulationNumbers();

    const deltaNeanderthals = this.neanderthalAmt - this.neanderthals.length;
    for (let i = 0; i < Math.abs(deltaNeanderthals); ++i) {
      if (deltaNeanderthals > 0) {
        const n = new Person.Person(Entity.TYPES['TYPE_NEANDERTHAL']);
        this.neanderthalBase.addEntity(n);
      } else {
        const target =
            Math.round(Math.random() * (this.neanderthals.length - 1));
        this.neanderthals[target].model
            .parent.remove(this.neanderthals[target].model);
        this.neanderthals.splice(target, 1);
      }
    }

    const deltaHumans = this.humanAmt - this.humans.length;
    for (let i = 0; i < Math.abs(deltaHumans); ++i) {
      if (deltaHumans > 0) {
        const n = new Person.Person(Entity.TYPES['TYPE_HUMAN']);
        this.humanBase.addEntity(n);
      } else {
        const target = Math.round(Math.random() * (this.humans.length - 1));
        this.humans[target].model
            .parent.remove(this.humans[target].model);
        this.humans.splice(target, 1);
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
  }
}

module.exports = {
  Simulation,
};
