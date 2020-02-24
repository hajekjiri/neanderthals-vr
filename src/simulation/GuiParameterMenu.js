// Author: Woody
// CSC 385 Computer Graphics
// Version Winter 2020
// Group Project Neanderthal VR
// Class GUI: displaying a menu for the user to change the variables of
// our differential equation that determines population numbers

const THREE = require('three');
const GuiVR = require('./GuiVR');
const ODESolver = require('../util/ODESolver');

var alpha, beta, h1, h2, d1, d2, f1, f2, r, k, c1, c2;

class GuiParamMenu extends THREE.Group{

  constructor(){

    super();

    var buttons = [
      new GuiVR.GuiVRButton("FIRE USE AMH",0,0,1,false,
      function(x){
        f1 = x;
      }),
      new GuiVR.GuiVRButton("FIRE USE N",0,0,1,false,
      function(x){
        f2 = x;
      }),
      new GuiVR.GuiVRButton("PREY GROW RATE",1,0,1,false,
      function(x){
        r = x;
      }),
      new GuiVR.GuiVRButton("PREY CARRY CAP",1,0,1,false,
      function(x){
        k = x;
      }),
      new GuiVR.GuiVRButton("FORAGE EFFI AMH",1,0,1,false,
      function(x){
        alpha = x;
      }),
      new GuiVR.GuiVRButton("FORAGE EFFI N",1,0,1,false,
      function(x){
        beta = x;
      }),
      new GuiVR.GuiVRButton("HANDLING AMH",0.894334,0,1,false,
      function(x){
        h1 = x;
      }),
      new GuiVR.GuiVRButton("HANDLING N",1,0,1,false,
      function(x){
        h2 = x;
      }),
      new GuiVR.GuiVRButton("DEATH RATE",0.1,0,0.1,false,
      function(x){
        d1 = x;
        d2 = x;
      }),
    ];

    var parameterMenu = new GuiVR.GuiVRMenu(buttons);
    this.add(parameterMenu);
  }

  // update the parameter of the differential equation
  updateParameter(){
    return new ODESolver.ODESolver(alpha, beta, h1, h2, d1, d2, f1, f2, r, k, c1, c2);
  }


}

module.exports = {
  GuiParamMenu,
}
