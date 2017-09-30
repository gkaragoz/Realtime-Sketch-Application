var canvas;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0,0);
}

function draw() {
    background(51);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}