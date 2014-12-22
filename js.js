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

// CONSTRUCT GRID:
var grid = [];
for (var col_i = 0; col_i < 10; col_i++) {
    var col = [];
    grid.push(col);
    for (var row_i = 0; row_i < 10; row_i++) {
        var row = new Square();
        col.push(row);
    }
}

var renderGrid = function(grid) {
    var htmlStr = '<div id="grid">';
    for (var col_i in grid) {
        var col = grid[col_i];
        htmlStr = htmlStr + '<div class="col">';

        var rowHtmlStr = '';
        for (var row_i in col) {
            var row = col[row_i];
            rowHtmlStr = '<button>' + row.getView() + '</button>' + rowHtmlStr;
        }
        htmlStr = htmlStr + rowHtmlStr + '</div>';
    }
    htmlStr = htmlStr + '</div>';

    $('div#content').html(htmlStr);
};

// CONSTRUCT SNAKE AND SET ON GRID.
var snk = new Snake([4,4], "right", grid, "O");
grid[4][4].setObj(snk);

var emptyDivContent = function() {
    $('div#content').empty();
};

$(document).ready(function() {
    renderGrid(grid);

    $(document).keydown(function(event){
        switch(event.keyCode) {
            case 37:
                snk.dir = "left";
                break;
            case 38:
                snk.dir = "up";
                break;
            case 39:
                snk.dir = "right";
                break;
            case 40:
                snk.dir = "down";
                break;
        }
    });
    $(document).click(function(){
        if (snk.game !== true) {
            snk.game = true;
            snk.intervalID = setInterval(function(){
                snk.move();
                emptyDivContent();
                renderGrid(grid);
            }, 1000);
        } else {
            snk.game = false;
            clearInterval(snk.intervalID);
        }
    });
});
