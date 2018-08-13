// System variables
var board = [];
var score = 0;
var gridSize = 4; // Size of the grid (3 = 3x3, 4 = 4x4, etc.)
var gameContainer = null; // Container element for game
var gameStarted = false;

/**
 * Output the HTML for the 2048 grid into DOM element #game.
 */
function drawBoard() {
    var content = "";
    var bgcolour = "";
    
    for(var i = 0; i < Math.pow(gridSize, 2); i++) {
        switch(board[i]) {
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
    
        content += '<div class="cell" style="background-color:' + bgcolour + '">' + board[i] + '</div>';
    }

    gameContainer.innerHTML = '<div>Score:' + score + '</div>' + content;
}

/**
 * Place a 2 or 4 in a random empty space.
 */
function spawnNumber() {
    var possiblePlaces = [];

    for(var i = 0; i < Math.pow(gridSize, 2); i++) {
        if(board[i] == 0) {
            possiblePlaces.push(i);
        }
    }
    
    var squareNumber = Math.floor(possiblePlaces.length * Math.random());
    
    // 1 in 8 chance of getting a 4 rather than 2
    var isAFour = Math.floor(8 * Math.random());
    var number = (isAFour == 0) ? 4 : 2;
    
    board[possiblePlaces[squareNumber]] = number;
}

/**
 * Move all tiles to the bottom.
 * 
 * @return boolean
 *   True if tiles were able to move
 */
function swipeDown() {
    var cellValue, belowCellValue;
    var lockedCells = [];
    var moveMade = false;
    
    // Check all cells below this one for occurances
    // of the same number or blank spaces

    // Loop through top 3 rows, starting from 3rd row
    var startingIndex = Math.pow(gridSize, 2) - gridSize - 1;

    for (var i = startingIndex; i >= 0; i--) {
        cellValue = board[i];
        if (cellValue == 0) continue;
        
        // Check all rows above this one
        // May need to check (up to) 3 rows above
        rowsToCheck = (gridSize - 1) - Math.floor(i / gridSize);
        
        for (var j = 1; j <= rowsToCheck; j++) {
        
            belowCellIndex = i + (gridSize * j);
            belowCellValue = board[belowCellIndex];
        
            if (belowCellValue == 0) {
                // Move it down
                board[belowCellIndex] = cellValue;
                // Replace current cell with 0
                board[i + (gridSize * (j - 1))] = 0;
                moveMade = true;
            }
            else if (belowCellValue == cellValue) {
                if (lockedCells.indexOf(belowCellValue) == -1) {
                    // Update grid
                    board[belowCellIndex] = cellValue * 2;
                    board[i + (gridSize * (j - 1))] = 0;

                    // Increment score
                    score += cellValue * 2;

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
        spawnNumber();
        drawBoard();
    }

    return moveMade;
}

/**
 * Move all tiles to the top.
 * 
 * @return boolean
 *   True if tiles were able to move
 */
function swipeUp() {
    var cellValue, belowCellValue;
    var lockedCells = [];
    var moveMade = false;
    
    var finalIndex = Math.pow(gridSize, 2) - 1;
    for (var i = gridSize; i <= finalIndex; i++) {
        cellValue = board[i];
        if (cellValue == 0) continue;
        
        rowsToCheck = Math.floor(i / gridSize);
        
        for (var j = 1; j <= rowsToCheck; j++) {
        
            targetCellIndex = i - (gridSize * j);
            belowCellValue = board[targetCellIndex];
        
            if (belowCellValue == 0) {
                board[targetCellIndex] = cellValue;
                board[i - (gridSize * (j - 1))] = 0;
                moveMade = true;
            }
            else if (belowCellValue == cellValue) {
                if(lockedCells.indexOf(targetCellIndex) == -1) {
                    board[targetCellIndex] = cellValue * 2;
                    board[i - (gridSize * (j - 1))] = 0;
                    score += cellValue * 2;
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
        spawnNumber();
        drawBoard();
    }
    
    return moveMade;
}

/**
 * Move all tiles to the left.
 * 
 * @return boolean
 *   True if tiles were able to move
 */
function swipeLeft() {
    var cellValue, belowCellValue;
    var lockedCells = [];
    var moveMade = false;
    
    for (var h = 0; h < gridSize - 1; h++) {
        for (var i = 1; i < Math.pow(gridSize, 2); i+=gridSize) {
            cellIndex = i + h;
            cellValue = board[cellIndex];
            
            if (cellValue == 0) continue;
            
            rowsToCheck = h+1; // (columns!)
            
            for (var j = 1; j <= rowsToCheck; j++) {
                
                targetCellIndex = cellIndex - j;
                belowCellValue = board[targetCellIndex];
            
                if (belowCellValue == 0) {
                    board[targetCellIndex] = cellValue;
                    board[cellIndex - (j - 1)] = 0;
                    moveMade = true;
                }
                else if (belowCellValue == cellValue) {
                    if (lockedCells.indexOf(targetCellIndex) == -1) {
                        board[targetCellIndex] = cellValue * 2;
                        score += cellValue * 2;
                        board[cellIndex - (j - 1)] = 0;
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
        spawnNumber();
        drawBoard();
    }

    return moveMade;
}

/**
 * Move all tiles to the right.
 * 
 * @return boolean
 *   True if tiles were able to move
 */
function swipeRight() {
    var cellValue, belowCellValue;
    var lockedCells = [];
    var moveMade = false;
    
    // column
    for(var h = gridSize - 2; h >= 0; h--) {
        // row
        for(var i = 0; i < Math.pow(gridSize, 2) - 1; i+=gridSize) {
            cellIndex = i + h;
            cellValue = board[cellIndex];

            if (cellValue == 0) continue;
            
            rowsToCheck = (gridSize - 1) - h; // (columns)
            
            for (var j = 1; j <= rowsToCheck; j++) {
                targetCellIndex = cellIndex + j;
                belowCellValue = board[targetCellIndex];
            
                if (belowCellValue == 0) {
                    board[targetCellIndex] = cellValue;
                    board[cellIndex + (j - 1)] = 0;
                    moveMade = true;
                }
                else if (belowCellValue == cellValue) {
                    if (lockedCells.indexOf(targetCellIndex) == -1) {
                        board[targetCellIndex] = cellValue * 2;
                        score += cellValue * 2;
                        board[cellIndex + (j - 1)] = 0;
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
        spawnNumber();
        drawBoard();
    }

    return moveMade;
}

/**
 * Initialise the game board.
 */
function startGame(container, options) {

    if (options.gridSize) gridSize = parseInt(options.gridSize);

    gameContainer = container;
    gameContainer.style.width = (100 * gridSize) + 'px';

    board = [];
    for (var n = 0; n < Math.pow(gridSize, 2); n++) {
        board.push(0);
    }

    spawnNumber();
    spawnNumber();
    drawBoard();
    score = 0;
    gameStarted = true;
}


/**
 * Allow game to be played with arrow keys on keyboard.
 */
window.addEventListener("keydown", function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if([37, 38, 39, 40].indexOf(key) > -1) {
        e.preventDefault();
    }
}, false);
window.addEventListener("keyup", function(e) {
    if (!gameStarted) return;

    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 38) { // up
        swipeUp()
    } else if (key == 40) { // down
        swipeDown()
    } else if (key == 37) { // left
        swipeLeft()
    } else if (key == 39) { // right
        swipeRight()
    }
}, false);