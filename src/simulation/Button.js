const THREE = require('three');
const GuiVR = require('../simulation/GuiVR');


class Button extends GuiVR.GuiVR {
  constructor(dimension, depth) {
    super();
    this.dimension = dimension;
    this.depth = depth;
    this.collider = new THREE.Mesh(
        new THREE.BoxBufferGeometry(dimension, dimension, depth),
        new THREE.MeshPhongMaterial({color: 0xeeeeee}),
    );

    this.add(this.collider);
  }

  collide(uv, pt) {
    throw new Error('Collide has to be implemented');
  }
}

class PlayPauseButton extends Button {
  constructor(dimension, depth, runSimulation, pauseSimulation) {
    super(dimension, depth);
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
    this.playSign.translateX(-0.01);
    this.playSign.translateZ(this.depth / 2 + 0.01);
    this.playSign.visible = true;
    this.add(this.playSign);

    this.pauseSign = new THREE.Group();
    for (let i = 0; i < 2; ++i) {
      let line = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(
              this.dimension / 20 +0.03,
              this.dimension / 2,
          ),
          new THREE.MeshPhongMaterial(
              {color: 0x000000, side: THREE.DoubleSide},
          ),
      );
      line.translateX((-1)**i * 0.075);
      this.pauseSign.add(line);
    }
    this.pauseSign.translateZ(this.depth / 2 + 0.01);
    this.pauseSign.visible = false;
    this.add(this.pauseSign);
  }

  play() {
    this.status = this.STATUS['PLAY'];
    this.playSign.visible = false;
    this.pauseSign.visible = true;
  }

  pause() {
    this.status = this.STATUS['PAUSE'];
    this.playSign.visible = true;
    this.pauseSign.visible = false;
  }

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


module.exports = {
  PlayPauseButton,
}

