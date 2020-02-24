const THREE = require('three');
const VRButton = require('three/examples/jsm/webxr/VRButton');
const UserRig = require('./UserRig');
// const OrbitControls =
//    require('three/examples/jsm/controls/OrbitControls.js');
const Base = require('./simulation/models/Base');
const Person = require('./simulation/models/Person');
const Entity = require('./simulation/models/Entity');
const Environment = require('./simulation/Environment');
const GuiParam = require('./simulation/GuiParameterMenu');
const GuiVR = require('./simulation/GuiVR');

let camera;

// parameter control menu
let paramMenu;

// let controls;
let scene;
let renderer;
let textBox;
let userRig;
let environment;

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
      1600,
  );

  camera.position.set(0, 1.6, 1);

  // add parameter control menu
  paramMenu = new GuiParam.GuiParamMenu();
  paramMenu.position.x = 3.5;
  paramMenu.position.y = -1;
  paramMenu.position.z = -2;
  camera.add(paramMenu);

  userRig = new UserRig.UserRig(camera, renderer.xr);
  scene.add(userRig);

  // adjust user's position
  userRig.translateY(150);
  userRig.rotateY(- Math.PI / 4);
  userRig.translateZ(350);

  // initialize the environment
  environment = new Environment.Environment();
  scene.add(environment);

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
/*
  // ground
  let geometry = new THREE.PlaneBufferGeometry(1000, 1000);
  geometry.rotateX(-Math.PI / 2);
  let texture = new THREE.TextureLoader().load(
      '/assets/textures/grass-meadow-green-juicy-53504.jpg',
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

    //land = new Environment.Environment();
    //scene.add(land);

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
  */

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
         ${environment.getNeanderthalPopulation()}<br>
       <span style="color: #ffaa00">Human</span> population:
         ${environment.getHumanPopulation()}`;
  textBox.style.top = '20px';
  textBox.style.left = '20px';
  document.body.appendChild(textBox);

  // lights
  const light = new THREE.AmbientLight( 0xaaaaaa );
  scene.add(light);

  // Add VR button
  document.body.appendChild(VRButton.VRButton.createButton(renderer));
  window.addEventListener( 'resize', onWindowResize, false );

  // set handler for mouse clicks
  window.onclick = onSelectStart;
  renderer.setAnimationLoop(render);
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
      environment.neanderthalBase.update();
      environment.humanBase.update();

      textBox.innerHTML =
          `<span style="color: blue;">Neanderthal</span> population:
             ${environment.getNeanderthalPopulation()}<br>
           <span style="color: #ffaa00">Human</span> population:
             ${environment.getHumanPopulation()}`;

      if (environment.getNeanderthalPopulation() == 0 ||
          environment.getHumanPopulation() == 0) {
        if (environment.getNeanderthalPopulation() == 0 &&
            environment.getHumanPopulation() == 0 ) {
          textBox.innerHTML += '<br>Both species went extinct.';
        } else if (environment.getNeanderthalPopulation() == 0) {
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

// Event handler for controller clicks when in VR mode, and for mouse
// clicks outside of VR mode
function onSelectStart(event){

    if (event instanceof MouseEvent && !renderer.xr.isPresenting()){
      // Handle mouse click outside of VR.
      // Determine screen coordinates of click.
      var mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
      // Create raycaster from the camera through the click into the scene.
      var raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Register the click into the GUI.
      GuiVR.intersectObjects(raycaster);
    }
}

init();
// remove when using next line for animation loop (requestAnimationFrame)
// render();
animate();
