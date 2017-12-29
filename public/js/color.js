class Color{
  constructor(){
    this.colors = {
        WHITE:"#ffffff",
        RED:"#ff0000",
        GREEN:"#008000",
        BLUE:"#0000ff"
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
