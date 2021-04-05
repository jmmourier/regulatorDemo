var positionX = 50;
var positionY = 50;
var Orientation = 0;

var speed = 0;
var maxSpeed = 30;
var rotation = 0; // deg /sec
var maxRotation = 10;

var targetX = 200;
var targetY = 200;

function setup() {
  caneva = createCanvas(600, 400);
  caneva.mouseClicked(updateTaget);
  angleMode(DEGREES);
}

function draw() {
  background(10);
  
  
  updatePosition();
  drawArrow();
  
  circle(targetX, targetY, 20);
  processSpeed();
}

function updatePosition(){
  Orientation = Orientation + rotation * deltaTime/1000;
  positionX = positionX + speed*cos(Orientation) * deltaTime/1000;
  positionY = positionY + speed*sin(Orientation) * deltaTime/1000;
}
                                  
function updateTaget(x,y){
  targetX = mouseX;
  targetY = mouseY;
}

function drawArrow(){
  translate(positionX, positionY);
  rotate(Orientation - 90);  
  triangle(-5, -15, 0, 0, 5, -15);
  rotate(-Orientation + 90);  
  translate(-positionX, -positionY);
}

function processSpeed(){
  distance = calculateDistance();
  
  // hasPositionBeenReached ---
  if(abs(distance) < 5 ){
    print('destination reached');
    rotation  = 0;
    speed = 0;
    return;
  }
  
  // cap regulation ---
  cap = calculateCap();
  print('The cap is ' + cap);
  errorCap = cap - Orientation;
  
  rotation = errorCap;
  if(rotation > maxRotation) rotation = maxRotation;
  if(rotation < -maxRotation) rotation = -maxRotation;
  
  // Speed regulation ---
  if(abs(errorCap)>15) {
    print('rotation only');
    speed = 0;
  }
  else {
    print('rotation + speed');
    speed = distance;
    if(speed > maxSpeed) speed = maxSpeed;
    print('The distance is ' + distance);

  }
}

function calculateCap(){
  return atan2(targetY - positionY,targetX - positionX);
}

function calculateDistance(){
  return sqrt(
    pow(targetX - positionX,2)+
    pow(targetY - positionY,2));
}

