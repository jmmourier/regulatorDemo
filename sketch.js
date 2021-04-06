var positionX = 50;
var positionY = 50;
var Orientation = 0;

var speed = 0;
var maxSpeed = 30;
var rotation = 0; // deg /sec
var maxRotation = 20;

var targetX = 200;
var targetY = 200;

var historySize = 500;
var historyPositionX = [];
var historyPositionY = [];
var historyOri = [];

function setup() {
  caneva = createCanvas(600, 400);
  caneva.mouseClicked(updateTaget);
  angleMode(DEGREES);
}

function draw() {
  background(10);
  
  
  updatePosition();
  drawArrow();
  drawArrowHist();
  
  circle(targetX, targetY, 10);
  processSpeed();
  
  printDebugText();

}

function printDebugText(){
  textSize(19);
  text(new String(positionX).substring(0,3), 10, 350);
  text(new String(positionY).substring(0,3), 60, 350);
  text(targetX, 110, 350);
  text(targetY, 160, 350);
  fill(255);
}

function updatePosition(){
  if(historyPositionX.length > historySize) {
    historyPositionX.shift();
    historyPositionY.shift();
    historyOri.shift();
  }
  historyPositionX.push(positionX);
  historyPositionY.push(positionY);
  historyOri.push(Orientation);
  
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
  stroke('red');
  line(0,0,0,100);
  stroke(255);
  rotate(-Orientation + 90);  
  translate(-positionX, -positionY);
}

function drawArrowHist(){
  for (let i = 0; i < historyPositionX.length -1; i++) {
    stroke(255);
    line(historyPositionX[i],
         historyPositionY[i],
         historyPositionX[i+1],
         historyPositionY[i+1]);
  }
}

function processSpeed(){
  distance = calculateDistance();
  
  textSize(19);
  text(new String(positionX).substring(0,3), 10, 350);
  text(new String(positionY).substring(0,3), 60, 350);
  text(targetX, 110, 350);
  text(targetY, 160, 350);
  fill(255);
  
  // hasPositionBeenReached ---
  if(abs(distance) < 5 ){
    text('Destination reached', 10, 375);
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
    text('Aligning, cap error : ' + errorCap, 10, 375);
    speed = 0;
  }
  else {
    text('Moving, distance : ' + distance, 10, 375);
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

