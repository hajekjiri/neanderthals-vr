// Author: Woody
// CSC 385 Computer Graphics
// Version Winter 2020
// Group Project Neanderthal VR
// Class GUI: displaying a menu for the user to change the variables of
// our differential equation that determines population numbers

const THREE = require('three');
const GuiVR = require('./GuiVR');
const ODESolver = require('../util/ODESolver');

class GuiParamMenu extends THREE.Group{

  constructor(){

    super();

    this.alpha;
    this.beta;
    this.h1;
    this.h2;
    this.d1;
    this.d2;
    this.f1;
    this.f2;
    this.r;
    this.k;
    this.c1;
    this.c2;

    var buttons = [
      new GuiVR.GuiVRButton("FIRE USE AMH",0,0,1,false,
      (x) => {
        this.f1 = x;
      }),
      new GuiVR.GuiVRButton("FIRE USE N",0,0,1,false,
      (x) => {
        this.f2 = x;
      }),
      new GuiVR.GuiVRButton("PREY GROW RATE",1,0,1,false,
      (x) => {
        this.r = x;
      }),
      new GuiVR.GuiVRButton("PREY CARRY CAP",1,0,1,false,
      (x) => {
        this.k = x;
      }),
      new GuiVR.GuiVRButton("FORAGE EFFI AMH",1,0,1,false,
      (x) => {
        this.alpha = x;
      }),
      new GuiVR.GuiVRButton("FORAGE EFFI N",1,0,1,false,
      (x) => {
        this.beta = x;
      }),
      new GuiVR.GuiVRButton("HANDLING AMH",0.894334,0,1,false,
      (x) => {
        this.h1 = x;
      }),
      new GuiVR.GuiVRButton("HANDLING N",1,0,1,false,
      (x) => {
        this.h2 = x;
      }),
      new GuiVR.GuiVRButton("DEATH RATE",0.1,0,0.1,false,
      (x) => {
        this.d1 = x;
        this.d2 = x;
      }),
    ];

    var parameterMenu = new GuiVR.GuiVRMenu(buttons);
    this.add(parameterMenu);
  }

  // update the parameter of the differential equation
  updateParameter(initialPopulation){
    return new ODESolver.ODESolver(initialPopulation, this.alpha, this.beta, this.h1, this.h2, this.d1, this.d2, this.f1, this.f2, this.r, this.k, this.c1, this.c2);
  }


}

module.exports = {
  GuiParamMenu,
}
