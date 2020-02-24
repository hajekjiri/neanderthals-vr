const THREE = require('three');

class PersonModel extends THREE.Group{

  constructor(color){

    super();

    var material = new THREE.MeshPhongMaterial({color:color});

    var hairs = new THREE.Group();
    CustomSinCurve.prototype = Object.create(THREE.Curve.prototype);
    CustomSinCurve.prototype.constructor = CustomSinCurve;
    CustomSinCurve.prototype.getPoint = function(t){
      var tx = t * 3 - 1.5;
      var ty = Math.sin( 2 * Math.PI * t );
      var tz = 0;
      return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    };
    var path = new CustomSinCurve();

    var hairs = new THREE.Group();
    var hairGeometry = new THREE.TubeGeometry(path, 20, 0.1, 100, false);
    var numOfHair = 0;
    for(numOfHair = 0; numOfHair < 4; numOfHair ++){
      var hair = new THREE.Mesh(hairGeometry,material);
      hair.position.y = 1.96;
      hair.scale.x = 0.2;
      hair.scale.y = 0.2;
      hair.scale.z = 0.2;
      hair.rotation.y = THREE.Math.degToRad(90*numOfHair);
      if (numOfHair == 0){
        hair.position.x = 0.2;
      }
      else if (numOfHair == 1){
        hair.position.z = -0.2;
      }
      else if (numOfHair == 2){
        hair.position.x = -0.2;
      }
      else{
        hair.position.z = 0.2;
      }
      hairs.add(hair);
    }
    this.add(hairs)


    var headGeo = new THREE.SphereGeometry(0.15,32,32);
    var head = new THREE.Mesh(headGeo, material);
    head.geometry.center();
    head.position.y = 2;
    this.add(head);

    var bodyGeo = new THREE.BoxGeometry(0.25,0.8,0.25);
    var body = new THREE.Mesh(bodyGeo, material);
    body.position.y = 1.45;
    this.add(body);

    var legGeo = new THREE.BoxGeometry(0.1,0.6,0.1);
    var leg1 = new THREE.Mesh(legGeo, material);
    var leg2 = new THREE.Mesh(legGeo, material);
    leg1.position.y = 0.8;
    leg2.position.y = 0.8;
    leg1.position.z = 0.1;
    leg2.position.z = -0.1;
    this.add(leg1);
    this.add(leg2);

    var armGeo = new THREE.BoxGeometry(0.1,0.5,0.1);
    var arm1 = new THREE.Mesh(armGeo, material);
    var arm2 = new THREE.Mesh(armGeo, material);
    arm1.rotation.y = THREE.Math.degToRad(90);
    arm2.rotation.y = THREE.Math.degToRad(90);
    arm1.rotation.z = THREE.Math.degToRad(30);
    arm2.rotation.z = THREE.Math.degToRad(-30);
    arm1.position.z = -0.2;
    arm2.position.z = 0.2;
    arm1.position.y = 1.5;
    arm2.position.y = 1.5;
    this.add(arm1);
    this.add(arm2);

    this.scale.x = 20;
    this.scale.y = 20;
    this.scale.z = 20;

  }

  getOld(){

  }

}

function CustomSinCurve(scale){
  THREE.Curve.call(this);
  this.scale = (scale === undefined) ? 1 : scale;
}

module.exports = {
  PersonModel,
};
