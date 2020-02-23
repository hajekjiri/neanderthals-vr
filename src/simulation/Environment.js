const THREE = require('three');
//var FBXLoader = require('./assets/Loaders/FBXLoader');

var entities = [];
var coords = [];

export class Environment extends THREE.Group {

    constructor(){
      super();

      this.area = new THREE.Group();

      // terrain
      this.floor = new THREE.PlaneBufferGeometry(1000, 1000);
      this.floor.rotateX = (-Math.PI /2);
      this.texture1 = new THREE.TextureLoader().load(
        '/assets/textures/grass_grass_0125_01_s.jpg',
    );
      this.texture1.wrapS = THREE.RepeatWrapping;
      this.texture1.wrapT = THREE.RepeatWrapping;
      this.texture1.repeat.set(10, 10);

      this.ground = new THREE.MeshPhongMaterial({map: this.texture1});
      this.terrain = new THREE.Mesh(this.floor, this.texture1);
      this.area.add(this.terrain);

      // trees and rocks
//      var loader = new FBXLoader();

//      loader.load('/assets/textures/Lowpoly_tree_sample.fbx',
//      function (object3d) {
//      this.area.add(object3d);
//    }
//  );


//      loader.load('/assets/textures/Rock1.fbx',
//      function (object3d) {
//      this.area.add(rock);
//    }
//);

      this.bark = new THREE.CylinderBufferGeometry(5,5,20,32);
      this.texture2 = new THREE.TextureLoader().load(
        '/assets/textures/tree.jpg',
      )
      this.texture2.wrapS = THREE.RepeatWrapping;
      this.texture2.wrapT = THREE.RepeatWrapping;
      this.texture2.repeat.set(10, 10);
      this.treeBark = new THREE.MeshPhongMaterial({map:this.texture2})
      this.tree = new THREE.InstancedMesh(this.bark, this.treeBark, 30);
      this.area.add(this.tree);












    }






}
