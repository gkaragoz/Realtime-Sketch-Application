var pencil;

function setup() {
	var canvas = createCanvas(820, windowHeight);
	canvas.position(285,0);
	background(0);
  colorMode(HSB);

  //Create a new Instance of pencil
  pencil = new pencil(mouseX, mouseY);
}

function draw() {
  //Always get mousePosition and set it to pencil coordinates
  pencil.display(mouseX, mouseY);
}

//This is because user may want to click and draw without dragging. Ex: eyes
function mousePressed() {
    pencil.paint(mouseX, mouseY);
}

function mouseDragged() {
    pencil.paint(mouseX, mouseY);
}
