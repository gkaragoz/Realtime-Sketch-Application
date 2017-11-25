var pencilX, pencilY; //Stores pencil coordinates

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	pencilX = mouseX;
	pencilY = mouseY;
	colorMode(HSB);
}

function draw() {
  //Always get mousePosition and set it to pencil coordinates
	pencilX = mouseX;
	pencilY = mouseY;
}

function mousePressed() {
    paint();
}

function mouseDragged() {
    paint();
}

function paint() {
  noStroke();

  //The distance between pencil and mouse coordinates
  var distance = dist(pencilX, pencilY, mouseX, mouseY);

  for (var ii=0; ii<=distance; ii+=10) {
    //Lerp it between pencilX and mouseX
    var nx = lerp(pencilX, mouseX, ii/distance);
    var ny = lerp(pencilY, mouseY, ii/distance);

    //Make it colorful, otherwise its blue
    fill(255*ii/distance, 255, 255);

    //Draw lerped dots
    ellipse(nx, ny, 10, 10);
  }

  //Draw real impulsed dots by frameRate
  fill(255);
  ellipse(mouseX, mouseY, 20, 20);
}
