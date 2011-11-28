const MOVE_INTERVAL = 100;

function Snake(controller) {
    this.controller = controller; 
    this.snakeHead = $('<img>').attr('src', 'image/nyan-cat-right.gif');
    this.snakeHead = $(this.snakeHead).css(
      {'width': UNIT_LENGTH*2 + 'px',
       'position': 'relative',
       'top': -10+'px',
       'left': -10+'px'});
    this.resetData();
}

Snake.prototype.step = function() {
    if (this.end) {
        return;
    }

    // execute instruction
    this.drawBody();
    this.drawHead();
}

Snake.prototype.getDirection = function() {
    this.prev_direction = this.direction;
    var cur_direction = this.controller();
    switch (cur_direction) {
        case UP: 
            if (this.direction != DOWN) {
                this.direction = UP;
            }
            break;
        case DOWN: 
            if (this.direction != UP) {
                this.direction = DOWN;
            }
            break;
        case LEFT: 
            if (this.direction != RIGHT) {
                this.direction = LEFT;
            }
            break;
        case RIGHT: 
            if (this.direction != LEFT) {
                this.direction = RIGHT;
            }
            break;
    }        
}

Snake.prototype.run = function() {
    this.step();

    if (!this.end) {
        // continuously call step every 20ms
        var self = this;
        setTimeout(function(){self.run();}, 100);
    }
    else {
        bubble(this.body[0][0], this.body[0][1], "TvT", 2);
    }
}

Snake.prototype.resetData = function() {
    this.direction = RIGHT;  // program counter direction
    this.prev_direction = RIGHT;
    this.end = true;        // bool value indicating the termination of game 
    this.body = [];
    this.grow = 3;
    $(this.snakeHead).attr('src', 'image/nyan-cat-right.gif');
    //this.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}
Snake.prototype.drawHead = function() {
    var pos = this.body[0];
    // update dom and map matrix
    $(domMatrix[pos[1]][pos[0]]).append($(this.snakeHead));
    mapMatrix[pos[1]][pos[0]] = 1;
}

Snake.prototype.removeHead = function() {
    var pos = this.body[0];
    // update dom and map matrix
    $(domMatrix[pos[1]][pos[0]]).empty();
    mapMatrix[pos[1]][pos[0]] = 0;
}

Snake.prototype.drawBody = function() {
    this.getDirection();
    // get the location of added node
    var headNode = this.body[0].slice();
    var addedNode = headNode.slice();
    var dir;
    // according to direction
    // 1.get the next node 
    // 2.change the image of the nyancat
    switch (this.direction) {
        case LEFT:
            addedNode[0]--;
            dir = 'left';
	    $(this.snakeHead).attr('src', 'image/nyan-cat-left.gif');
            break;
        case RIGHT:
            addedNode[0]++;
            dir = 'right';
	    $(this.snakeHead).attr('src', 'image/nyan-cat-right.gif');
            break;
        case UP:
            addedNode[1]--;
            dir = 'up';
	    $(this.snakeHead).attr('src', 'image/nyan-cat-up.gif');
            break;
        case DOWN:
            addedNode[1]++;
            dir = 'down';
	    $(this.snakeHead).attr('src', 'image/nyan-cat-down.gif');
            break;
    }

    // exceed the border 
    if (addedNode[0] < 0 || addedNode[0] >= unitNumX || // x
    addedNode[1] < 0 || addedNode[1] >= unitNumY) { // y
        this.end = true;
        return;
    } // hit an snake(including itselt)
    else if (mapMatrix[addedNode[1]][addedNode[0]] == 1) {
        this.end = true;
        return;
    } // eat food
    else if (mapMatrix[addedNode[1]][addedNode[0]] == 2) {
        this.grow = 1;        
        removeFood();
        generateFood();
    }

    this.body.unshift(addedNode);
    if (this.grow == 0) {
        // bug here!!! if grow equals 0 at the beginning of the game
        var deletedNode = this.body.pop();
        mapMatrix[deletedNode[1]][deletedNode[0]] = 0;
        $(domMatrix[deletedNode[1]][deletedNode[0]]).removeClass().addClass('unit');
    }
    else this.grow--;

    var bgDir = dir.slice();
    if (this.direction != this.prev_direction) {
        switch (this.prev_direction) {
            case LEFT:
                bgDir = 'left-' + dir;
                break;
            case RIGHT:
                bgDir = 'right-' + dir;
                break;
            case UP:
                bgDir = 'up-' + dir;
                break;
            case DOWN:
                bgDir = 'down-' + dir;
                break;
        }
    }
    $(domMatrix[headNode[1]][headNode[0]]).addClass('rainbow-' + bgDir)
}

Snake.prototype.removeBody = function() {
    for (var i = 1; i < this.body.length; i++) {
        element = this.body[i];
        // remove snake on dom matrix
        $(domMatrix[element[1]][element[0]]).removeClass().addClass('unit');
        // remove snake on 2d array 
        mapMatrix[element[1]][element[0]] = 0;
    }
    this.body = [];
}
Snake.prototype.draw = function(initPoint) {
    if (initPoint != undefined) this.body[0] = initPoint;
    else this.body[0] = getRandomEmptyUnit();

    this.drawHead();
}

Snake.prototype.remove = function() {
    this.end = true;
    this.removeHead();
    this.removeBody();
}

Snake.prototype.reset = function(initPoint) {
    if (this.body[0] != undefined)
        this.remove();
    this.resetData();
    if (initPoint != undefined) {
        this.draw(initPoint);
    }
    else this.draw();
}

Snake.prototype.stop = function() {
    if (!this.end) {
        this.end = true;
    }
}
