/*property
    body, buildNextCoor, dir, getObj, getView, grid, intervalID, intervalTime,
    isInProgress, numCols, numRows, score, setObj, view
*/

function Food() {
    this.view = '<img src="http://icons.iconarchive.com/icons/fi3ur/fruitsalad/16/strawberry-icon.png" />';
}

function Snake(coor, dir, grid, view) {
    this.body = [coor];
    this.dir = dir;
    this.grid = grid;
    this.view = '<img src="http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/16/Status-user-online-icon.png" />';

    this.buildNextCoor = function() {
        headCoor = this.body[0];
        head_x   = headCoor[0];
        head_y   = headCoor[1];
        switch(this.dir) {
            case "left":
                return [head_x - 1, head_y];
            case "up":
                return [head_x, head_y + 1];
            case "right":
                return [head_x + 1, head_y];
            case "down":
                return [head_x, head_y -1];
        }
    };
}

function Square(view) {
    // obj must be instantiated to null for Square.getView() to work.
    var obj = null;
    var emptyView = '<div class="cell"> </div>';
    
    this.getObj = function() { return obj; };
    this.setObj = function(arg) { obj = arg; };

    this.getView = function() { return (obj ? obj.view : emptyView); };
}

function Game(numCols, numRows) {
    // intervalID is used to keep track of setInterval()'s ID.
    this.intervalID = null;
    // intervalTime is how many times the snake moves per millisecond.
    this.intervalTime = (1000/3);
    this.isInProgress = false;
    this.numCols = numCols;
    this.numRows = numRows;
    this.score = 0;

    this.grid = function() {
      var grid = [];
      for (var col_i = 0; col_i < numCols; col_i++) {
          var col = [];
          grid.push(col);
          for (var row_i = 0; row_i < numRows; row_i++) {
              var row = new Square();
              col.push(row);
          }
      }
      return grid;
    };

    this.snake = new Snake([4,4], "right", this.grid, "O");
    this.grid[4][4].setObj(this.snake);
    this.genFood();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

Game.prototype = {
    constructor: Game,

    emptyDivContent:function() {
        $('div#content').empty();
    },

    endGame:function() {
        clearInterval(this.intervalID);
        alert("Your game has ended. Your score: " + this.score + "!");
    },

    getSquare:function(coor) {
        if (!this.grid[coor[0]] || !this.grid[coor[0]][coor[1]]) {
            return;
        }
            
        return this.grid[coor[0]][coor[1]];
    },
    
    move:function() {
        var nextCoor = this.snake.buildNextCoor();
        var nextSqr = this.getSquare(nextCoor);
        // If nextSqr is undefined, snake has run off grid.
        if (!nextSqr) {
            this.endGame();
            return;
        }
        if (nextSqr.getObj() instanceof Snake) {
            this.endGame();
            return;
        }
        
        if (nextSqr.getObj() instanceof Food) {
            nextSqr.setObj(this.snake);
            this.snake.body.unshift(nextCoor);

            this.score += this.snake.body.length;

            this.genFood();

            this.reduceIntervalTime(0.9);
        }
        // Else nextSqr is empty.
        // Move snake to nextSqr and set the sqr its tail was on to null.
        else {
            nextSqr.setObj(this.snake);
            this.snake.body.unshift(nextCoor);

            var tailCoor = this.snake.body[this.snake.body.length - 1];
            this.grid[tailCoor[0]][tailCoor[1]].setObj(null);
            this.snake.body.pop();
        }
    },

    reduceIntervalTime:function(factor) {
        clearInterval(this.intervalID);
        this.intervalTime *= factor;
        
        var thisGame = this;
        this.intervalID = setInterval(function(){
            thisGame.move();
            thisGame.emptyDivContent();
            thisGame.renderGrid();
        }, thisGame.intervalTime);
    },

    genFood:function() {
        // Build random coor based on grid numCols/numRows:
        food_x = getRandomInt(0, this.numCols);
        food_y = getRandomInt(0, this.numRows);
        var randGridSqr = this.grid[food_x][food_y];

        // If randGridSqr has no obj, place food on it.
        // Else, look at a new randGridSqr.
        if (!randGridSqr.getObj()) { randGridSqr.setObj(new Food()); }
        else { this.genFood(); }
    },

    renderGrid:function() {
        var htmlStr = '<div id="grid">';
        
        this.grid.forEach(function(col) {
            htmlStr+= '<div class="col">';
            
            var rowStr = '';
            col.forEach(function(cell) {
                rowStr = cell.getView() + rowStr;
            });
            htmlStr += rowStr + '</div>';
        });
        htmlStr += '</div>';

        $('div#content').html(htmlStr);
    }
}

$(document).ready(function() {
    alert(
//           "After this message, enter in a number for this game's grid size.\n" +
//           "    (but don't make it larger than the result window!\n" +
//           "     If your games lag, you should decrease the grid size.\n" +
//           "     Stay below 15 if you like short and sweet games!)\n" +
          "Click on the grid to begin your game!\n" +
          "You can click the grid again to pause/resume the game.\n" +
          "To start a new game, refresh the page!\n" +
          "...\n" +
          "Use your arrow keys to direct the snake.\n" +
          "Gain points by eating food.\n" +
          "Each food is worth the current length of the snake.\n" +
          "Your score will be shown when the game ends!\n" +
          "The snake will start off slow, but will get faster each time it eats!\n" +
          "...\n" +
          "Be sure to not run the snake off the grid,\n" +
          "    into itself, nor to turn it back onto itself\n" +
          "    (ie, if it is going right, do not press 'left'!)\n" +
          "    This will end the game!\n" +
          "...\n" +
          "Good luck! [ :\n" +
          "-- Zach");

//     var size = prompt("How large do you want the grid to be?");
    var game = new Game(12, 12);
    game.renderGrid();

    $(document).keydown(function(event){
        switch(event.keyCode) {
            case 37:
                game.snake.dir = "left";
                break;
            case 38:
                game.snake.dir = "up";
                break;
            case 39:
                game.snake.dir = "right";
                break;
            case 40:
                game.snake.dir = "down";
                break;
        }
    });
    // If game not in progress, start.
    // Else pause game.
    $(document).click(function(){
        if (game.isInProgress === false) {
            game.isInProgress = true;
            game.intervalID = setInterval(function(){
                game.move(game.snake);
                game.emptyDivContent();
                game.renderGrid();
            }, game.intervalTime);
        } else {
            game.isInProgress = false;
            clearInterval(game.intervalID);
        }
    });
})
