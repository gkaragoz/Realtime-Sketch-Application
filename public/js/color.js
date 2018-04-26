class Color{
  constructor(){
    this.colors = {
        WHITE: {
          R: 255,
          G: 255,
          B: 255 
        },
        RED: {
          R: 255,
          G: 0,
          B: 0 
        },
        GREEN: {
          R: 0,
          G: 255,
          B: 0 
        },
        BLUE: {
          R: 0,
          G: 0,
          B: 255 
        }
      };
    
    this.index = [];
    
    for(var value in this.colors) {
      if(this.colors.hasOwnProperty(value)) {
          var data = this.colors[value];
          this.index.push(data);
      }
    }
  }
}
