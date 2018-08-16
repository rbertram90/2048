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
function twoZeroFourEight(container) {
    // Default options
    this.gridSize = 4;
    this.spawnSize = 4;

    // Game state
    this.gameStarted = false;

    var gridContainer = document.createElement("div");
    gridContainer.className = 'grid';

    var buttonContainer = document.createElement("div");
    buttonContainer.className = 'buttons';

    this.createButtons(buttonContainer);

    var undoButton = document.createElement("button");
    undoButton.id = "twoZeroFourEight_undo";
    undoButton.innerHTML = "Undo";
    container.appendChild(undoButton);

    var redoButton = document.createElement("button");
    redoButton.id = "twoZeroFourEight_redo";
    redoButton.innerHTML = "Redo";
    container.appendChild(redoButton);

    container.appendChild(gridContainer);
    container.appendChild(buttonContainer);
    this.gameContainer = gridContainer;

    this.addEventListeners();
}

/**
 * Start a new game
 */
twoZeroFourEight.prototype.newGame = function(options) {
    this.score = 0;
    this.currentTurn = 0;
    this.gameStarted = true;
    this.board = [];
    this.turnHistory = [];

    if (options.gridSize) this.gridSize = parseInt(options.gridSize);
    this.gameContainer.style.width = (100 * this.gridSize) + 'px';

    if (options.spawnSize) this.spawnSize = parseInt(options.spawnSize);

    if (options.startingGrid) {
        this.board = options.startingGrid;
    }
    else {
        for (var n = 0; n < Math.pow(this.gridSize, 2); n++) {
            this.board.push(0);
        }
        this.spawnNumber();
        this.spawnNumber();
    }

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
 * Listen for events from keyboard and UI buttons.
 */
twoZeroFourEight.prototype.addEventListeners = function() {
    var game = this;

    window.addEventListener("keydown", function(e) {
        if (!game.gameStarted) return;
        var key = e.keyCode ? e.keyCode : e.which;
        if([37, 38, 39, 40].indexOf(key) > -1) {
            e.preventDefault();

            if (key == 38) { // up
                game.runSwipe('up')
            } else if (key == 40) { // down
                game.runSwipe('down')
            } else if (key == 37) { // left
                game.runSwipe('left')
            } else if (key == 39) { // right
                game.runSwipe('right')
            }
        }
    }, false);

    window.addEventListener("click", function(e){
        if (!e.target) return;
        switch(e.target.id) {
            case 'twoZeroFourEight_move_up': game.runSwipe('up'); break;
            case 'twoZeroFourEight_move_down': game.runSwipe('down'); break;
            case 'twoZeroFourEight_move_left': game.runSwipe('left'); break;
            case 'twoZeroFourEight_move_right': game.runSwipe('right'); break;
            case 'twoZeroFourEight_undo': game.undoMove(); break;
            case 'twoZeroFourEight_redo': game.redoMove(); break;

        }
    });
};

/**
 * Run move
 */
twoZeroFourEight.prototype.runSwipe = function(direction) {
    var currentBoard = this.board.slice();
    var changed = false;

    switch (direction) {
        case 'up': changed = game.swipeUp(); break;
        case 'down': changed = game.swipeDown(); break;
        case 'left': changed = game.swipeLeft(); break;
        case 'right': changed = game.swipeRight(); break;
    }

    if (changed) {
        this.logMove(currentBoard);
        this.currentTurn++;
    }
};

/**
 * Undo last move
 */
twoZeroFourEight.prototype.undoMove = function() {
    if (this.currentTurn == 0) return;
    this.logMove();
    this.board = this.turnHistory[this.currentTurn - 1];
    this.currentTurn--;
    this.drawBoard();
};

/**
 * Redo move
 */
twoZeroFourEight.prototype.redoMove = function() {
    if (this.currentTurn >= this.turnHistory.length - 1) return;
    this.board = this.turnHistory[this.currentTurn + 1];
    this.currentTurn++;
    this.drawBoard();
};

/**
 * Add an entry to the history
 * 
 * @param array board (optional)
 */
twoZeroFourEight.prototype.logMove = function(board) {
    if (board) {
        this.turnHistory[this.currentTurn] = board;
    }
    else {
        this.turnHistory[this.currentTurn] = this.board.slice();
    }
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
 * Place a number in a random empty space.
 * Usually this would be a 2 or 4 but player can choose to have
 * higher numbers spawning.
 */
twoZeroFourEight.prototype.spawnNumber = function() {
    var possiblePlaces = [];

    for(var i = 0; i < Math.pow(this.gridSize, 2); i++) {
        if(this.board[i] == 0) {
            possiblePlaces.push(i);
        }
    }
    
    var squareNumber = Math.floor(possiblePlaces.length * Math.random());
    var number;
    var random;

    // chances
    // 1/8 = 4
    // 1/16 = 8
    // 1/32 = 16
    // 1/64 = 32
    // etc.

    switch(this.spawnSize) {
        case 2:
            // Always spawn 2's
            number = 2;
            break;
        case 4:
            // 1 in 8 chance of getting a 4 rather than 2
            random = Math.floor(8 * Math.random());
            number = (random == 0) ? 4 : 2;
            break;
        case 8:
            random = Math.floor(16 * Math.random());
            if (random < 2) number = 4;
            else if (random < 3) number = 8;
            else number = 2;
        case 16:
            random = Math.floor(32 * Math.random());
            if (random < 4) number = 4;
            else if (random < 6) number = 8;
            else if (random < 7) number = 16;
            else number = 2;
        case 32:
            random = Math.floor(64 * Math.random());
            if (random < 8) number = 4;
            else if (random < 12) number = 8;
            else if (random < 14) number = 16;
            else if (random < 15) number = 32;
            else number = 2;
    }

    
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