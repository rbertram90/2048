/**
 * 2048.js
 * 
 * @param Element container
 *   DOM Element to insert the game markup
 * @param object options
 *   Valid options:
 *     - gridSize int
 *       Size of the grid (3 = 3x3, 4 = 4x4, etc.)
 */
function twoZeroFourEight(container, options) {
    this.board = [];
    this.score = 0;
    this.gridSize = 4;
    this.gameStarted = false;

    var gridContainer = document.createElement("div");
    gridContainer.className = 'grid';

    var buttonContainer = document.createElement("div");
    buttonContainer.className = 'buttons';

    this.createButtons(buttonContainer);

    container.appendChild(gridContainer);
    container.appendChild(buttonContainer);
    this.gameContainer = gridContainer;

    if (options.gridSize) this.gridSize = parseInt(options.gridSize);
    gridContainer.style.width = (100 * this.gridSize) + 'px';

    this.addEventListeners();
    this.startGame();
}

/**
 * Start a new game
 */
twoZeroFourEight.prototype.startGame = function() {
    this.score = 0;
    this.gameStarted = true;
    this.board = [];

    for (var n = 0; n < Math.pow(this.gridSize, 2); n++) {
        this.board.push(0);
    }

    this.spawnNumber();
    this.spawnNumber();
    this.drawBoard();
};

/**
 * Create the output for UI buttons
 */
twoZeroFourEight.prototype.createButtons = function(container) {
    var buttonUp = document.createElement('button');
    buttonUp.id = 'twoZeroFourEight_move_up';
    buttonUp.innerHTML = '^';
    container.appendChild(buttonUp);

    var buttonLeft = document.createElement('button');
    buttonLeft.id = 'twoZeroFourEight_move_left';
    buttonLeft.innerHTML = '<';
    container.appendChild(buttonLeft);

    var buttonRight = document.createElement('button');
    buttonRight.id = 'twoZeroFourEight_move_right';
    buttonRight.innerHTML = '>';
    container.appendChild(buttonRight);

    var buttonDown = document.createElement('button');
    buttonDown.id = 'twoZeroFourEight_move_down';
    buttonDown.innerHTML = 'V';
    container.appendChild(buttonDown);
};

/**
 * Allow game to be played with arrow keys on keyboard.
 */
twoZeroFourEight.prototype.addEventListeners = function() {
    var game = this;

    window.addEventListener("keydown", function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if([37, 38, 39, 40].indexOf(key) > -1) {
            e.preventDefault();
        }
    }, false);

    window.addEventListener("keyup", function(e) {
        if (!game.gameStarted) return;

        var key = e.keyCode ? e.keyCode : e.which;

        if (key == 38) { // up
            game.swipeUp()
        } else if (key == 40) { // down
            game.swipeDown()
        } else if (key == 37) { // left
            game.swipeLeft()
        } else if (key == 39) { // right
            game.swipeRight()
        }
    }, false);

    window.addEventListener("click", function(e){
        if (!e.target) return;
        switch(e.target.id) {
            case 'twoZeroFourEight_move_up': game.swipeUp(); break;
            case 'twoZeroFourEight_move_down': game.swipeDown(); break;
            case 'twoZeroFourEight_move_left': game.swipeLeft(); break;
            case 'twoZeroFourEight_move_right': game.swipeRight(); break;
        }
    });
};

/**
 * Output the HTML for the 2048 grid into DOM element #game.
 */
