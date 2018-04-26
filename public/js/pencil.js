//Real job is here. Painting with lerps
function pencil(x, y, colorObj) {
  this.color = colorObj.colors.WHITE;
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

      if(DEBUG_MODE)
      {
        //Make it colorful, otherwise its white
        fill(255, 255*ii/distance, 255);
      }
      else
      {
        //Get pencil current color.
        fill(this.color.R, this.color.G, this.color.B);
      }

      //Draw lerped dots
      ellipse(nx, ny, 10, 10);
    }

    if (!DEBUG_MODE)
      return;

    //Draw real impulsed dots by frameRate
    fill(255);
    ellipse(mouseX, mouseY, 20, 20);
  }

  this.setDrawColor = function(color) {
    this.color = color;
  }
}
