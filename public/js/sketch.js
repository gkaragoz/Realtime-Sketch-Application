var pencil;
var colorButtonsCount = 4;
var colorButtonsOffsetX = 25;
var colorObj;

var DEBUG_MODE = false;

const DRAW_MAIN_ID = 'draw_main';

function setup() {
  var canvas = createCanvas(885, windowHeight);
  colorObj = new Color();
    
	background(0);
  colorMode(RGB);
  canvas.parent(DRAW_MAIN_ID);

  createButtonUIs();

  var checkbox = createCheckbox('Debug Mode', false);
  checkbox.parent(DRAW_MAIN_ID);
  checkbox.position(150, windowHeight-50);
  checkbox.changed(onChangedCheckbox);

  //Create a new Instance of pencil
  pencil = new pencil(mouseX, mouseY, colorObj);
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

function createButtonUIs() {
    for (var i = 0; i < colorButtonsCount; i++) {
      var location = {
        posX : 50 + i * 25,
        posY : windowHeight-50
      };

      var button = new Button(
                            "",  
                            this.colorObj.index[i], 
                            DRAW_MAIN_ID, 
                            location
                          ); 
    }
  }

  function onChangedCheckbox() {
    DEBUG_MODE = !DEBUG_MODE;
    console.log("DEBUG MODE: " + DEBUG_MODE);
  }