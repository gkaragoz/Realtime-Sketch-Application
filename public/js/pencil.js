//Real job is here. Painting with lerps
function pencil(colorObj) {
  this.color = colorObj.colors.WHITE;

  this.paint = function(data) {
    noStroke();

    //The distance between pencil and mouse coordinates
    var distance = dist(data.beforeDrawX, data.beforeDrawY, data.x, data.y);
    if (distance > 0) {
      for (var ii=0; ii<=distance; ii+=1) {
        //Lerp it between pencilX and mouseX
        var nx = lerp(data.beforeDrawX, data.x, ii/distance);
        var ny = lerp(data.beforeDrawY, data.y, ii/distance);
  
        if(DEBUG_MODE)
        {
          //Make it colorful, otherwise its white
          fill(255, 255*ii/distance, 255);
          ellipse(data.x, data.y, 20, 20);
        }
        else
        {
          //Get pencil current color.
          fill(data.color.R, data.color.G, data.color.B);
        }
  
        //Draw lerped dots
        ellipse(nx, ny, 10, 10);
      }
    } else {
      fill(data.color.R, data.color.G, data.color.B);
      ellipse(data.x, data.y, 10, 10);
    }
  }

  this.setDrawColor = function(color) {
    this.color = color;
    drawPackage.color = this.color;
  }
}
