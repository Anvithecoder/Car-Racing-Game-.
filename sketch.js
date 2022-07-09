var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player, game
var playerCount,gameState
var car1,car2,car1_img,car2_img,track
var cars=[]
var allPlayers
var fuelImage,powerCoinImage,obstacle1Image,obstacle2Image,lifeImage
var fuels, powerCoins, obstacles,blastImg

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1_img = loadImage("../assets/car1.png");
  car2_img = loadImage("../assets/car2.png");
  track = loadImage("../assets/track.jpg");
  fuelImage = loadImage("./assets/fuel.png");
  powerCoinImage = loadImage("./assets/goldCoin.png");
  obstacle1Image = loadImage("./assets/obstacle1.png");
  obstacle2Image = loadImage("./assets/obstacle2.png");
  lifeImage = loadImage("./assets/life.png");
  blastImg=loadImage("./assets/blast.png")
}


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState()
  game.start();

}

function draw() {
  background(backgroundImage);
  if (playerCount==2){
    game.update(1)
  }
  if (gameState==1){
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/*
We want the game to be structured. We applied OOPs concept-Object Oriented Programs(screen pe har ek cheez ek OBJECT hai)
We need to have at least 3 objects:
1. Form: The form should contain the input box and a
button to log in.
● When the button is pressed, the player's
name should be registered in the database
and a new player should be created.
2. Player: A new player object should be created
every time a new player logs in. It should contain all
the information about the player - name, position in
the game, and so on.
We can add multiple properties about the player as
required by the game.
3. Game Object: The game object should be able to
hold the state of the game. It should be able to
display form when the game state is 0(WAIT), the
game when the game state is 1(PLAY), and the
leaderboard when the game state is 2(END).
● To start, we will only consider the case when
the game state is 0.

*/
