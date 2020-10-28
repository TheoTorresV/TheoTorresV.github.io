"use strict";

var fscale = 24; // a scale factor
// nodes settings
var nodeColour = "#2696C1";
var nodeSize = 2;
var xMin = -9;
var xMax = 9;
var yMin = -9;
var yMax = 9;
var dx = 0.2; // x distance between nodes
var dy = 0.2; // y distance between nodes
var nodes, nodesAxes;
var widthCanvas, heightCanvas;
let current = []; // = new float[cols][rows];
let previous = []; // = new float[cols][rows];
let future = [];
let dt = 0.2;
let c = Math.sqrt(0.5);
let cols
let rows
let damping = 0.99;

function setup() {
  widthCanvas = windowWidth; // windowWidth p5.js?
  heightCanvas = windowHeight; // windowHeight p5.js?
  cols = width;
  rows = height;
  //widthCanvas = window.innerWidth;
  //heightCanvas = window.innerHeight;

 // NOT SURE WHY THIS IS NOT WORKING THOUGH TO DEFINE THE ARRAYS....

 //var i=0;
 // var j = 0;
 // for (var x = xMin; x <= xMax; x += dx) {
//      var Mi = [];
//      for (var y = yMin; y <= yMax; y += dy) {
//          Mi.push(0);
//      }
//      previous.push(Mi);
//      current.push(Mi);
//      future.push(Mi);
//  }

  current = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
  previous = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
  future = new Array(cols).fill(0).map(n => new Array(rows).fill(0));

  var myCanvas = createCanvas(widthCanvas, heightCanvas);
  makeFunctionNodes();
};


// the function to be plotted
function f(x,y)	{
    return (5*Math.sin(Math.sqrt(x*x+y*y)))/(Math.sqrt(x*x+y*y));
};

function windowResized() {
  widthCanvas = windowWidth; // windowWidth p5.js?
  heightCanvas = windowHeight; // windowHeight p5.js?
  resizeCanvas(widthCanvas, heightCanvas);
  //makeFunctionNodes();
};

function functionNodesConstructor() {
	// filling the nodes array with function points [x,y,z] where z = f(x,y).
    var j = 0;
    var i = 0;
	this.nodes = [];
	for (var x = xMin; x <= xMax; x += dx) {
        j = 0;
		for (var y = yMin; y <= yMax; y += dy) {
			this.nodes.push([x, y, current[i][j]]);
            j++;
		}
        i++
	}
};

function makeFunctionNodes() {
	var shape = new functionNodesConstructor();
	nodes = shape.nodes;
	nodesAxes = [[0,0,0],[xMax,0,0],[0,yMax,0],[0,0,xMax]];
	rotateX3D(285 * Math.PI / 180);
    rotateY3D(0 * Math.PI / 180);
	rotateZ3D(-15 * Math.PI / 180);

};

// Rotate shape around the z-axis
function rotateZ3D(theta) {
	//if (window.console && window.console.log) { console.log("rotY="+theta) }
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);

    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var y = node[2];
        node[0] = x * cosTheta - y * sinTheta;
        node[2] = y * cosTheta + x * sinTheta;
    }
    for (n=0; n<nodesAxes.length; n++) {
        node = nodesAxes[n];
        x = node[0];
        y = node[2];
        node[0] = x * cosTheta - y * sinTheta;
        node[2] = y * cosTheta + x * sinTheta;
    }
};

// Rotate shape around the y-axis
function rotateY3D(theta) {
	//if (window.console && window.console.log) { console.log("rotY="+theta) }
    var sinTheta = Math.sin(-theta);
    var cosTheta = Math.cos(-theta);

    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var z = node[2];
        node[0] = x * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + x * sinTheta;
    }
    for (n=0; n<nodesAxes.length; n++) {
        node = nodesAxes[n];
        x = node[0];
        z = node[2];
        node[0] = x * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + x * sinTheta;
    }
};

// Rotate shape around the x-axis
function rotateX3D(theta) {
	//if (window.console && window.console.log) { console.log("rotX="+theta) }
    var sinTheta = Math.sin(-theta);
    var cosTheta = Math.cos(-theta);

    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var y = node[1];
        var z = node[2];
        node[1] = y * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + y * sinTheta;
    }
    for (n=0; n<nodesAxes.length; n++) {
        node = nodesAxes[n];
        y = node[1];
        z = node[2];
        node[1] = y * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + y * sinTheta;
    }
};


function updateWave(){

    for (let i = 1; i < current.length - 1; i++) {
      for (let j = 1; j < current.length - 1; j++) {

          let dxx = current[i+1][j] - 2*current[i][j] + current[i-1][j];
          let dyy = current[i][j+1] - 2*current[i][j] + current[i][j-1];

          future[i][j] = 2*current[i][j] - previous[i][j] + sq(dt/dx)*sq(c)*(dxx + dyy);
          future[i][j] *= damping;
      }
    }

    for (let i = 1; i < current.length - 1; i++) {
        for (let j = 1; j < current.length - 1; j++) {
            previous[i][j] = current[i][j];
            current[i][j] = future[i][j];
        }
      }
}

function mousePressed() {
    var yM = (mouseY - heightCanvas/2)/fscale;
    var xM = (mouseX - widthCanvas/2)/fscale;
    var inodes = 0;
    var i = 0;
    var j = 0;

    for (var x = xMin; x <= xMax; x += dx) {
        j = 0;
        for (var y = yMin; y <= yMax; y += dy) {
            var px = nodes[inodes][0];
    		var py = nodes[inodes][1];
            if((sqrt(sq(yM - py))<0.1) && (sqrt(sq(xM - px))<0.1)){

                current[i][j] = 0.5;
            }
            inodes++;
            j++;
        }
        i++;
      }
}

function draw() { // By default, p5.js loops through draw() continuously at 60 frames per second, which is quite a load for the processor.

	var backgroundColour = color(255, 255, 255);
    background(backgroundColour); // overdraws the previous orientations at the loop rate
	translate(widthCanvas/2, heightCanvas/2); // shift the canvas widthCanvas/2 px right and heightCanvas/2 px down, so position (0,0) is at the center of the canvas


    // updateWave
    updateWave();

    // Make node

    makeFunctionNodes();

    // Draw nodes
    fill(nodeColour);
	noStroke();
	// sort the nodes by their z value so that the "deepest" nodes are drawn first and those closest to the viewer are drawn last.
	// nodes.sort(function(a, b){return a[2]-b[2]});
	for (var i=0; i < nodes.length; i++) {
		var px = nodes[i][0];
		var py = nodes[i][1];
		// the "pixels" are small rectangles which is faster than rendering small circles.
		rect(px*fscale,py*fscale,nodeSize,nodeSize)
	}

	// Draw axes
	//stroke('gray');
	//fill('gray');
	//textSize(16);
	//line(nodesAxes[0][0]*fscale,nodesAxes[0][1]*fscale,nodesAxes[1][0]*fscale,nodesAxes[1][1]*fscale);
	//text("x",nodesAxes[1][0]*fscale,nodesAxes[1][1]*fscale);
	//line(nodesAxes[0][0]*fscale,nodesAxes[0][1]*fscale,nodesAxes[2][0]*fscale,nodesAxes[2][1]*fscale);
	//text("y",nodesAxes[2][0]*fscale,nodesAxes[2][1]*fscale);
	//line(nodesAxes[0][0]*fscale,nodesAxes[0][1]*fscale,nodesAxes[3][0]*fscale,nodesAxes[3][1]*fscale);
	//text("z",nodesAxes[3][0]*fscale,nodesAxes[3][1]*fscale);

};
