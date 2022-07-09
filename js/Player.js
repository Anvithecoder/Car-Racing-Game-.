class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.rank=0
    this.score=0
    this.fuel=185
    this.life=185
  }

  getCount() {
    var playerCountRef = database.ref("playerCount");
    playerCountRef.on("value", data => {
      playerCount = data.val();
    });
  }

  updateCount(count) {
    database.ref("/").update({
      playerCount: count
    });
  }
  addPlayer(){
    var playerIndex = "players/player" + this.index;   //creating a new field called players which will have child node: player1& player2

    if (this.index === 1) {   //giving x position to players cars
      this.positionX = width / 2 - 100;
    } else {
      this.positionX = width / 2 + 100;
    }

    database.ref(playerIndex).set({    //updating the info to database
      
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score:this.score,
    });
  }

  static getPlayersInfo() {
    var playerInfoRef = database.ref("players");
    playerInfoRef.on("value", data => {
      allPlayers = data.val();
    });
  }

  getDistance() {
    var playerDistanceRef = database.ref("players/player" + this.index);
    playerDistanceRef.on("value", data => {     //listening for change in data
      var data = data.val();
      this.positionX = data.positionX;
      this.positionY = data.positionY;
    });
  }

  update(){
    var playerIndex = "players/player" + this.index;  
    database.ref(playerIndex).update({
      positionX:this.positionX,
      positionY:this.positionY,
      rank:this.rank,
      score:this.score,
      life:this.life,
    })

  }
  getCarsAtEnd() {
    database.ref("carsAtEnd").on("value", data => {
      this.rank = data.val();
    });
  }   

  static updateCarsAtEnd(rank) {
    database.ref("/").update({
      carsAtEnd: rank
    });
  }
  
  
}

/*
.ref() - to give the location of the field in the database.
Then we use:
.on() - to keep listening to the changes that happen in the
‘playerCount’ field of the database.
.val() - to copy the value from the database to the global
variable of the code.
.update - to store value from global variable to the
database field ‘playerCount’.
Static functions are those common functions that are
called by the class themselves rather than by objects of
the class. We use the 'static' keyword before the function
to make it a static function.


getCarsAtEnd() to read the value of the CarsAtEnd
field from the database.
● updateCarsAtEnd() a static to update the
CarsAtEnd field with the number of cars that have
finished the race
*/
