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
var foodX, foodY;
var foodDiv;
var userSnake;

// data structures used by Interpreter
var mapMatrix; // 2d array storing the map 
var domMatrix;  // 2d array storing the canvas dom references


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
    clearMapMatrix();
}

function drawStars() {
    for (var i = 0; i < 12; ++i) {
        pos = getRandomEmptyUnit();
        $('<img>').addClass('star').attr('src', 'image/star.gif')
                  .css({'left': pos[0]*UNIT_LENGTH +'px', 'top': pos[1]*UNIT_LENGTH +'px'}).appendTo('#canvas')
    }
}

function clearMapMatrix() {
    for (var i = 0; i < unitNumY; ++i) {
        for (var j = 0; j < unitNumX; ++j) {
            mapMatrix[i][j] = 0;
        }
    }
}

function clearDomMatrix() {
    for (var i = 0; i < unitNumY; ++i) {
        for (var j = 0; j < unitNumX; ++j) {
            domMatrix[i][j].style.backgroundColor = '';
        }
    }
}

function getDirection() {
    return direction;
}

function getRelativeDirection(fromX, fromY, toX, toY) {
    var diffX = fromX - toX;
    var diffY = fromY - toY;
    //console.log(diffX);
    //console.log(diffY);

    if (diffX == 1) return LEFT;
    else if (diffX  == -1) return RIGHT;
    else if (diffY == 1) return UP;
    else return DOWN;
}

function aStarFinder() {
    // make a new copy of the map 2d array
    var map = new Array(unitNumY);
    for (var i = 0; i < unitNumY; ++i) {
        map[i] = new Array(unitNumX);
    }
    for (var i = 0; i < unitNumY; ++i) {
        for (var j = 0; j < unitNumX; ++j) {
            map[i][j] = mapMatrix[i][j];
        }
    }
    var from = this.body[0];
    map[from[1]][from[0]] = 0;
    map[foodY][foodX] = 0;

    var grid = new PF.Grid(unitNumX, unitNumY, map);
    var finder = new PF.AStarFinder();
    var path = finder.findPath(from[0], from[1], foodX, foodY, grid);
    var nextNode = path[1];

    //console.log(from);
    //console.log(nextNode);
    // get adjacent direction
    return getRelativeDirection(from[0], from[1], nextNode[0], nextNode[1]);
}

function getRandomEmptyUnit() {
    while (true) {
        var x = Math.floor(unitNumX*Math.random());
        var y = Math.floor(unitNumY*Math.random());
        // if a empty unit is found
        if (mapMatrix[y][x] == 0) break;
    }
    return [x, y];
}

function generateFood() {
    var randomEmptyUnit = getRandomEmptyUnit();
    foodX = randomEmptyUnit[0]; 
    foodY = randomEmptyUnit[1];
    //console.log(foodX); 
    //console.log(foodY); 
    // update food in 2d array
    mapMatrix[foodY][foodX] = 2;
    // update food in canvas
    //$(domMatrix[foodY][foodX]).html('<img src="image/berry.png" width="30" height="30" alt="?" ></img>');
    foodDiv = $('<img>').attr('src', 'image/berry.png');
    $(foodDiv).css('width', UNIT_LENGTH*1.5 + 'px');
    foodDiv = $(foodDiv).appendTo($('<div>')).css('position', 'absolute');
    var pos = $(domMatrix[foodY][foodX]).offset();
    pos.top -= UNIT_LENGTH /4;
    pos.left -= UNIT_LENGTH /4;
    $(foodDiv).css('top', pos.top + 'px');
    $(foodDiv).css('left', pos.left + 'px');
    $(foodDiv).appendTo('#canvas');
}

function removeFood() {
    // remove food in 2d array
    mapMatrix[foodY][foodX] = 0;
    // remove food in canvas
    $(foodDiv).remove();
}

function bubble(x, y, words, lastTime) {
    var obj = domMatrix[y][x];
    var x = obj.offsetLeft;
    var y = obj.offsetTop;

    var div = document.createElement("div");
    div.className = "triangle-isosceles";
    div.style.left = x - 20 + 'px'; 
    div.style.top = y - 80 + 'px';
    div.textContent = words;
    console.log(div.innerText);
    document.body.appendChild(div);

    setTimeout(function(){$(div).fadeOut(500);}, lastTime*1000);
}

window.onload = function() {
    var initButton = document.getElementById("initbutton");
    var startButton = document.getElementById("startbutton");
    var revivalButton = document.getElementById("revivalbutton");

    $("#info-panel").draggable();
    $("#rule").click(function() {
        $(this).next().animate({'height': 'toggle'}, 'slow');
    });

    // draw displaying area
    drawGrid();
    drawStars();
    $('#ai-number').attr('value', 2);
    //bind the snake controller with player's pressed direction
    document.onkeydown = function(event) {
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
    var aiNumber = 0;
    var aiSnakeArray;
    userSnake = new Snake(getDirection);
    initButton.onclick = function() {
        userSnake.reset();
        bubble(userSnake.body[0][0], userSnake.body[0][1], "I'm here ￣ε ￣", 2);
        if (foodX != undefined) removeFood();
        // remove previous ai snakes
        for (var i = 0; i < aiNumber; i++) {
            aiSnakeArray[i].remove();
        } 
        // the number of ai snakes may change
        aiNumber = parseInt(document.getElementById('ai-number').value); 
        aiSnakeArray = [];
        for (var i = 0; i < aiNumber; i++) {
            aiSnakeArray[i] = new Snake(aStarFinder);
            aiSnakeArray[i].draw(getRandomEmptyUnit());
        } 
        generateFood();
        setTimeout(function() {
            bubble(foodX, foodY, "(＞﹏＜) Don't eat me!", 3);
            }, 3000);
    };
    startButton.onclick = function() {
        document.getElementById('audio').play();
        $('#rule').next().animate({ 'height': 'hide'});
        if (userSnake.end == true) {
            userSnake.end = false;
            userSnake.run();
        }
        for (var i = 0; i < aiNumber; i++) {
            if (aiSnakeArray[i].end == true) {
                aiSnakeArray[i].end = false;
                aiSnakeArray[i].run();
            }
        }
    };
    revivalButton.onclick = function() {
        if (userSnake.end == true) {
            userSnake.reset(); 
            bubble(userSnake.body[0][0], userSnake.body[0][1], "◕‿‿◕", 1);
        }
        for (var i = 0; i < aiNumber; i++) {
            if (aiSnakeArray[i].end == true)
                aiSnakeArray[i].reset();
        }
        direction = RIGHT;
        setTimeout(function() {
            bubble(userSnake.body[0][0], userSnake.body[0][1], '3', 0.5)}
        , 1000);
        setTimeout(function() {
            bubble(userSnake.body[0][0], userSnake.body[0][1], '2', 0.5)}
        , 1500);
        setTimeout(function() {
            bubble(userSnake.body[0][0], userSnake.body[0][1], '1', 0.5)}
        , 2000);
        userSnake.end = false;
        setTimeout(function() {userSnake.run();}, 1500);
    };
}
