// Copyright (c) 2011 Maple <Maplevalley8@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


// sync with presentation tier
const UNIT_LENGTH = 20;
var unitNumX, unitNumY;
const LEFT = 0, RIGHT = 1, UP = 2, DOWN = 3;
var direction;

// data structures used by Interpreter
var mapMatrix; // 2d array storing the map 
var domMatrix;  // 2d array storing the canvas dom references

function Snake() {
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
        this.grow = 2;        
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
    domMatrix[addedNode[1]][addedNode[0]].style.backgroundColor = "yellow"; 
}

Snake.prototype.getDirection = function() {
    switch (direction) {
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

Snake.prototype.step = function() {
    if (this.end) {
        return;
    }

    // execute instruction
    this.move();
}

Snake.prototype.run = function() {
    this.step();

    if (!this.end) {
        // continuously call step every 20ms
        setTimeout(function(){snake.run();}, 100);
    }
    else {
        alert('Game over');
    }
}

Snake.prototype.resetData = function() {
    this.direction = RIGHT;  // program counter direction
    this.end = false;        // bool value indicating the termination of game 
    this.body = [[3, 0], [2, 0], [1, 0], [0, 0]];
    this.grow = 0;
}

Snake.prototype.draw = function() {
    for (var i = 0; i < this.body.length; i++) {
        element = this.body[i];
        // draw snake in canvas
        domMatrix[element[1]][element[0]].style.backgroundColor = "yellow";

        // draw snake in map matrix
        mapMatrix[element[1]][element[0]] = 1;
    }
}

Snake.prototype.remove = function() {
    for (var i = 0; i < this.body.length; i++) {
        element = this.body[i];
        // remove snake on dom matrix
        domMatrix[element[1]][element[0]].style.backgroundColor = "";
        // remove snake on 2d array 
        mapMatrix[element[1]][element[0]] = 0;
    }
}

Snake.prototype.reset = function() {
    this.remove();
    this.resetData();
    this.draw();
}

Snake.prototype.stop = function() {
    if (!this.end) {
        this.end = true;
    }
}

function drawGrid() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    unitNumX = Math.floor(width / UNIT_LENGTH) - 1;
    unitNumY = Math.floor(height / UNIT_LENGTH) - 1;
    var canvasWidth = unitNumX * UNIT_LENGTH
    var canvasHeight = unitNumY * UNIT_LENGTH;

    var canvas = document.getElementById("canvas");
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';

    // init map and dom matrix
    mapMatrix = new Array(unitNumY);
    for (var i = 0; i < unitNumY; ++i) {
        mapMatrix[i] = new Array(unitNumX);
    }
    domMatrix = new Array(unitNumY);
    for (var i = 0; i < unitNumY; ++i) {
        domMatrix[i] = new Array(unitNumX);
    }

    for (var i = 0; i < unitNumY; i += 1) {
        for (var j = 0; j < unitNumX; j += 1) {
            var div = document.createElement("div");
            div.className = "unit";
            div.style.width = UNIT_LENGTH - 1 + "px";
            div.style.height = UNIT_LENGTH -1 + "px";

            // init dom matrix
            domMatrix[i][j] = div;
            canvas.appendChild(div);
        }
    } 
}

function clearmapMatrix() {
    for (var i = 0; i < unitNumY; ++i) {
        for (var j = 0; j < unitNumX; ++j) {
            mapMatrix[i][j] = 0;
        }
    }
}

function generateFood() {
    while (true) {
        var randomX = Math.floor(unitNumX*Math.random());
        var randomY = Math.floor(unitNumY*Math.random());
        console.log(randomX); 
        console.log(randomY); 
        // if a empty unit is found
        if (mapMatrix[randomY][randomX] == 0) {
            // update food in 2d array
            mapMatrix[randomY][randomX] = 2;
            // update food in canvas
            domMatrix[randomY][randomX].style.backgroundColor = 'red';
            break;
        }
    }
}

window.onload = function() {
    var runButton = document.getElementById("runbutton");
    var stepButton = document.getElementById("stepbutton");
    var resetButton = document.getElementById("resetbutton");
    var stopButton = document.getElementById("stopbutton");

    var x, y;
    var curDrag;
    document.documentElement.onmousedown = function(event) {
        curDrag = event.target;

        document.onmousemove = dragMove;
        document.onmouseup = dragStop; 
        x = event.clientX - curDrag.offsetLeft;
        y = event.clientY - curDrag.offsetTop;
    }

    function dragMove(event) {
        curDrag.style.left = event.clientX - x  + 'px';
        curDrag.style.top = event.clientY - y + 'px';
    }

    function dragStop(event) {
        curDrag = document.onmousemove = document.onmouseup = null;
    }

    //key_display = document.getElementById("key");

    snake = new Snake();
    //bind the snake controller with player's pressed direction
    document.onkeydown = function(event) {
        //key_display.innerText = event.keyCode + '';
        switch (event.keyCode) {
            case 38: 
                direction = UP;
                break;
            case 39:
                direction = RIGHT;
                break;
            case 40:
                direction = DOWN;
                break;
            case 37:
                direction = LEFT;
                break;
        }
    }

    // bind events handlers
    runButton.onclick = function() {snake.run();}; 
    stepButton.onclick = function() {snake.step();};
    resetButton.onclick = function() {snake.reset(); direction = RIGHT;}; 
    stopButton.onclick = function() {snake.stop();};



    // draw displaying area
    drawGrid();
    clearmapMatrix();
    snake.draw();
    generateFood();
}
