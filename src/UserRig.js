const THREE = require('three');

/**
 * Userrig object wrapper
 */
class UserRig extends THREE.Group {
  /**
   * Constructor
   * @param {THREE.PerspectiveCamera} camera User's camera
   * @param {*} xr XR object
   */
  constructor(camera, xr) {
    super();

    this.add(camera); // Add camera to the rig.
    this.xr = xr;
    this.controllers = [];

    // Set up the controller to be represented as a line.
    // This code use to be in init() in main.js.
    for (let i = 0; i < 2; i++) {
      const controller = xr.getController(i);
      if (controller != undefined) {
        this.controllers.push(controller);

        controller.addEventListener(
            'selectstart',
            (ev) => this.onSelectStartVR(ev),
        );

        controller.addEventListener(
            'selectend',
            (ev) => this.onSelectEndVR(ev),
        );

        this.add(controller); // Add controller to the rig.
        const controllerPointer = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0, 0, -1),
            ]),
            new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 4}),
        );

        controllerPointer.name = 'pointer';
        controllerPointer.scale.z = 20;
        controller.add(controllerPointer.clone());
      }
    }
  }

  /**
   * Returns the nth controller if it exists, and undefined otherwise.
   * @param {number} n Controller's index
   * @return {*} Controller object
   */
  getController(n) {
    if (n >= 0 && n < this.controllers.length) {
      return this.controllers[n];
    } else {
      return undefined;
    }
  }

  /**
   * On select start event handler
   * @param {*} event Event object
   */
  onSelectStartVR(event) {
    if (!(event instanceof MouseEvent) && this.xr.isPresenting()) {
      // Handle controller click in VR.

      // Retrieve the pointer object.
      const controller = event.target;

      for (let i = 0; i < this.controllers.length; i++) {
        if (controller == this.controllers[i]) {
          controller.triggered = true;
        }
      }

      // Create raycaster from the controller position along the
      // pointer line.
      const tempMatrix = new THREE.Matrix4();
      tempMatrix.identity().extractRotation(controller.matrixWorld);
      const raycaster = new THREE.Raycaster();
      raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

      // Register the click into the GUI.
      GUIVR.intersectObjects(raycaster);
    }
  }

  /**
   * On select end event handler
   * @param {*} event Event object
   */
  onSelectEndVR(event) {
    if (!(event instanceof MouseEvent) && this.xr.isPresenting()) {
      const controller = event.target;

      for (let i = 0; i < this.controllers.length; i++) {
        if (controller == this.controllers[i]) {
          controller.triggered = false;
        }
      }
    }
  }
}

module.exports = {
  UserRig,
};
