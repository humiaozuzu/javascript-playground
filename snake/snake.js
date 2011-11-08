function Snake(controller) {
    this.controller = controller; 
    this.resetData();
}

Snake.prototype.move = function() {
    this.getDirection();
    // get the location of added node
    var headNode = [].concat(this.body[0]);
    switch (this.direction) {
        case LEFT:
            headNode[0]--;
            break;
        case RIGHT:
            headNode[0]++;
            break;
        case UP:
            headNode[1]--;
            break;
        case DOWN:
            headNode[1]++;
            break;
    }
    var addedNode = headNode;
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
        generateFood();
    }

    this.body.unshift(addedNode);
    if (this.grow == 0) {
        var deletedNode = this.body.pop();
        mapMatrix[deletedNode[1]][deletedNode[0]] = 0;
        domMatrix[deletedNode[1]][deletedNode[0]].style.backgroundColor = "";
    }
    else this.grow--;

    //update map matrix
    mapMatrix[addedNode[1]][addedNode[0]] = 1;
    // update canvas
    domMatrix[addedNode[1]][addedNode[0]].style.backgroundColor = this.color; 
}

Snake.prototype.step = function() {
    if (this.end) {
        return;
    }

    // execute instruction
    this.move();
}

Snake.prototype.getDirection = function() {
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
    this.end = true;        // bool value indicating the termination of game 
    this.body = [];
    this.grow = 3;
    this.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    console.log(this.color);
}

Snake.prototype.draw = function(initPoint) {
    if (initPoint != undefined) this.body[0] = initPoint;
    else this.body[0] = getRandomEmptyUnit();
    for (var i = 0; i < this.body.length; i++) {
        element = this.body[i];
        // draw snake in canvas
        domMatrix[element[1]][element[0]].style.backgroundColor = this.color;

        // draw snake in map matrix
        mapMatrix[element[1]][element[0]] = 1;
    }
}

Snake.prototype.remove = function() {
    this.end = true;
    for (var i = 0; i < this.body.length; i++) {
        element = this.body[i];
        // remove snake on dom matrix
        domMatrix[element[1]][element[0]].style.backgroundColor = "";
        // remove snake on 2d array 
        mapMatrix[element[1]][element[0]] = 0;
    }
    this.body = [];
}

Snake.prototype.reset = function(initPoint) {
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
