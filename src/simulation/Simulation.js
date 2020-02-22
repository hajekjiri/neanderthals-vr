/**
 * Simulation wrapper
 */
class Simulation {
  /**
   * Constructor
   * @param {Array} neanderthals Array of neanderthals
   * @param {Array} humans Array of humans
   * @param {number} secondsPerUnit Seconds per 1 time unit
   */
  constructor(neanderthals, humans, secondsPerUnit) {
    this.neanderthals = neanderthals;
    this.humans = humans;
    this.neanderthalAmt = this.neanderthals.length;
    this.humanAmt = this.humans.length;
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

    // TODO - remove loop when implemented with diff eqns
    for (let i = 0; i < time; ++i) {
      this.updatePopulationNumbers();
    }

    // randomly determine amount of deaths
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

    this.neanderthalAmt -= parseInt(Math.random() * 4);
    if (this.neanderthalAmt < 0) {
      this.neanderthalAmt = 0;
    }

    this.humanAmt -= parseInt(Math.random() * 4);
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
