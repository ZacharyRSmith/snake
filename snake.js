var Food = function() {
    this.view = '<img src="http://icons.iconarchive.com/icons/fi3ur/fruitsalad/16/strawberry-icon.png" />';
};

var Snake = function(coor, dir, grid, view) {
    this.body = [coor];
    this.dir = dir;
    this.grid = grid;
    this.view = '<img src="http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/16/Status-user-online-icon.png" />';
    console.log(this.view);

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
};

var Square = function(view) {
    this.obj = null;
    this.getObj = function() { return this.obj; };
    this.setObj = function(arg_obj) { this.obj = arg_obj; };
//     this.view = "X";
    this.getView = function() {
        if (this.getObj()) { return this.getObj().view; }
        else { return '<div class="cell"> </div>'; }
    };
};

var Game = function(numCols, numRows) {
    // PROPS:
    // intervalID is used to keep track of setInterval() ID.
    this.intervalID = null;
    this.intervalTime = (1000/3);
    this.isInProgress = false;
    this.numCols = numCols;
    this.numRows = numRows;
    this.score = 0;

    // METHODS:
    this.emptyDivContent = function() {
        $('div#content').empty();
    };

    this.endGame = function() {
        clearInterval(this.intervalID);
        alert("Your game has ended. Your score: " + this.score + "!");
    };

    this.genFood = function() {

        // Build random coor based on grid numCols/numRows:
        food_x = this.getRandomInt(0, this.numCols);
        food_y = this.getRandomInt(0, this.numRows);
        var randGridSqr = this.grid[food_x][food_y];

        // If randGridSqr has no obj, place food on it.
        // Else, look at a new randGridSqr.
        if (randGridSqr.getObj() === null) {
            randGridSqr.setObj(new Food());
        } else {
            this.genFood();
        }
    };

    this.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    this.move = function() {

        var nextCoor = this.snake.buildNextCoor();
        // If grid coor is undefined, end game.
        if (this.grid[nextCoor[0]] === undefined) {
            this.endGame();
            return false;
        } else if (this.grid[nextCoor[0]][nextCoor[1]] === undefined) {
            this.endGame();
            return false;
        }

        var nextCoorSqr = this.grid[nextCoor[0]][nextCoor[1]];
        if (nextCoorSqr.getObj()) {
            // ... if next coor's view is food, eat.
            // Else, by process of elimination, nextCoorSqr has snake,
            // so end game.

            if (nextCoorSqr.getObj() instanceof Food) {
                clearInterval(this.intervalID);

                nextCoorSqr.setObj(this.snake);
                this.snake.body.unshift(nextCoor);
                
                console.log("this.score: " + this.score);
                console.log("this.snake.body.length: " + this.snake.body.length);
                this.score = this.score + this.snake.body.length;

                this.genFood();

                this.emptyDivContent();
                this.renderGrid();

                this.reduceIntervalTime(0.9);

                var thisGame = this;
                this.intervalID = setInterval(function(){
                    
                    console.log("this.snake: " + thisGame.snake);
                    thisGame.move();
                    thisGame.emptyDivContent();
                    thisGame.renderGrid();
                }, thisGame.intervalTime);
            } else {
                this.endGame();
                return false;
            }

            // Else, move snake to nextCoorSqr and set the sqr its tail was
            // on to null.
        } else {
            nextCoorSqr.setObj(this.snake);
            this.snake.body.unshift(nextCoor);

            var tailCoor = this.snake.body[this.snake.body.length - 1];
            this.grid[tailCoor[0]][tailCoor[1]].setObj(null);
            this.snake.body.pop();
        }
    };

    this.reduceIntervalTime = function(factor) {
        this.intervalTime = this.intervalTime * factor;
    };

    this.renderGrid = function() {
        var htmlStr = '<div id="grid">';
        for (var col_i in this.grid) {
            var col = this.grid[col_i];
            htmlStr = htmlStr + '<div class="col">';

            var rowHtmlStr = '';
            for (var row_i in col) {
                var row = col[row_i];
                rowHtmlStr =
                    row.getView() + rowHtmlStr;
            }
            htmlStr = htmlStr + rowHtmlStr + '</div>';
        }
        htmlStr = htmlStr + '</div>';

        $('div#content').html(htmlStr);
    };

    // INIT CODE:
    this.grid = [];
    for (var col_i = 0; col_i < numCols; col_i++) {
        var col = [];
        this.grid.push(col);
        for (var row_i = 0; row_i < numRows; row_i++) {
            var row = new Square();
            col.push(row);
        }
    }

    Game.prototype = {
        constructor: Game
    }

    this.snake = new Snake([4,4], "right", this.grid, "O");
    this.grid[4][4].setObj(this.snake);
    this.genFood();
};

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
});