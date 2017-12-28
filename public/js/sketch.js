var pencil;

function setup() {
	var canvas = createCanvas(885, windowHeight);
	
	background(0);
  colorMode(HSB);
  canvas.parent('draw_main');
  

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
