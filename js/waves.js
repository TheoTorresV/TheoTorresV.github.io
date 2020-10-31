var play = true;
var perturbOnMove = true;
var place         = true;
var numberOfEvolutionsPerFrame = 1;
var velocity = 0.4;
var Nx = 30;//150;
var Ny = 20;//90;
var dr = 7;
var W, H;
var dampingFactor = 0.97;
var wave;
var coloring;
var button;


function setup(){
  let myCanvas = createCanvas(windowWidth,floor(windowHeight/4));
  myCanvas.parent('myContainer');
  myCanvas.position(0,0,'fixed')


  // -- CREATE BUTTONS --
  buttonPubli = createA('#publications','Publications');
  buttonPubli.position(70, 50,'fixed');
  buttonPubli.addClass('page-scroll');

  buttonOutreach = createA("#outreach",'Outreach');
  buttonOutreach.position(530, 70,'fixed');
  buttonOutreach.addClass('page-scroll');


  buttonCV = createA("#resume",'Resume');
  buttonCV.position(270, 150,'fixed');
  buttonCV.addClass('page-scroll');

  buttonOther = createA("#other",'Other');
  buttonOther.position(830, 120,'fixed');
  buttonOther.addClass('page-scroll');

  noCursor();


  W = width;
  H = height;
  Nx = int(1.1*W/dr);
  Ny = int(H/dr);
  wave = new Wave(velocity,W,H,Nx,Ny);
  wave.createLattice();

  strokeWeight(2*dr);
}



function draw(){
  background(20);

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
    Unew[i]   = new Array(this.Ny);
    U[i]      = new Array(this.Ny);
    Up[i]     = new Array(this.Ny);
    Utemp[i]     = new Array(this.Ny);
    C[i]      = new Array(this.Ny);
    for(var j=0; j<this.Ny; j++){
      Unew[i][j]  = 0.0;
      U[i][j]     = 0.0;
      Up[i][j]    = 0.0;
      Utemp[i][j] = 0.0;
      C[i][j]     = false;
    }
  }
  this.U = U;
  this.Unew = Unew;
  this.Up = Up;
  this.C = C;
  this.Utemp = Utemp;
}

Wave.prototype.perturb = function(mx,my,std,amp){
  for(var i=1; i<this.Nx-1; i++){
    for(var j=1; j<this.Ny-1; j++){
      var mi = map(mx,0,this.W,0,this.Nx);
      var mj = map(my,0,this.H,0,this.Ny);
      this.U[i][j] -= amp * exp(-(sq(i-mi)+sq(j-mj))/(2.0*std));
    }
  }
}

Wave.prototype.perturbtemp = function(mx,my,std,amp){
  for(var i=1; i<this.Nx-1; i++){
    for(var j=1; j<this.Ny-1; j++){
      var mi = map(mx,0,this.W,0,this.Nx);
      var mj = map(my,0,this.H,0,this.Ny);
      this.Utemp[i][j] = -amp * exp(-(sq(i-mi)+sq(j-mj))/(2.0*std));
    }
  }
}

Wave.prototype.constrain = function(x,y,r){
  var I = map(x,0,this.W,0,this.Nx);
  var J = map(y,0,this.H,0,this.Ny);
  for(var i=0; i<this.Nx; i++){
    for(var j=0; j<this.Ny; j++){
      if(sq(I-i)+sq(J-j)<sq(r)){
        this.C[i][j] = true;
      }
    }
  }
}

Wave.prototype.damping = function(f){
  for(var i=1; i<this.Nx-1; i++){
    for(var j=1; j<this.Ny-1; j++){
      this.U[i][j] *= f;
    }
  }
}

Wave.prototype.evolve = function(){
  for(var i=1; i<this.Nx-1; i++){
    for(var j=1; j<this.Ny-1; j++){
      this.Unew[i][j]  = 2.0*this.U[i][j]-this.Up[i][j]; // time part
      this.Unew[i][j] += this.K*(this.U[i+1][j]+this.U[i-1][j]+this.U[i][j-1]+this.U[i][j+1]-4*this.U[i][j]);  // space part
      this.Unew[i][j] *= !this.C[i][j]; // cancel on barrier
    }
  }
  // update
  for(var i=1; i<this.Nx-1; i++){
    arrayCopy(this.U[i],this.Up[i]);
    arrayCopy(this.Unew[i],this.U[i]);
  }
}

Wave.prototype.showLinesHorizontal = function(){
  strokeWeight(1);
  noFill();
  stroke(255,128,0);
  for(var j=0; j<this.Ny; j++){
    beginShape();
    for(var i=0; i<this.Nx; i++){
      var x = map(i,0,this.Nx,0,this.W);
      var y = map(j,0,this.Ny,0,this.H);
      var val = 20*this.U[i][j];
      var valtemp = 40*this.Utemp[i][j];
      vertex(x,y + val + valtemp);
    }
    endShape();
  }
}


function mousePressed(){
    wave.perturb(mouseX,mouseY+20,5,2);
}


function mouseMoved(){
  if(perturbOnMove){
    wave.perturbtemp(mouseX,mouseY+20,2,0.5);
  }
}
