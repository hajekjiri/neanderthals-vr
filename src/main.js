import * as THREE from 'three';
import {BoxLineGeometry} from
  'three/examples/jsm/geometries/BoxLineGeometry.js';
import {VRButton} from 'three/examples/jsm/webxr/VRButton.js';

const clock = new THREE.Clock();

let container;
let camera; let scene; let raycaster; let renderer;

let room;

let controller; const tempMatrix = new THREE.Matrix4();
let INTERSECTED;

init();
animate();

/**
 * Initializes the scene
 */
function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x505050 );

  camera = new THREE.PerspectiveCamera(
      50, window.innerWidth / window.innerHeight, 0.1, 10 );
  camera.position.set( 0, 1.6, 3 );
  scene.add( camera );

  room = new THREE.LineSegments(
      new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
      new THREE.LineBasicMaterial( {color: 0x808080} ),
  );
  scene.add( room );

  scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

  const light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 1 ).normalize();
  scene.add( light );

  const geometry = new THREE.BoxBufferGeometry( 0.15, 0.15, 0.15 );

  for ( let i = 0; i < 200; i ++ ) {
    const object = new THREE.Mesh(
        geometry, new THREE.MeshLambertMaterial(
            {color: Math.random() * 0xffffff},
        ),
    );

    object.position.x = Math.random() * 4 - 2;
    object.position.y = Math.random() * 4;
    object.position.z = Math.random() * 4 - 2;

    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;

    object.scale.x = Math.random() + 0.5;
    object.scale.y = Math.random() + 0.5;
    object.scale.z = Math.random() + 0.5;

    object.userData.velocity = new THREE.Vector3();
    object.userData.velocity.x = Math.random() * 0.01 - 0.005;
    object.userData.velocity.y = Math.random() * 0.01 - 0.005;
    object.userData.velocity.z = Math.random() * 0.01 - 0.005;

    room.add( object );
  }

  raycaster = new THREE.Raycaster();

  renderer = new THREE.WebGLRenderer( {antialias: true} );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.xr.enabled = true;
  container.appendChild( renderer.domElement );

  controller = renderer.xr.getController( 0 );
  controller.addEventListener( 'selectstart', function() {
    window.userData.isSelecting = true;
  } );
  controller.addEventListener( 'selectend', function() {
    window.userData.isSelecting = false;
  } );
  controller.addEventListener( 'connected', function( event ) {
    window.add( buildController( event.data ) );
  } );
  controller.addEventListener( 'disconnected', function() {
    window.remove( window.children[0] );
  } );
  scene.add( controller );

  window.addEventListener( 'resize', onWindowResize, false );

  //

  document.body.appendChild( VRButton.createButton( renderer ) );
}

/**
 * Builds controller
 * @param {Event} data
 * @return {THREE.Mesh} line
 */
function buildController( data ) {
  switch ( data.targetRayMode ) {
    case 'tracked-pointer': {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute( [0, 0, 0, 0, 0, - 1], 3 ),
      );
      geometry.setAttribute(
          'color',
          new THREE.Float32BufferAttribute( [0.5, 0.5, 0.5, 0, 0, 0], 3 ),
      );

      const material = new THREE.LineBasicMaterial(
          {vertexColors: true, blending: THREE.AdditiveBlending},
      );

      return new THREE.Line( geometry, material );
    }

    case 'gaze': {
      const geometry = new THREE.RingBufferGeometry( 0.02, 0.04, 32 )
          .translate( 0, 0, - 1 );
      const material = new THREE.MeshBasicMaterial(
          {opacity: 0.5, transparent: true},
      );
      return new THREE.Mesh( geometry, material );
    }
  }
}

/**
 * Handler for window resize
 */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

//

/**
 * Start animating
 */
function animate() {
  renderer.setAnimationLoop( render );
}

/**
 * Render scene
 */
function render() {
  const delta = clock.getDelta() * 60;

  if ( controller.userData.isSelecting === true ) {
    const cube = room.children[0];
    room.remove( cube );

    cube.position.copy( controller.position );
    cube.userData.velocity.x = ( Math.random() - 0.5 ) * 0.02 * delta;
    cube.userData.velocity.y = ( Math.random() - 0.5 ) * 0.02 * delta;
    cube.userData.velocity.z = ( Math.random() * 0.01 - 0.05 ) * delta;
    cube.userData.velocity.applyQuaternion( controller.quaternion );
    room.add( cube );
  }

  // find intersections

  tempMatrix.identity().extractRotation( controller.matrixWorld );

  raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
  raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

  const intersects = raycaster.intersectObjects( room.children );

  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[0].object ) {
      if ( INTERSECTED ) {
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex );
      }

      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 0xff0000 );
    }
  } else {
    if ( INTERSECTED ) {
      INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
    }

    INTERSECTED = undefined;
  }

  // Keep cubes inside room

  for ( let i = 0; i < room.children.length; i ++ ) {
    const cube = room.children[i];

    cube.userData.velocity.multiplyScalar( 1 - ( 0.001 * delta ) );

    cube.position.add( cube.userData.velocity );

    if ( cube.position.x < - 3 || cube.position.x > 3 ) {
      cube.position.x = THREE.Math.clamp( cube.position.x, - 3, 3 );
      cube.userData.velocity.x = - cube.userData.velocity.x;
    }

    if ( cube.position.y < 0 || cube.position.y > 6 ) {
      cube.position.y = THREE.Math.clamp( cube.position.y, 0, 6 );
      cube.userData.velocity.y = - cube.userData.velocity.y;
    }

    if ( cube.position.z < - 3 || cube.position.z > 3 ) {
      cube.position.z = THREE.Math.clamp( cube.position.z, - 3, 3 );
      cube.userData.velocity.z = - cube.userData.velocity.z;
    }

    cube.rotation.x += cube.userData.velocity.x * 2 * delta;
    cube.rotation.y += cube.userData.velocity.y * 2 * delta;
    cube.rotation.z += cube.userData.velocity.z * 2 * delta;
  }

  renderer.render( scene, camera );
}
