const THREE = require('three');
const GuiVR = require('../simulation/GuiVR');
const env = require('../../env.json');


/**
 * Generic button
 * @abstract
 */
class Button extends GuiVR.GuiVR {
  /**
   * Constructor
   * @param {number} dimension Width and height of the button
   * @param {number} depth Depth of the button
   * @param {number} color Color of the button
   */
  constructor(dimension, depth, color) {
    super();
    this.dimension = dimension;
    this.depth = depth;
    this.collider = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(this.dimension, this.dimension),
        new THREE.MeshPhongMaterial({color: color}),
    );

    this.add(this.collider);
  }

  /**
   * Click handler
   */
  collide() {
    throw new Error('Collide has to be implemented');
  }
}

/**
 * Button with play and pause signs
 */
class PlayPauseButton extends Button {
  /**
   * Constructor
   * @param {number} dimension Width and height of the button
   * @param {number} depth Depth of the button
   * @param {function} runSimulation Function to run the simulation
   * @param {function} pauseSimulation Function to pause the simulation
   */
  constructor(dimension, depth, runSimulation, pauseSimulation) {
    super(dimension, depth, 0xeeeeee);
    this.runSimulation = runSimulation;
    this.pauseSimulation = pauseSimulation;

    this.STATUS = {
      'PLAY': 0,
      'PAUSE': 1,
    };

    this.status = this.STATUS['PAUSE'];

    this.playSign = new THREE.Group();
    this.playSign.add(
        new THREE.Mesh(
            new THREE.CircleBufferGeometry(
                3 * this.dimension / 10,
                3,
            ),
            new THREE.MeshPhongMaterial(
                {color: 0x000000},
            ),
        ),
    );
    this.playSign.translateX(-0.03);
    this.playSign.translateZ(this.depth / 2 + 0.01);
    this.playSign.visible = true;
    this.add(this.playSign);

    this.pauseSign = new THREE.Group();
    for (let i = 0; i < 2; ++i) {
      const line = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(
              this.dimension / 20 +0.02,
              this.dimension / 2,
          ),
          new THREE.MeshPhongMaterial(
              {color: 0x000000, side: THREE.DoubleSide},
          ),
      );
      line.translateX((-1)**i * 0.04 - 0.03);
      this.pauseSign.add(line);
    }
    this.pauseSign.translateZ(this.depth / 2 + 0.01);
    this.pauseSign.visible = false;
    this.add(this.pauseSign);
  }

  /**
   * Change status to 'PLAY' and show play sign
   */
  play() {
    this.status = this.STATUS['PLAY'];
    this.playSign.visible = false;
    this.pauseSign.visible = true;
  }

  /**
   * Change status to 'PAUSE' and show pause sign
   */
  pause() {
    this.status = this.STATUS['PAUSE'];
    this.playSign.visible = true;
    this.pauseSign.visible = false;
  }

  /**
   * Click handler
   * @param {*} uv Local click intersect coordinates
   * @param {*} pt World click intersect coordinates
   */
  collide(uv, pt) {
    if (this.status === this.STATUS['PLAY']) {
      this.pause();
      this.pauseSimulation();
    } else if (this.status === this.STATUS['PAUSE']) {
      this.play();
      this.runSimulation();
    } else {
      throw Error(`Invalid status '${this.status}' for PlayPauseButton`);
    }
  }
}

/**
 * Button with reset sign
 */
class ResetButton extends Button {
  /**
   * Constructor
   * @param {number} dimension Width and height of the button
   * @param {number} depth Depth of the button
   * @param {function} resetSimulation Function to reset the simulation
   */
  constructor(dimension, depth, resetSimulation) {
    super(dimension, depth, 0xffffff);
    this.resetSimulation = resetSimulation;

    this.resetSign = new THREE.Group();
    const texture = new THREE.TextureLoader().load(
        env['project-prefix'] + '/assets/textures/reset.png',
    );
    texture.repeat.set(1, 1);
    this.collider.material.map = texture;
  }

  /**
   * Click handler
   * @param {*} uv Local click intersect coordinates
   * @param {*} pt World click intersect coordinates
   */
  collide(uv, pt) {
    this.resetSimulation();
  }
};

module.exports = {
  PlayPauseButton,
  ResetButton,
};

