/* eslint require-jsdoc: 0 */
// Author: Matthew Anderson
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 1: Simple graphical user interface for VR.

const THREE = require('three');

const guiElements = [];

function intersectObjects(raycaster) {
  //
  const colliders = [];
  for (let i = 0; i < guiElements.length; i++) {
    colliders.push(guiElements[i].collider);
  }

  const intersections = raycaster.intersectObjects(colliders);

  if (intersections.length > 0) {
    const intersection = intersections[0];
    const object = intersection.object;
    for (let i = 0; i < guiElements.length; i++) {
      if (guiElements[i].collider == object) {
        guiElements[i].collide(intersection.uv, intersection.point);
        return guiElements[i];
      }
    }
  }
}

class GuiVR extends THREE.Group {
  constructor() {
    super();
    if (new.target==GuiVR) {
      throw new TypeError('GuiVR is abstrat class and cannot be instantiated.');
    }
    this.collider = undefined;
    guiElements.push(this);
  }
}

const epsilon = 0.03;

// Class for VR representation of sliding menu button, not intended to
// used outside of a GuiVRMenu.
class GuiVRButton extends THREE.Group {
  // Creates a new menu button with the provided string label Has an
  // initial value initVal and ranges between minVal and maxVal.
  // isInt should be set to true of the value is integer.
  // updateCallback is called to report a value entered.
  // updateCallback is called once by this constructor and then each
  // time the value changes.
  constructor(label, initVal, minVal, maxVal, isInt, updateCallback) {
    super();

    this.label = label;
    this.val = initVal;
    this.minVal = minVal;
    this.maxVal = maxVal;
    this.isInt = isInt;
    this.updateCallback = updateCallback;

    this.updateCallback(this.val);

    this.w = 1;
    this.h = 0.1;
    // Create canvas that will display the button.
    this.ctx = document.createElement('canvas').getContext('2d');
    this.ctx.canvas.width = 650;
    this.ctx.canvas.height = Math.floor(
        this.ctx.canvas.width * this.h / this.w);
    // Create texture from canvas.
    this.texture = new THREE.CanvasTexture(this.ctx.canvas);
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.minFilter = THREE.LinearFilter;
    this.updateTexture();
    this.meshMaterial = new THREE.MeshBasicMaterial({color: 0xAAAAAA});
    this.meshMaterial.map = this.texture;
    // Create rectangular mesh textured with the button that is displayed.
    this.mesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(this.w, this.h),
        this.meshMaterial,
    );
    this.add(this.mesh);
  }

  // Update the display of the button according to the current value.
  updateTexture() {
    const ctx = this.ctx;
    // Clear canvas.
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#555753';
    ctx.fillRect(3, 3, ctx.canvas.width-6, ctx.canvas.height-6);
    // Display label.
    ctx.font = '30px Arial';
    ctx.fillStyle = '#729FCF';
    ctx.textAlign = 'left';
    ctx.strokeText(this.label, 15, ctx.canvas.height/1.5);
    ctx.fillText(this.label, 15, ctx.canvas.height/1.5);
    // Display slider at current value.
    const intervalWidth = 1 / (this.maxVal - this.minVal);
    const width = Math.floor(
        (this.val - this.minVal) * intervalWidth *
        (Math.floor(ctx.canvas.width/2) - 3));
    ctx.fillStyle = '#729FCF';
    ctx.fillRect(
        Math.floor(ctx.canvas.width/2), 3, width, ctx.canvas.height - 6);
    ctx.fillStyle = '#000000';
    ctx.fillRect(
        Math.floor(ctx.canvas.width/2)-6, 3, 6, ctx.canvas.height - 6);
    // Display current value.
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'right';
    if (this.isInt) {
      ctx.fillText(this.val, ctx.canvas.width - 15, ctx.canvas.height/1.5);
    } else {
      ctx.fillText(
          this.val.toFixed(2), ctx.canvas.width - 15, ctx.canvas.height/1.5);
    }
    this.texture.needsUpdate = true;
  }

  // Click handler.  Determines whether slider is hit and if so
  // computes new value.  The updateCallback is called to report the
  // value is modified.
  collide(uv, pt) {
    let val = 0;
    if (uv.x < 0.50 - epsilon) {
    // Doesn't hit slider.
      return;
    }
    if (uv.x < 0.5) {
      // Extra space to select minVal.
      val = this.minVal;
    } else if (uv.x > 1 - epsilon) {
      // Extra space to select maxVal.
      val = this.maxVal;
    } else {
      // Hit slider.

      // Determine amount selected.
      const alpha = Math.min((uv.x - 0.5)/(0.5 - epsilon/2), 1);

      // Compute value at selection.
      val = 0;
      if (this.isInt) {
        const intervalWidth = 1 / (this.maxVal - this.minVal + 1);
        val = Math.floor(alpha / intervalWidth) + this.minVal;
      } else {
        val = alpha * (this.maxVal - this.minVal) + this.minVal;
      }
    }

    // Update value and call updateCallback if necessary.
    if (val != this.val) {
      this.val = val;
      this.updateCallback(this.val);
      this.updateTexture();
    }
  }
}

// Class for VR representation of a menu.
class GuiVRMenu extends GuiVR {
  constructor(buttonList) {// Creates a new menu with the specified buttons.
    super();
    this.w = 0;
    this.h = 0;
    this.buttonList = [];
    this.matrixRel = undefined;
    // Determine the total dimensions.
    for (let i = 0; i < buttonList.length; i++) {
      const button = buttonList[i];
      this.h += button.h;
      this.w = Math.max(this.w, button.w);
    }

    // Position buttons and add to this group.
    let h = 0;
    for (let i = 0; i < buttonList.length; i++) {
      const button = buttonList[i];
      this.add(button);
      this.buttonList.push(button);
      button.position.y = this.h/2 - h - button.h/2;
      button.position.z += 0.01;
      h += button.h;
    }

    // Create a collider.
    this.collider = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(this.w, this.h),
        new THREE.MeshBasicMaterial({color: 0x000000}),
    );
    this.add(this.collider);
  }

  // Click handler.  Determine which button is hit and then calls
  // that button's collide.
  collide(uv, pt) {
    let v = 1;

    // Loop over the button locations.
    for (let i = 0; i < this.buttonList.length; i++) {
      // uv coords have y inverted.
      const vNext = v - this.buttonList[i].h / this.h;

      if (uv.y > vNext) {
        const uvNew = {x: uv.x, y: (uv.y - vNext)/this.buttonList[i].h};
        this.buttonList[i].collide(uvNew, pt);
        return;
      }
      v = vNext;
    }
  }
  // Causes the object to follow the specified matrixWorld relative
  // to the menu's relative position when this function is first
  // called.
  follow(matrixWorld) {
    // Compute the current world pose to use as the relative pose
    // for this and future calls to follow.
    if (this.matrixRel == undefined) {
      this.updateMatrixWorld();
      this.matrixRel = this.matrixWorld.clone();
    }
    // Determine the pose to move to relative to matrixWorld.
    const tempMatrix = new THREE.Matrix4().identity();
    tempMatrix.multiplyMatrices(matrixWorld, this.matrixRel);

    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    tempMatrix.decompose(pos, quat, scale);

    // Update pose.
    this.position.copy(pos);
    this.quaternion.copy(quat);
    this.updateMatrix();
  }
}

module.exports = {
  intersectObjects,
  GuiVRMenu,
  GuiVRButton,
  GuiVR,
};
