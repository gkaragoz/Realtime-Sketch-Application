var px, py;
function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	px = mouseX;
	py = mouseY;
	colorMode(HSB);
}

function draw() {
	noStroke();

	var d = dist(px, py, mouseX, mouseY);

	for (var i = 0; i <= d; i += 10) {

		var nx = lerp(px, mouseX, i/d);
		var ny = lerp(py, mouseY, i/d);
		fill(255*i/d, 255, 255);
		ellipse(nx, ny, 10, 10);
	}

	fill(255);
	ellipse(mouseX, mouseY, 20, 20);

	px = mouseX;
	py = mouseY;
}
