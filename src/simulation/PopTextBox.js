const THREE = require('three');


class PopTextBox extends THREE.Group {
  constructor(initNeanderthals, initHumans) {
    super();
    let label;
    let geometry;
    let texture;
    let material;
    let mesh;
    const WIDTH = 0.5;
    const HEIGHT = 0.1;
    const CANVAS_WIDTH = 512;
    const CANVAS_HEIGHT = 64;
    let offset = 0;

    this.textures = [];

    this.titleCtx = document.createElement('canvas').getContext('2d');
    this.titleCtx.canvas.width = CANVAS_WIDTH;
    this.titleCtx.canvas.height = CANVAS_HEIGHT;
    this.titleCtx.fillStyle = '#000000';
    this.titleCtx.fillRect(0, 0, this.titleCtx.canvas.width, this.titleCtx.canvas.height);
    this.titleCtx.fillStyle = '#cccccc';
    this.titleCtx.fillRect(3, 3, this.titleCtx.canvas.width-6, this.titleCtx.canvas.height-6);

    this.titleCtx.font = '30px Arial';
    this.titleCtx.fillStyle = 'black';
    this.titleCtx.textAlign = 'center';
    label = 'Population info';
    this.titleCtx.strokeText(label, this.titleCtx.canvas.width / 2, this.titleCtx.canvas.height / 1.5);
    this.titleCtx.fillText(label, this.titleCtx.canvas.width / 2, this.titleCtx.canvas.height / 1.5);
    geometry = new THREE.PlaneBufferGeometry(WIDTH, HEIGHT);
    texture = new THREE.CanvasTexture(this.titleCtx.canvas);
    this.textures.push(texture);
    material = new THREE.MeshBasicMaterial({color: 0xAAAAAA, map: texture});
    mesh = new THREE.Mesh(geometry, material);
    mesh.translateY(offset);
    offset -= HEIGHT;
    this.add(mesh);


    this.timeCtx = document.createElement('canvas').getContext('2d');
    this.timeCtx.canvas.width = CANVAS_WIDTH;
    this.timeCtx.canvas.height = CANVAS_HEIGHT;
    this.timeCtx.fillStyle = '#000000';
    this.timeCtx.fillRect(0, 0, this.timeCtx.canvas.width, this.timeCtx.canvas.height);
    this.timeCtx.fillStyle = '#cccccc';
    this.timeCtx.fillRect(3, 3, this.timeCtx.canvas.width-6, this.timeCtx.canvas.height-6);

    this.timeCtx.font = '30px Arial';
    this.timeCtx.fillStyle = 'black';
    this.timeCtx.textAlign = 'left';
    label = 'Time elapsed';
    this.timeCtx.strokeText(label, 15, this.timeCtx.canvas.height / 1.5);
    this.timeCtx.fillText(label, 15, this.timeCtx.canvas.height / 1.5);

    this.timeCtx.fillStyle = 'black';
    this.timeCtx.textAlign = 'right';
    label = '0 years';
    this.timeCtx.strokeText(label, this.timeCtx.canvas.width - 15, this.timeCtx.canvas.height / 1.5);
    this.timeCtx.fillText(label, this.timeCtx.canvas.width - 15, this.timeCtx.canvas.height / 1.5);

    geometry = new THREE.PlaneBufferGeometry(WIDTH, HEIGHT);
    texture = new THREE.CanvasTexture(this.timeCtx.canvas);
    this.textures.push(texture);
    material = new THREE.MeshBasicMaterial({color: 0xAAAAAA, map: texture});
    mesh = new THREE.Mesh(geometry, material);
    mesh.translateY(offset);
    offset -= HEIGHT;
    this.add(mesh);


    this.neanCtx = document.createElement('canvas').getContext('2d');
    this.neanCtx.canvas.width = CANVAS_WIDTH;
    this.neanCtx.canvas.height = CANVAS_HEIGHT;
    this.neanCtx.fillStyle = '#000000';
    this.neanCtx.fillRect(0, 0, this.neanCtx.canvas.width, this.neanCtx.canvas.height);
    this.neanCtx.fillStyle = '#cccccc';
    this.neanCtx.fillRect(3, 3, this.neanCtx.canvas.width-6, this.neanCtx.canvas.height-6);

    this.neanCtx.font = '30px Arial';
    this.neanCtx.fillStyle = 'blue';
    this.neanCtx.textAlign = 'left';
    label = 'Neanderthals';
    this.neanCtx.strokeText(label, 15, this.neanCtx.canvas.height / 1.5);
    this.neanCtx.fillText(label, 15, this.neanCtx.canvas.height / 1.5);

    this.neanCtx.fillStyle = 'black';
    this.neanCtx.textAlign = 'right';
    label = initNeanderthals;
    this.neanCtx.strokeText(label, this.neanCtx.canvas.width - 15, this.neanCtx.canvas.height / 1.5);
    this.neanCtx.fillText(label, this.neanCtx.canvas.width - 15, this.neanCtx.canvas.height / 1.5);

    geometry = new THREE.PlaneBufferGeometry(WIDTH, HEIGHT);
    texture = new THREE.CanvasTexture(this.neanCtx.canvas);
    this.textures.push(texture);
    material = new THREE.MeshBasicMaterial({color: 0xAAAAAA, map: texture});
    mesh = new THREE.Mesh(geometry, material);
    mesh.translateY(offset);
    offset -= HEIGHT;
    this.add(mesh);


    this.humanCtx = document.createElement('canvas').getContext('2d');
    this.humanCtx.canvas.width = CANVAS_WIDTH;
    this.humanCtx.canvas.height = CANVAS_HEIGHT;
    this.humanCtx.fillStyle = '#000000';
    this.humanCtx.fillRect(0, 0, this.humanCtx.canvas.width, this.humanCtx.canvas.height);
    this.humanCtx.fillStyle = '#cccccc';
    this.humanCtx.fillRect(3, 3, this.humanCtx.canvas.width-6, this.humanCtx.canvas.height-6);

    this.humanCtx.font = '30px Arial';
    this.humanCtx.fillStyle = 'red';
    this.humanCtx.textAlign = 'left';
    label = 'Modern humans';
    this.humanCtx.strokeText(label, 15, this.humanCtx.canvas.height / 1.5);
    this.humanCtx.fillText(label, 15, this.humanCtx.canvas.height / 1.5);

    this.humanCtx.fillStyle = 'black';
    this.humanCtx.textAlign = 'right';
    label = initHumans;
    this.humanCtx.strokeText(label, this.humanCtx.canvas.width - 15, this.humanCtx.canvas.height / 1.5);
    this.humanCtx.fillText(label, this.humanCtx.canvas.width - 15, this.humanCtx.canvas.height / 1.5);

    geometry = new THREE.PlaneBufferGeometry(WIDTH, HEIGHT);
    texture = new THREE.CanvasTexture(this.humanCtx.canvas);
    this.textures.push(texture);
    material = new THREE.MeshBasicMaterial({color: 0xAAAAAA, map: texture});
    mesh = new THREE.Mesh(geometry, material);
    mesh.translateY(offset);
    this.add(mesh);
  }