twoZeroFourEight.prototype.drawBoard = function() {
    var content = "";
    var bgcolour = "";
    
    for(var i = 0; i < Math.pow(this.gridSize, 2); i++) {
        switch(this.board[i]) {
            case 0: bgcolour = '#eee'; break;
            case 2: bgcolour = '#ccc'; break;
            case 4: bgcolour = '#BCF2D3'; break;
            case 8: bgcolour = '#8EDBAF'; break;
            case 16: bgcolour = '#5EC48A'; break;
            case 32: bgcolour = '#37D5EE'; break;
            case 64: bgcolour = '#E3ED36'; break;
            case 128: bgcolour = '#EDC636'; break;
            case 256: bgcolour = '#ED9E36'; break;
            case 512: bgcolour = '#ED9E36'; break;
            case 1024: bgcolour = '#ED7336'; break;
            case 2048: bgcolour = '#ED3651'; break;
            case 4096: bgcolour = '#C536ED'; break;
            case 8192: bgcolour = '#5A36ED'; break;
            case 16384: bgcolour = '#333333; color:#fff'; break;
        }
    
        content += '<div class="cell" style="background-color:' + bgcolour + '">' + this.board[i] + '</div>';
    }

    this.gameContainer.innerHTML = '<div>Score:' + this.score + '</div>' + content;
};

/**
 * Place a 2 or 4 in a random empty space.
 */
twoZeroFourEight.prototype.spawnNumber = function() {
    var possiblePlaces = [];

    for(var i = 0; i < Math.pow(this.gridSize, 2); i++) {
        if(this.board[i] == 0) {
            possiblePlaces.push(i);
        }
    }
    
    var squareNumber = Math.floor(possiblePlaces.length * Math.random());
    
    // 1 in 8 chance of getting a 4 rather than 2
    var isAFour = Math.floor(8 * Math.random());
    var number = (isAFour == 0) ? 4 : 2;
    
    this.board[possiblePlaces[squareNumber]] = number;
};

/**
 * Move all tiles to the bottom.
 * 
 * @return boolean
 *   True if tiles were able to move
 */
twoZeroFourEight.prototype.swipeDown = function() {
    var cellValue, belowCellValue;
    var lockedCells = [];
    var moveMade = false;
    
    // Check all cells below this one for occurances
    // of the same number or blank spaces

    // Loop through top 3 rows, starting from 3rd row
    var startingIndex = Math.pow(this.gridSize, 2) - this.gridSize - 1;

    for (var i = startingIndex; i >= 0; i--) {
        cellValue = this.board[i];
        if (cellValue == 0) continue;
        
        // Check all rows above this one
        // May need to check (up to) 3 rows above
        rowsToCheck = (this.gridSize - 1) - Math.floor(i / this.gridSize);
        
        for (var j = 1; j <= rowsToCheck; j++) {
        
            belowCellIndex = i + (this.gridSize * j);
            belowCellValue = this.board[belowCellIndex];
        
            if (belowCellValue == 0) {
                // Move it down
                this.board[belowCellIndex] = cellValue;
                // Replace current cell with 0
                this.board[i + (this.gridSize * (j - 1))] = 0;
                moveMade = true;
            }
            else if (belowCellValue == cellValue) {
                if (lockedCells.indexOf(belowCellValue) == -1) {
                    // Update grid
                    this.board[belowCellIndex] = cellValue * 2;
                    this.board[i + (this.gridSize * (j - 1))] = 0;

                    // Increment score
                    this.score += cellValue * 2;

                    // Once combined, 'lock' the cell as don't
                    // want to combine twice in one move
                    lockedCells.push(belowCellIndex);
                }
                moveMade = true;
                break;
            }
            else {
                break;
            }
        }
    }
    
    if(moveMade) {
        this.spawnNumber();
        this.drawBoard();
    }

    return moveMade;
};

/**
 * Move all tiles to the top.
 * 
 * @return boolean
 *   True if tiles were able to move
 */
