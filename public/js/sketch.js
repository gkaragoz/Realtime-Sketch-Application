var pencil;
var colorButtonsCount = 4;
var colorButtonsOffsetX = 25;
var colorObj;
var drawPackage;

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
  checkbox.position(150, windowHeight - 50);
  checkbox.changed(onChangedCheckbox);

  //Create a new Instance of pencil
  pencil = new pencil(colorObj);

  drawPackage = {
    beforeDrawX: mouseX,
    beforeDrawY: mouseY,
    x: 0,
    y: 0
  };
}

function draw() {
  //Always get mousePosition and set it to drawPackage before draw coordinates
  drawPackage.beforeDrawX = mouseX;
  drawPackage.beforeDrawY = mouseY;
}

socket.on('draw', function (data) {
  pencil.paint(data);
});

//This is because user may want to click and draw without dragging. Ex: eyes
function mousePressed() {
  drawPackage.x = mouseX;
  drawPackage.y = mouseY;

  socket.emit('draw', drawPackage, function (response) {
    pencil.paint(response);
  });
}

function mouseDragged() {
  drawPackage.x = mouseX;
  drawPackage.y = mouseY;
  
  socket.emit('draw', drawPackage, function (response) {
    pencil.paint(response);
  });
}

function createButtonUIs() {
  for (var i = 0; i < colorButtonsCount; i++) {
    var location = {
      posX: 50 + i * 25,
      posY: windowHeight - 50
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