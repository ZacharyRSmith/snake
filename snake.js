var Food = function() {
    this.view = "V";
}

var Snake = function(coor, dir, grid, view) {
    this.body = [coor];
    this.dir = dir;
    this.grid = grid;
    this.view = view;

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
    }

    this.move = function move() {
        console.log("MOVE!");

        var nextCoor = this.buildNextCoor();
        
                console.log("nextCoor: " + nextCoor);
        // HELLO!
        if (this.grid[nextCoor[0]] === undefined) {
            clearInterval(this.intervalID);
            console.log("YOU LOSE!!");
            return false;
        } else if (this.grid[nextCoor[0]][nextCoor[1]] === undefined) {
            clearInterval(this.intervalID);
            console.log("YOU LOSE!!");
            return false;
            
            // else if next coor are snake, LOSE
            // else if next coor hasObj (food), eat
        } else {
            this.grid[nextCoor[0]][nextCoor[1]].setObj(this);
            this.body.unshift(nextCoor);

            var tailCoor = this.body[this.body.length - 1];
            this.grid[tailCoor[0]][tailCoor[1]].setObj(null);
            this.body.pop();
        }
    };
}

var Square = function(view) {
    this.obj = null;
    this.getObj = function() { return this.obj; };
    this.setObj = function(arg_obj) { this.obj = arg_obj; }
//     this.view = "X";
    this.getView = function() {
        if (this.getObj()) { return this.getObj().view; }
        else { return "."; }
    };
}

var Game = function(num_cols, num_rows) {
    // INIT CODE:
    this.grid = [];
    for (var col_i = 0; col_i < num_cols; col_i++) {
        var col = [];
        this.grid.push(col);
        for (var row_i = 0; row_i < num_rows; row_i++) {
            var row = new Square();
            col.push(row);
        }
    }

    this.snk = new Snake([4,4], "right", this.grid, "O");
    this.grid[4][4].setObj(this.snk);

    // PROPS:
    // intervalID is used to keep track of setInterval() ID.
    this.intervalID = null;
    this.isInProgress = false;

    // METHODS:
    this.emptyDivContent = function() {
        $('div#content').empty();
    };

    this.genFood = function() {
        
// Build random coor based on grid.
        
// Check that those coor are empty.
// setObj(new Food()) on that square.
    }

    this.renderGrid = function() {
        var htmlStr = '<div id="grid">';
        for (var col_i in this.grid) {
            var col = this.grid[col_i];
            htmlStr = htmlStr + '<div class="col">';

            var rowHtmlStr = '';
            for (var row_i in col) {
                var row = col[row_i];
                rowHtmlStr =
                    '<button>' + row.getView() + '</button>' + rowHtmlStr;
            }
            htmlStr = htmlStr + rowHtmlStr + '</div>';
        }
        htmlStr = htmlStr + '</div>';

        $('div#content').html(htmlStr);
    };
}

var game = new Game(10, 10);
$(document).ready(function() {
    game.renderGrid();

    $(document).keydown(function(event){
        switch(event.keyCode) {
            case 37:
                game.snk.dir = "left";
                break;
            case 38:
                game.snk.dir = "up";
                break;
            case 39:
                game.snk.dir = "right";
                break;
            case 40:
                game.snk.dir = "down";
                break;
        }
    });
    // If game not in progress, start.
    // Else pause game.
    $(document).click(function(){
        if (game.isInProgress === false) {
            game.isInProgress = true;
            game.intervalID = setInterval(function(){
                game.snk.move();
                game.emptyDivContent();
                game.renderGrid();
            }, 1000);
        } else {
            game.isInProgress = false;
            clearInterval(game.intervalID);
        }
    });
});