twoZeroFourEight.prototype.swipeUp = function() {
    var cellValue, belowCellValue;
    var lockedCells = [];
    var moveMade = false;
    
    var finalIndex = Math.pow(this.gridSize, 2) - 1;
    for (var i = this.gridSize; i <= finalIndex; i++) {
        cellValue = this.board[i];
        if (cellValue == 0) continue;
        
        rowsToCheck = Math.floor(i / this.gridSize);
        
        for (var j = 1; j <= rowsToCheck; j++) {
        
            targetCellIndex = i - (this.gridSize * j);
            belowCellValue = this.board[targetCellIndex];
        
            if (belowCellValue == 0) {
                this.board[targetCellIndex] = cellValue;
                this.board[i - (this.gridSize * (j - 1))] = 0;
                moveMade = true;
            }
            else if (belowCellValue == cellValue) {
                if(lockedCells.indexOf(targetCellIndex) == -1) {
                    this.board[targetCellIndex] = cellValue * 2;
                    this.board[i - (this.gridSize * (j - 1))] = 0;
                    this.score += cellValue * 2;
                    lockedCells.push(targetCellIndex);
                }
                moveMade = true;
                break;
            }
            else {
                break;
            }
        }
    }
    
    if(moveMade) {
        this.spawnNumber();
        this.drawBoard();
    }
    
    return moveMade;
};

/**
 * Move all tiles to the left.
 * 
 * @return boolean
 *   True if tiles were able to move
 */
twoZeroFourEight.prototype.swipeLeft = function() {
    var cellValue, belowCellValue;
    var lockedCells = [];
    var moveMade = false;
    
    for (var h = 0; h < this.gridSize - 1; h++) {
        for (var i = 1; i < Math.pow(this.gridSize, 2); i+=this.gridSize) {
            cellIndex = i + h;
            cellValue = this.board[cellIndex];
            
            if (cellValue == 0) continue;
            
            rowsToCheck = h+1; // (columns!)
            
            for (var j = 1; j <= rowsToCheck; j++) {
                
                targetCellIndex = cellIndex - j;
                belowCellValue = this.board[targetCellIndex];
            
                if (belowCellValue == 0) {
                    this.board[targetCellIndex] = cellValue;
                    this.board[cellIndex - (j - 1)] = 0;
                    moveMade = true;
                }
                else if (belowCellValue == cellValue) {
                    if (lockedCells.indexOf(targetCellIndex) == -1) {
                        this.board[targetCellIndex] = cellValue * 2;
                        this.score += cellValue * 2;
                        this.board[cellIndex - (j - 1)] = 0;
                        lockedCells.push(targetCellIndex);
                    }
                    moveMade = true;
                    break;
                }
                else {
                    break;
                }
            }
        }
    }
    
    if(moveMade) {
        this.spawnNumber();
        this.drawBoard();
    }

    return moveMade;
};

/**
 * Move all tiles to the right.
 * 
 * @return boolean
 *   True if tiles were able to move
 */
twoZeroFourEight.prototype.swipeRight = function() {
    var cellValue, belowCellValue;
    var lockedCells = [];
    var moveMade = false;
    
    // column
    for(var h = this.gridSize - 2; h >= 0; h--) {
        // row
        for(var i = 0; i < Math.pow(this.gridSize, 2) - 1; i+=this.gridSize) {
            cellIndex = i + h;
            cellValue = this.board[cellIndex];

            if (cellValue == 0) continue;
            
            rowsToCheck = (this.gridSize - 1) - h; // (columns)
            
            for (var j = 1; j <= rowsToCheck; j++) {
                targetCellIndex = cellIndex + j;
                belowCellValue = this.board[targetCellIndex];
            
                if (belowCellValue == 0) {
                    this.board[targetCellIndex] = cellValue;
                    this.board[cellIndex + (j - 1)] = 0;
                    moveMade = true;
                }
                else if (belowCellValue == cellValue) {
                    if (lockedCells.indexOf(targetCellIndex) == -1) {
                        this.board[targetCellIndex] = cellValue * 2;
                        this.score += cellValue * 2;
                        this.board[cellIndex + (j - 1)] = 0;
                        lockedCells.push(targetCellIndex);
                    }
                    moveMade = true;
                    break;
                }
                else {
                    break;
                }
            }
        }
    }
    
    if(moveMade) {
        this.spawnNumber();
        this.drawBoard();
    }

    return moveMade;
};