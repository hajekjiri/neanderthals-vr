const THREE = require('three');
const VRButton = require('three/examples/jsm/webxr/VRButton');
const UserRig = require('./UserRig');
const Environment = require('./simulation/Environment');
const GuiParam = require('./simulation/GuiParameterMenu');
const GuiVR = require('./simulation/GuiVR');
const Simulation = require('./simulation/Simulation');
const Button = require('./simulation/Button.js');
const PopTextBox = require('./simulation/PopTextBox.js');

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
let deltaText;


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
  paramMenu.translateZ(-1.75);
  paramMenu.translateY(1.6);
  userRig.add(paramMenu);

  // initialize the environment
  const INITIAL_NEANDERTHALS = 100;
  const INITIAL_HUMANS = 100;
  environment =
      new Environment.Environment(INITIAL_NEANDERTHALS, INITIAL_HUMANS);
  environment.rotateX(Math.PI / 2);
  scene.add(environment);
  simulation = new Simulation.Simulation(
      1000,
      INITIAL_NEANDERTHALS,
      INITIAL_HUMANS,
      environment.neanderthalBase,
      environment.humanBase,
      0.01,
      1,
      paramMenu,
      () => {
        // on start
        playPauseButton.play();
      },
      () => {
        // on pause
        playPauseButton.pause();
      },
      () => {
        // on stop
        playPauseButton.pause();
      },
  );

  textBox = new PopTextBox.PopTextBox();
  userRig.add(textBox);
  textBox.rotateY(Math.PI / 3);
  textBox.translateY(2);
  textBox.translateZ(-1.5);

  const playPauseButton = new Button.PlayPauseButton(
      0.25,
      0.1,
      () => {
        simulation.run();
      },
      () => {
        simulation.pause();
      },
  );

  playPauseButton.rotateY(Math.PI / 3);
  playPauseButton.translateY(1.525);
  playPauseButton.translateZ(-1.5);
  playPauseButton.translateX(0.125);
  userRig.add(playPauseButton);

  const resetButton = new Button.ResetButton(
      0.25,
      0.1,
      () => {
        simulation.stop();
        simulation.reset();
      },
      0xffffff,
  );

  resetButton.rotateY(Math.PI / 3);
  resetButton.translateY(1.525);
  resetButton.translateZ(-1.5);
  resetButton.translateX(-0.125);
  userRig.add(resetButton);

  // lights
  const light = new THREE.AmbientLight( 0xaaaaaa );
  scene.add(light);

  window.addEventListener( 'resize', onWindowResize, false );

  // set handler for mouse clicks
  window.onclick = onSelectStart;
  renderer.setAnimationLoop(render);

  clock = new THREE.Clock();

  deltaText = 5;
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
  const delta = clock.getDelta();
  simulation.addDelta(delta);

  deltaText += delta;
  if (deltaText >= 0.1) {
    deltaText = 0;
    textBox.updateNumbers(
        simulation.timestamp, simulation.neanderthalAmt, simulation.humanAmt);
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
