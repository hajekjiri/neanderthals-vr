const THREE = require('three');
const VRButton = require('three/examples/jsm/webxr/VRButton');
const UserRig = require('./UserRig');
const Environment = require('./simulation/Environment');
const GuiParam = require('./simulation/GuiParameterMenu');
const GuiVR = require('./simulation/GuiVR');
const Simulation = require('./simulation/Simulation');
const Button = require('./simulation/Button.js');

let camera;

// parameter control menu
let paramMenu;

// let controls;
let scene;
let renderer;
let textBox;
let userRig;
let environment;
let simulation;
let clock;


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

  camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      1,
      1000,
  );

  camera.position.set(0, 1.6, 1);

  userRig = new UserRig.UserRig(camera, renderer.xr);
  scene.add(userRig);

  // adjust user's position
  userRig.translateZ(200);
  // add parameter control menu

  paramMenu = new GuiParam.GuiParamMenu();
  paramMenu.rotateY(-Math.PI / 3);
  paramMenu.translateZ(-1);
  paramMenu.translateY(1.6);
  userRig.add(paramMenu);

  // initialize the environment
  environment = new Environment.Environment(100, 100);
  environment.rotateX(Math.PI / 2);
  //environment.translateY(-100);
  scene.add(environment);
  simulation = new Simulation.Simulation(
      1000,
      environment.neanderthalBase,
      environment.humanBase,
      0.1,
      1,
      paramMenu,
  );

  let button = new Button.PlayPauseButton(
      0.5,
      0.1,
      () => {
        simulation.run();
      },
      () => {
        simulation.pause();
      },
  );

  simulation.pauseButton = () => {
    button.pause()
  };


  button.rotateY(Math.PI / 3);
  button.translateY(1.2);
  button.translateZ(-1);
  userRig.add(button);

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

  window.addEventListener( 'resize', onWindowResize, false );

  // set handler for mouse clicks
  window.onclick = onSelectStart;
  renderer.setAnimationLoop(render);

  clock = new THREE.Clock();
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
  render();
};

/**
 * Render function
 */
const render = () => {
  simulation.addDelta(clock.getDelta());

  textBox.innerHTML =
      `Time passed: ${simulation.timestamp} years<br>
      <span style="color: blue;">Neanderthal</span> population:
        ${simulation.neanderthalAmt}<br>
      <span style="color: #ffaa00">Human</span> population:
        ${simulation.humanAmt}`;

  if (simulation.neanderthalAmt == 0 ||
      simulation.humanAmt == 0) {
    if (simulation.neanderthalAmt == 0 &&
        simulation.humanAmt == 0 ) {
      textBox.innerHTML += '<br>Both species went extinct.';
    } else if (simulation.neanderthalAmt == 0) {
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
  }

  renderer.render( scene, camera );
};

/**
 * Event handler for controller clicks when in VR mode, and for mouse
 *  clicks outside of VR mode
 * @param {*} event Event object
 */
const onSelectStart = (event) => {
  if (event instanceof MouseEvent && !renderer.xr.isPresenting) {
    // Handle mouse click outside of VR.
    // Determine screen coordinates of click.
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    // Create raycaster from the camera through the click into the scene.
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Register the click into the GUI.
    GuiVR.intersectObjects(raycaster);
  }
};

init();
// remove when using next line for animation loop (requestAnimationFrame)
// render();
animate();
