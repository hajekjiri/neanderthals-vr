const ODESolver = require('../util/ODESolver');


/**
 * Simulation wrapper
 */
class Simulation {
  /**
   * Constructor
   * @param {number} initialPrey Initial amount of prey
   * @param {Array} neanderthals Array of neanderthal entities
   * @param {Array} humans Array of human entities
   * @param {number} secondsPerUnit Seconds per 1 time unit
   */
  constructor(initialPrey, neanderthals, humans, secondsPerUnit) {
    this.initialPrey = initialPrey;

    this.neanderthals = neanderthals;
    this.initialNeanderthals = this.neanderthals.length;
    this.neanderthalAmt = this.initialNeanderthals;

    this.humans = humans;
    this.initialHumans = this.humans.length;
    this.humanAmt = this.initialHumans;

    this.solver = new ODESolver.ODESolver(
        [this.initialPrey, this.initialNeanderthals, this.initialHumans]);

    this.secondsPerUnit = secondsPerUnit;

    // amt of time units from the start of the simulation
    this.timestamp = 0;
    this.delta = 0;
  }

  /**
   * Advance simulation
   * @param {time} time Time units to advance the simulation by
   */
  advance(time) {
    this.timestamp += time;

    this.updatePopulationNumbers();

    // determine amount of deaths
    const neanderthalDeathCount =
        this.neanderthals.length - this.neanderthalAmt;
    const humanDeathCount = this.humans.length - this.humanAmt;

    for (let i = 0; i < neanderthalDeathCount; ++i) {
      const target = Math.round(Math.random() * (this.neanderthals.length - 1));
      this.neanderthals[target].model
          .parent.remove(this.neanderthals[target].model);
      this.neanderthals.splice(target, 1);
    }

    for (let i = 0; i < humanDeathCount; ++i) {
      const target = Math.round(Math.random() * (this.humans.length - 1));
      this.humans[target].model
          .parent.remove(this.humans[target].model);
      this.humans.splice(target, 1);
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
    // calculate new population numbers using the diff eqn solver
    if (this.neanderthalAmt === 0 || this.humanAmt === 0) {
      return false;
    }

    const population = this.solver.solveODE(this.timestamp);
    [this.preyAmt, this.humanAmt, this.neanderthalAmt] = population;

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
}

module.exports = {
  Simulation,
};
