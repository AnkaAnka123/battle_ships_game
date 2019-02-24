var view = {
   displayMessage: function (msg) {
      let messageArea = document.getElementById("messageArea");
      messageArea.innerHTML = msg;
   },
   displayHit: function (location) {
      let cell = document.getElementById(location);
      cell.setAttribute("class", "hit");
   },
   displayMiss: function (location) {
      let cell = document.getElementById(location);
      cell.setAttribute("class", "miss");
   }
}

// view.displayMiss("00");
// view.displayHit("01");
// view.displayMessage("dupa");


var model = {
   boardSize: 7, //wielkość siatki tworzącej planszę gry
   numShips: 3, //liczba okrętów biorących udział w grze
   shipLength: 3, // liczba komórek planszy zajmowanych przez jeden okręt
   shipsSunk: 0, //przechowuje info o liczbie zatopionych okrętów

   ships: [{
         locations: ["0", "0", "0"],
         hits: ["", "", ""]
      },
      {
         locations: ["0", "0", "0"],
         hits: ["", "", ""]
      },
      {
         locations: ["0", "0", "0"],
         hits: ["", "", ""]
      }
   ],
   fire: function (guess) {
      for (var i = 0; i < this.numShips; i++) {
         var ship = this.ships[i];
         var index = ship.locations.indexOf(guess);
         if (index >= 0) {
            ship.hits[index] = "hit";
            view.displayHit(guess);
            view.displayMessage("TRAFIONY!!")

            if (this.isSunk(ship)) {
               view.displayMessage("Zatopiłeś mój okręt!! :( ")
               this.shipsSunk++;
            }
            return true;
         }
      }
      view.displayMiss(guess);
      view.displayMessage("Spudłowałeś!!");
      return false;

   },
   isSunk: function (ship) {
      for (var i = 0; i < this.shipLength; i++) {
         if (ship.hits[i] !== "hit") {
            return false;
         }
         return true;
      }
   },
   generateShipLocations: function(){
      var location;
      for(var i = 0; i < this.numShips; i++){
         do{
            locations = this.generateShip();
         } while (this.collision(locations));
         this.ships[i].locations = locations;
      }
   },
   generateShip: function(){
      var direction = Math.floor(Math.random()*2);
      var row, col;
      if (direciotn === 1){
         //Generujemy początkowe pole okrętu w układzie poziomym
         row = Math.floor(Math.random() * this.boardSize);
         col = Math.floor(Math.random() * this.boardSize - this.shipLength)
      }else{
         //Generujey początkowe pole okrętu w układzie pionowym
         row = Math.floor(Math.random() * this.boardSizie - this.shipLength);
         col = Math.floor(Math.random() * this.boardSize);
      }

      var newShipLocations = [];
      for (var i = 0; i <this.shipLength; i++){
         if (direction === 1) {
            //dodajemy do tablicy pola okrętu w układzie poziomym
            newShipLocations.push(row + "" + (col + i));
      }else{
         //dodajey do tablicy pola okrętu w układzie pionowym
         newShipLocations.push((row + i) + "" + col);
      }
   }
   return newShipLocations;
},
collision: function(locations) {
   for(var i = 0; i < this.numShips; i++) {
      var ship = model.ship[i];
      for(var j = 0; j < locations.length; j++) {
         if (ship.locations.indexOf(locations[j]) >= 0) {
            return true;
         }
      }
   }
   return false;
}

}
// model.fire("00");
// model.fire("20");
function parseGuess (guess) {
   var alphabeth = ["A", "B", "C", "D", "E", "F", "G"];

   if (guess === null || guess.length !== 2) {
      alert("Proszę wpisać literę i cyfę");
   } else {
      firstChar = guess.charAt(0);
      var row = alphabeth.indexOf(firstChar);
      var column = guess.charAt(1);

      if (isNaN(row) || isNaN(column)) {
         alert("To nie są współrzędne!!");
      } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
         alert("Pole poza planszą!!");
      } else {
         return row + column;
      }
   }
   return null;
};



// console.log(parseGuess("A0"));
// console.log(parseGuess("B0"));
// console.log(parseGuess("B6"));
// console.log(parseGuess("A7"));

var controller = {
   guesses: 0,
   processGuess: function (guess) {
      var location = parseGuess(guess);
      if (location){
         this.guesses++;
         var hit = model.fire(location);
         if (hit && model.shipsSunk === model.numShips) {
            view.displayMessage("Zatopiłeś wszystkie moje okręty, w " + 
            this.guesses + " próbach.");
         }
      }
   }
}


// controller.processGuess("A1");
// controller.processGuess("A6");
// controller.processGuess("B6");
// controller.processGuess("C6");
// controller.processGuess("c4");

function init() {
   var fireButton = document.getElementById("fireButton");
   fireButton.onclick = handleFireButton;
   var guessInput = document.getElementById("guessInput");
   guessInput.onkeypress = handleKeyPress;

   model.generateShipLocations();
}
function handleFireButton() {
   var guessesInput = document.getElementById("guessInput");
   var guess = guessesInput.value;
   controller.processGuess(guess);

   guessesInput.value = "";
}
function handleKeyPress(e) {
   var fireButton = document.getElementById("fireButton");
   if (e.keyCode === 13) {
      fireButton.click();
      return false;
   }
}


window.onload = init;