var play = true;
var perturbOnMove = true;
var place         = true;
var numberOfEvolutionsPerFrame = 1;
var velocity = 0.4;
var Nx = 30;//150;
var Ny = 20;//90;
var dr = 7;
var W, H;
var dampingFactor = 0.975;
var wave;
var coloring;
var button;



function setup(){
  let myCanvas = createCanvas(windowWidth,floor(windowHeight/8));
  myCanvas.parent('myContainer');
  myCanvas.position(0,0,'fixed');
  W = width;
  H = height;

  noCursor();


  W = width;
  H = height;
  Nx = int(1.1*W/dr);
  Ny = int(H/dr);
  wave = new Wave(velocity,W,H,Nx,Ny);
  wave.createLattice();

  createMyButtons();

  strokeWeight(2*dr);
}

function draw(){
    background(14,5,0);

  if(play){
    for(var i=0; i<numberOfEvolutionsPerFrame; i++){
      wave.evolve();
      wave.damping(dampingFactor);
    }
  }
    wave.showLinesHorizontal();

}



function Wave(c,W,H,Nx,Ny){
  this.K = c; //  (cdt/dx)^2
  this.W = W;
  this.H = H;
  this.Nx = Nx;
  this.Ny = Ny;
}

Wave.prototype.createLattice = function(){
  var Unew  = new Array(this.Nx);
  var U     = new Array(this.Nx);
  var Up    = new Array(this.Nx);
  var Utemp = new Array(this.Nx);
  var C     = new Array(this.Nx);
  for(var i=0; i<this.Nx; i++){
    Unew[i]   = 0.0;
    U[i]      = 0.0;
    Up[i]     = 0.0;
    Utemp[i]  = 0.0;
    C[i]      = false;
  }
  this.U = U;
  this.Unew = Unew;
  this.Up = Up;
  this.C = C;
  this.Utemp = Utemp;
}

Wave.prototype.perturb = function(mx,my,std,amp){
  for(var i=1; i<this.Nx-1; i++){
      var mi = map(mx,0,this.W,0,this.Nx);
      this.U[i] -= amp * exp(-(sq(i-mi))/(2.0*std));
    }
}

Wave.prototype.perturbtemp = function(mx,my,std,amp){
  for(var i=1; i<this.Nx-1; i++){
      var mi = map(mx,0,this.W,0,this.Nx);
      this.Utemp[i] = -amp * exp(-(sq(i-mi))/(2.0*std));
    }
}


Wave.prototype.damping = function(f){
  for(var i=1; i<this.Nx-1; i++){
      this.U[i] *= f;
    }
}

Wave.prototype.evolve = function(){
  for(var i=1; i<this.Nx-1; i++){
      this.Unew[i]  = 2.0*this.U[i]-this.Up[i]; // time part
      this.Unew[i] += this.K*(this.U[i+1]+this.U[i-1]-2*this.U[i]);  // space part
      this.Unew[i] *= !this.C[i]; // cancel on barrier
    }
  // update
    arrayCopy(this.U,this.Up);
    arrayCopy(this.Unew,this.U);
}

Wave.prototype.showLinesHorizontal = function(){
    strokeWeight(1);
    noFill();
    stroke(255,128,0);
    beginShape();
    for(var i=0; i<this.Nx; i++){
      var x = map(i,0,this.Nx,0,this.W);
      var val = 0.5*this.U[i];
      var valtemp = this.Utemp[i];
      curveVertex(x, 25 - val - valtemp);
    }
    endShape();
}


function mousePressed(){
    if (mouseY<H){
    wave.perturb(mouseX,mouseY,2,mouseY-25);
    }else{wave.perturb(mouseX,mouseY,2,0);}
}


function mouseMoved(){

    if (mouseY<H){
    wave.perturbtemp(mouseX,mouseY,2,mouseY-25);
    }else{wave.perturbtemp(mouseX,mouseY,2,0);}
}

function createMyButtons(){
    // -- CREATE BUTTONS --
    buttonTheo = createA('#welcome','Theo Torres');
    buttonTheo.position(50, floor(H/2),'fixed');
    buttonTheo.addClass('page-scroll');
    buttonTheo.parent('myContainer');

    buttonPubli = createA('#publications','Publications');
    buttonPubli.position(W-610, floor(H/2),'fixed');
    buttonPubli.addClass('page-scroll');
    buttonPubli.parent('myContainer');

    buttonOutreach = createA("#outreach",'Outreach');
    buttonOutreach.position(W - 400, floor(H/2),'fixed');
    buttonOutreach.addClass('page-scroll');
    buttonOutreach.parent('myContainer');

    buttonCV = createA("#resume",'Resume');
    buttonCV.position(W - 250, floor(H/2),'fixed');
    buttonCV.addClass('page-scroll');
    buttonCV.parent('myContainer');

    buttonOther = createA("#other",'Other');
    buttonOther.position(W-130, floor(H/2),'fixed');
    buttonOther.addClass('page-scroll');
    buttonOther.parent('myContainer');
}

function deleteMyButtons(){
    buttonTheo.remove();
    buttonPubli.remove();
    buttonOutreach.remove();
    buttonCV.remove();
    buttonOther.remove();
}

function windowResized() {

  resizeCanvas(windowWidth, floor(windowHeight/8));

  W = width;
  H = height;
  Nx = int(1.1*W/dr);
  Ny = int(H/dr);
  wave = new Wave(velocity,W,H,Nx,Ny);
  wave.createLattice();

  deleteMyButtons();
  createMyButtons();

  strokeWeight(2*dr);
}
