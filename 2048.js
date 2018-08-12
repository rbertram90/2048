var board;
var score = 0;

/**
 * Output the HTML for the 2048 grid into DOM element #game.
 */
function drawBoard() {
    var content = "";
    var bgcolour = "";
    
    for(var i = 0; i < 16; i++) {
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

    document.getElementById('game').innerHTML = '<div>Score:' + score + '</div>' + content;
}

/**
 * Place a 2 or 4 in a random empty space.
 */
function spawnNumber() {
    var possiblePlaces = [];

    for(var i = 0; i < 16; i++) {
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
    
    for(var i = 11; i >= 0; i--) {
        cellValue = board[i];
        if(cellValue == 0) continue;
        
        rowsToCheck = 3 - Math.floor(i / 4); // may need to check up to 3 rows below
        
        for(var j = 1; j <= rowsToCheck; j++) {
        
            belowCellValue = board[i + (4 * j)];
        
            if(belowCellValue == 0) {
                board[i + (4 * j)] = cellValue;
                if(j > 1)
                    board[i + (4 * (j - 1))] = 0;
                else
                    board[i] = 0;
                moveMade = true;
            }
            else if(belowCellValue == cellValue) {
                if(lockedCells.indexOf(i + (4 * j)) == -1) {
                    board[i + (4 * j)] = cellValue * 2;
                    score += cellValue * 2;
                    
                    if(j > 1)
                        board[i + (4 * (j - 1))] = 0;
                    else
                        board[i] = 0;
                        
                    lockedCells.push(i + (4 * j));
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
    
    for(var i = 4; i <= 15; i++) {
        cellValue = board[i];
        if(cellValue == 0) continue;
        
        rowsToCheck = Math.floor(i / 4); // may need to check up to 3 rows below
        
        for(var j = 1; j <= rowsToCheck; j++) {
        
            targetCellIndex = i - (4 * j);
            belowCellValue = board[targetCellIndex];
        
            if(belowCellValue == 0) {
                board[targetCellIndex] = cellValue;
                if(j > 1)
                    board[i - (4 * (j - 1))] = 0;
                else
                    board[i] = 0;
                moveMade = true;
            }
            else if(belowCellValue == cellValue) {
                if(lockedCells.indexOf(targetCellIndex) == -1) {
                    board[targetCellIndex] = cellValue * 2;
                    score += cellValue * 2;
                    
                    if(j > 1)
                        board[i - (4 * (j - 1))] = 0;
                    else
                        board[i] = 0;
                        
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
    
    for(var h = 0; h <= 2; h++) {
        for(var i = 1; i <= 15; i+=4) {
            cellIndex = i + h;
            cellValue = board[cellIndex];
            
            // Don't worry about 0 values
            if(cellValue == 0) continue;
            
            rowsToCheck = h+1; // (columns)
            
            for(var j = 1; j <= rowsToCheck; j++) {
                
                targetCellIndex = cellIndex - j;
                belowCellValue = board[targetCellIndex];
            
                if(belowCellValue == 0) {
                    board[targetCellIndex] = cellValue;
                    if(j > 1) {
                        board[cellIndex - (j - 1)] = 0;
                    }
                    else {
                        board[cellIndex] = 0;
                    }
                    moveMade = true;
                }
                else if(belowCellValue == cellValue) {
                    if(lockedCells.indexOf(targetCellIndex) == -1) {
                        board[targetCellIndex] = cellValue * 2;
                        score += cellValue * 2;
                        
                        if(j > 1)
                            board[cellIndex - (j - 1)] = 0;
                        else
                            board[cellIndex] = 0;
                            
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
    
    for(var h = 2; h >= 0; h--) {
        for(var i = 0; i <= 14; i+=4) {
            cellIndex = i + h;
            cellValue = board[cellIndex];
            
            // Don't worry about 0 values
            if(cellValue == 0) continue;
            
            rowsToCheck = 3-h; // (columns)
            
            for(var j = 1; j <= rowsToCheck; j++) {
                
                targetCellIndex = cellIndex + j;
                belowCellValue = board[targetCellIndex];
            
                if(belowCellValue == 0) {
                    board[targetCellIndex] = cellValue;
                    if(j > 1) {
                        board[cellIndex + (j - 1)] = 0;
                    }
                    else {
                        board[cellIndex] = 0;
                    }
                    moveMade = true;
                }
                else if(belowCellValue == cellValue) {
                    if(lockedCells.indexOf(targetCellIndex) == -1) {
                        board[targetCellIndex] = cellValue * 2;
                        score += cellValue * 2;
                        
                        if(j > 1)
                            board[cellIndex + (j - 1)] = 0;
                        else
                            board[cellIndex] = 0;
                            
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
function startGame() {
    board =[0,0,0,0,
            0,0,0,0,
            0,0,0,0,
            0,0,0,0];
    spawnNumber();
    spawnNumber();
    drawBoard();
    score = 0;
}

/**
 * Allow game to be played with arrow keys on keyboard.
 */
window.onkeyup = function(e) {
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
}