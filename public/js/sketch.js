var pencil;
var colorButtonsCount = 4;
var colorButtonsOffsetX = 25;
var colorObj;
var drawPackage;
var isArtist = false;
var DEBUG_MODE = false;

const DRAW_MAIN_ID = 'draw_main';
const TOOLBOX_ID = "toolbox_div";

function setup() {
  var canvas = createCanvas(600, 700);
  colorObj = new Color();

  background(255);
  colorMode(RGB);
  canvas.parent(DRAW_MAIN_ID);

  createButtonUIs();

  var checkbox = createCheckbox('Debug Mode', false);
  checkbox.parent(TOOLBOX_ID);
  checkbox.position(150, windowHeight - 50);
  checkbox.changed(onChangedCheckbox);
  checkbox.addClass('noselect');

  //Create a new Instance of pencil
  pencil = new pencil(colorObj);

  drawPackage = {
    beforeDrawX: mouseX,
    beforeDrawY: mouseY,
    x: 0,
    y: 0,
    color: pencil.color
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
  if(isArtist){
    drawPackage.x = mouseX;
    drawPackage.y = mouseY;
  
    socket.emit('draw', drawPackage, function (response) {
      pencil.paint(response);
    });
  }
}

function mouseDragged() {
  if(isArtist){
    drawPackage.x = mouseX;
    drawPackage.y = mouseY;
    
    socket.emit('draw', drawPackage, function (response) {
      pencil.paint(response);
    });
  }
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
      TOOLBOX_ID,
      location
    );
  }
}

function onChangedCheckbox() {
  DEBUG_MODE = !DEBUG_MODE;
  console.log("DEBUG MODE: " + DEBUG_MODE);
}

function setArtist(value) {
  isArtist = value;

  if (isArtist) {
    $('#toolbox_div').show();
  } else {
    $('#toolbox_div').hide();
  }
}

socket.on('onGameStarted', function(data){
  var users = data.users;
  
  for (let ii = 0; ii < users.length; ii++) {
    const user = users[ii];
    
    if (socket.id === user.socketId) {
      setArtist(user.isArtist);
    }
  }
  updateQuestionText(data.word, isArtist);
  updateUsers(users);
});

socket.on('roomInfo', function(data){
  updateRoomInfo(data.currentRaund, data.maxRaund, data.tourTime);
});