const THREE = require('three');
const VRButton = require('three/examples/jsm/webxr/VRButton');
const UserRig = require('./UserRig');
// const OrbitControls =
//    require('three/examples/jsm/controls/OrbitControls.js');
const Base = require('./simulation/models/Base');
const Person = require('./simulation/models/Person');
const Entity = require('./simulation/models/Entity');

let camera;
// let controls;
let scene;
let renderer;
let textBox;
let neanderthalBase;
let humanBase;
let userRig;

let time = 0;
let stop = 1;

let end = false;


/**
 * Init function
 */
const init = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xcccccc );
  // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

  renderer = new THREE.WebGLRenderer( {antialias: true} );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // Add VR button.
  document.body.appendChild(VRButton.VRButton.createButton(renderer));
  renderer.xr.enabled = true;

  camera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / -2,
      window.innerHeight / 2,
      1,
      1500,
  );

  camera.position.set(0, 1.6, 1);

  userRig = new UserRig.UserRig(camera, renderer.xr);
  scene.add(userRig);

  // adjust user's position
  userRig.translateY(150);
  userRig.rotateY(- Math.PI / 4);
  userRig.translateZ(350);

  // controls
  // controls = new OrbitControls.MapControls( camera, renderer.domElement );

  // call this only in static scenes (i.e., if there is no animation loop)
  // controls.addEventListener( 'change', render );

  /*
   * an animation loop is required when
   *  either damping or auto-rotation are enabled
   */
  /*
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  controls.minDistance = 0;
  controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;
  */

  // ground
  let geometry = new THREE.PlaneBufferGeometry(1000, 1000);
  geometry.rotateX(-Math.PI / 2);
  let texture = new THREE.TextureLoader().load(
      '/assets/textures/grass_grass_0125_01_s.jpg',
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  let material = new THREE.MeshPhongMaterial({map: texture});
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // fence
  for (let i = 0; i < 4; ++i) {
    geometry = new THREE.PlaneBufferGeometry(1000, 1);
    geometry.translate(0, 0.5, -500);
    geometry.rotateY(i * Math.PI / 2);
    geometry.scale(1, 50, 1);
    texture = new THREE.TextureLoader().load(
        '/assets/textures/fence.jpg',
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 1);
    material =
        new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  // neanderthal base
  neanderthalBase = new Base.Base('Neanderthals', 0xff0000);

  neanderthalBase.radius = 100;
  neanderthalBase.model.position.set(
      50 + Math.random() * 150,
      1,
      50 + Math.random() * 150,
  );

  for (let i = 0; i < 10; ++i) {
    const n = new Person.Person(Entity.TYPES['TYPE_NEANDERTHAL']);
    neanderthalBase.addEntity(n);
    n.model.rotateY(Math.random() * 2 * Math.PI);
    n.model.translateX(5 + Math.random() * neanderthalBase.radius);
    n.model.rotation.y = 0;
  }
  scene.add(neanderthalBase.model);

  // human base
  humanBase = new Base.Base('humans', 0x00ff00);

  humanBase.radius = 100;
  humanBase.model.position.set(
      -(50 + Math.random() * 150),
      1,
      -(50 + Math.random() * 150),
  );

  for (let i = 0; i < 10; ++i) {
    const h = new Person.Person(Entity.TYPES['TYPE_HUMAN']);
    humanBase.addEntity(h);
    h.model.rotateY(Math.random() * 2 * Math.PI);
    h.model.translateX(5 + Math.random() * humanBase.radius);
    h.model.rotation.y = 0;
  }
  scene.add(humanBase.model);

  textBox = document.createElement('div');
  textBox.style.position = 'absolute';
  textBox.style.zIndex = 1;
  textBox.style.width = 100;
  textBox.style.height = 100;
  textBox.style.backgroundColor = 'white';
  textBox.style.color = 'black';
  textBox.style.padding = '5px';
  textBox.innerHTML =
      `<span style="color: blue;">Neanderthal</span> population:
         ${neanderthalBase.entities.length}<br>
       <span style="color: #ffaa00">Human</span> population:
         ${humanBase.entities.length}`;
  textBox.style.top = '20px';
  textBox.style.left = '20px';
  document.body.appendChild(textBox);

  // lights
  const light = new THREE.AmbientLight( 0xaaaaaa );
  scene.add( light );

  window.addEventListener( 'resize', onWindowResize, false );
};

/**
 * Handle window resize event
 */
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
};

/**
 * Animate function
 */
const animate = () => {
  requestAnimationFrame( animate );

  /*
   * only required if controls.enableDamping = true,
   *  or if controls.autoRotate = true
   */
  // controls.update();

  render();
};

/**
 * Render function
 */
const render = () => {
  if (end === false ) {
    time += 0.01;

    if (time > stop) {
      neanderthalBase.update();
      humanBase.update();

      textBox.innerHTML =
          `<span style="color: blue;">Neanderthal</span> population:
             ${neanderthalBase.entities.length}<br>
           <span style="color: #ffaa00">Human</span> population:
             ${humanBase.entities.length}`;

      if (neanderthalBase.entities.length == 0 ||
          humanBase.entities.length == 0) {
        if (neanderthalBase.entities.length == 0 &&
            humanBase.entities.length == 0 ) {
          textBox.innerHTML += '<br>Both species went extinct.';
        } else if (neanderthalBase.entities.length == 0) {
          textBox.innerHTML +=
              '<br><span style="color: blue;">' +
              'Neanderthals' +
              '</span> went extinct.';
        } else {
          textBox.innerHTML +=
              '<br><span style="color: #ffaa00">' +
              'Humans' +
              '</span> went extinct.';
        }
        end = true;
      }

      stop = time + 0.6;
    }
  }

  renderer.render( scene, camera );
};


init();
// remove when using next line for animation loop (requestAnimationFrame)
// render();
animate();
