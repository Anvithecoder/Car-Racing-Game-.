class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false
    this.leftKeyActive = false
    this.blast = false
    //A Flag is a boolean variable that signals when some condition exists in a program.
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount()


    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;
    car1.addImage("blast", blastImg)

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;
    car2.addImage("blast", blastImg)
    cars = [car1, car2];

    fuels = new Group()
    powerCoins = new Group()
    obstacles = new Group()

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    // Adding fuel sprite in the game
    this.addSprites(fuels, 4, fuelImage, 0.02)

    // Adding coin sprite in the game
    this.addSprites(powerCoins, 18, powerCoinImage, 0.09)

    //Adding obstacles sprite in the game
    this.addSprites(obstacles, obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions)
  }
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;
      if (positions.length > 0) {    //checking if position value has been given
        x = positions[i].x
        y = positions[i].y
        spriteImage = positions[i].image
      }
      else {
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);   //storing a random position for the coins and fuels
      }
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }
  getState() {       //reading the value of gameState from db
    var gameStateRef = database.ref("gameState");   //location on which we want to read data from
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    })
  }
  update(state) {    //updating the value to gameState
    database.ref("/").update({
      gameState: state
    });
  }
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);



    this.leadeboardTitle.html("Leaderboard");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);

  }
  play() {
    this.handleElements()
    this.handleResetButton()
    Player.getPlayersInfo()
    player.getCarsAtEnd()

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.showLeaderboard()
      this.showLife()
      this.showFuelBar()
      var index = 0      //index of the array cars

      for (var plr in allPlayers) {
        index = index + 1     //add 1 to the index for every loop for player index
        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        var currentLife = allPlayers[plr].life
        if (currentLife <= 0) {
          cars[index - 1].changeImage("blast")
          cars[index - 1].scale = 0.3
        }

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        //to give instructions for CURRENT player
        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          this.handlePowerCoins(index)
          this.handleFuel(index)
          this.handleObstacleCollision(index)
          this.handleCarAColllisionWithCarB(index)
          if (player.life <= 0) {
            this.blast = true
            this.playerMoving = false
          }
          // Changing camera position in y direction

          camera.position.x = cars[index - 1].position.x
          camera.position.y = cars[index - 1].position.y
        }

      }
      this.handlePlayerControls()

      /*
      IN CASE WE WANT TO APPLY AI TO OUR CAR
      if (this.playerMoving){
        player.positionY+=5
        player.update()
      }*/

      // Finshing Line  
      const finishLine = height * 6 - 100
      //condition to check when player reaches end line
      if (player.positionY > finishLine) {
        gameState = 2
        player.rank += 1
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.showRank()
      }

      drawSprites();
    }
  }
  handlePlayerControls() {
    // handling keyboard events
    if (!this.blast) {
      if (keyIsDown(UP_ARROW)) {
        this.playerMoving = true
        player.positionY += 10;
        player.update();
      }
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
        this.leftKeyActive = false
        player.positionX += 5;
        player.update();
      }
      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
        this.leftKeyActive = true
        player.positionX -= 5;
        player.update();

      }
    }
  }
  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        carsAtEnd: 0,
        players: {},

      })
      window.location.reload()
    })
  }
  showLeaderboard() {
    var leader1, leader2;   //what to display
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  handlePowerCoins(index) {
    cars[index - 1].overlap(powerCoins, function (colllector, collected) {
      player.score += 20
      player.update()
      //collected is the sprite in the group collectibles that triggered the event
      collected.remove()
    })
  }

  handleFuel(index) {
    // Adding fuel
    cars[index - 1].overlap(fuels, function (collector, collected) {
      player.fuel = 185;
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
    // Reducing Player car fuel
    if (player.fuel > 0 && this.playerMoving) {
      player.fuel -= 0.3
    }
    if (player.fuel < 0) {
      gameState = 0
      this.gameOver()
    }
  }
  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 350, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY - 350, player.life, 20);
    noStroke();
    pop();
  }

  showFuelBar() {
    push();
    image(fuelImage, width / 2 - 130, height - player.positionY - 300, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 300, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 300, player.fuel, 20);
    noStroke();
    pop();
  }


  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }
  gameOver() {
    swal({
      title: `Game Over`,
      text: "Oops you lost the race....!!!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing"
    });
  }
  handleObstacleCollision(index) {
    if (cars[index - 1].collide(obstacles)) {
      if (this.leftKeyActive) {
        player.positionX += 100

      }
      else {
        player.positionX -= 100
      }
      if (player.life > 0) {
        player.life -= 185 / 4
      }
      player.update()
    }
  }
  handleCarAColllisionWithCarB(index) {
    if (index === 1) {
      if (cars[index - 1].collide(cars[1])) {
        if (this.leftKeyActive) {
          player.positionX += 100

        }
        else {
          player.positionX -= 100
        }
        if (player.life > 0) {
          player.life -= 185 / 4
        }
        player.update()
      }
    }
    if (index === 2) {
      if (cars[index - 1].collide(cars[0])) {
        if (this.leftKeyActive) {
          player.positionX += 100

        }
        else {
          player.positionX -= 100
        }
        if (player.life > 0) {
          player.life -= 185 / 4
        }
        player.update()
      }
    }
  }

}

/*
player1 - cars[0] | player2 - cars[1]
cars=[car1   ,   car2]
        0          1

var info={
  name:Anvi,
  class:8,
  sub:coding
}

var info2=Object.values(info)
Object.keys(info)

info=Anvi,8,coding

to check overlap between ob1,ob2


ob1.overlap(ob2,function(what to do when overlap happens))
*/