var canvas;

var pencilColor;
var pencilSize;

var mouseX;
var mouseY;

var sketchData = {
    x: mouseX,
    y: mouseY
};

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0,0);
    
    background(51);
    
    pencilColor = 255;
    pencilSize = 36;
}

function draw() {
    
}

function mousePressed() {
    paint();
}

function mouseDragged() {
    paint();
}

function paint() {
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    
    noStroke();
    fill(pencilColor);
    ellipse(this.mouseX, this.mouseY, pencilSize, pencilSize);
    
    sketchData.x = this.mouseX;
    sketchData.y = this.mouseY;
    
    console.log(sketchData);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}