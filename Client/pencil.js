//Real job is here. Painting with lerps
function pencil(x, y) {
  this.x = x;
  this.y = y;

  this.display = function(x, y){
    this.x = x;
    this.y = y;
  }

  this.paint = function(x, y) {
    noStroke();

    //The distance between pencil and mouse coordinates
    var distance = dist(this.x, this.y, mouseX, mouseY);

    for (var ii=0; ii<=distance; ii+=10) {
      //Lerp it between pencilX and mouseX
      var nx = lerp(this.x, mouseX, ii/distance);
      var ny = lerp(this.y, mouseY, ii/distance);

      //Make it colorful, otherwise its blue
      fill(255*ii/distance, 255, 255);

      //Draw lerped dots
      ellipse(nx, ny, 10, 10);
    }

    //Draw real impulsed dots by frameRate
    fill(255);
    ellipse(mouseX, mouseY, 20, 20);
  }
}