  updateNumbers(time, neanderthalsAmt, humansAmt) {
    let label;

    this.neanCtx.fillStyle = '#000000';
    this.neanCtx.fillRect(0, 0, this.neanCtx.canvas.width, this.neanCtx.canvas.height);
    this.neanCtx.fillStyle = '#cccccc';
    this.neanCtx.fillRect(3, 3, this.neanCtx.canvas.width-6, this.neanCtx.canvas.height-6);

    this.neanCtx.font = '30px Arial';
    this.neanCtx.fillStyle = 'blue';
    this.neanCtx.textAlign = 'left';
    label = 'Neanderthals';
    this.neanCtx.strokeText(label, 15, this.neanCtx.canvas.height / 1.5);
    this.neanCtx.fillText(label, 15, this.neanCtx.canvas.height / 1.5);

    this.neanCtx.fillStyle = 'black';
    this.neanCtx.textAlign = 'right';
    label = neanderthalsAmt;
    this.neanCtx.strokeText(label, this.neanCtx.canvas.width - 15, this.neanCtx.canvas.height / 1.5);
    this.neanCtx.fillText(label, this.neanCtx.canvas.width - 15, this.neanCtx.canvas.height / 1.5);


    this.timeCtx.fillStyle = '#000000';
    this.timeCtx.fillRect(0, 0, this.timeCtx.canvas.width, this.timeCtx.canvas.height);
    this.timeCtx.fillStyle = '#cccccc';
    this.timeCtx.fillRect(3, 3, this.timeCtx.canvas.width-6, this.timeCtx.canvas.height-6);

    this.timeCtx.font = '30px Arial';
    this.timeCtx.fillStyle = 'black';
    this.timeCtx.textAlign = 'left';
    label = 'Time elapsed';
    this.timeCtx.strokeText(label, 15, this.timeCtx.canvas.height / 1.5);
    this.timeCtx.fillText(label, 15, this.timeCtx.canvas.height / 1.5);

    this.timeCtx.fillStyle = 'black';
    this.timeCtx.textAlign = 'right';
    label = `${time} years`;
    this.timeCtx.strokeText(label, this.timeCtx.canvas.width - 15, this.timeCtx.canvas.height / 1.5);
    this.timeCtx.fillText(label, this.timeCtx.canvas.width - 15, this.timeCtx.canvas.height / 1.5);


    this.humanCtx.fillStyle = '#000000';
    this.humanCtx.fillRect(0, 0, this.humanCtx.canvas.width, this.humanCtx.canvas.height);
    this.humanCtx.fillStyle = '#cccccc';
    this.humanCtx.fillRect(3, 3, this.humanCtx.canvas.width-6, this.humanCtx.canvas.height-6);

    this.humanCtx.font = '30px Arial';
    this.humanCtx.fillStyle = 'red';
    this.humanCtx.textAlign = 'left';
    label = 'Modern humans';
    this.humanCtx.strokeText(label, 15, this.humanCtx.canvas.height / 1.5);
    this.humanCtx.fillText(label, 15, this.humanCtx.canvas.height / 1.5);

    this.humanCtx.fillStyle = 'black';
    this.humanCtx.textAlign = 'right';
    label = humansAmt;
    this.humanCtx.strokeText(label, this.humanCtx.canvas.width - 15, this.humanCtx.canvas.height / 1.5);
    this.humanCtx.fillText(label, this.humanCtx.canvas.width - 15, this.humanCtx.canvas.height / 1.5);


    for (let i = 0; i < this.textures.length; ++i) {
      this.textures[i].needsUpdate = true;
    }
  }
}


module.exports = {
  PopTextBox,
};

