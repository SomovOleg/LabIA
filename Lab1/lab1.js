var fs = require('fs');
function logActions(action) {
    var date = new Date();
    var currentTime = "".concat(date.getHours(), ":").concat(date.getMinutes(), ":").concat(date.getSeconds());
    fs.appendFileSync('actions_log.txt', currentTime + ' ' + action + '\n');
}
var BlockCoordinate = /** @class */ (function () {
    function BlockCoordinate(rowCoord, colCoord) {
        this.row = rowCoord;
        this.col = colCoord;
    }
    return BlockCoordinate;
}());
var Board = /** @class */ (function () {
    function Board(numCols, numRows) {
        this.numCols = numCols;
        this.numRows = numRows;
        this._matrix = [];
        this._usedNumbers = [];
        this._matrixSize = new BlockCoordinate(numCols, numRows);
        for (var col = 0; col < numRows; col++) {
            this._matrix[col] = [];
            for (var row = 0; row < numCols; row++) {
                this._matrix[col][row] = 0;
            }
        }
        logActions("Create a new board with ".concat(numRows, " x ").concat(numRows, " dimension"));
    }
    Board.prototype.render = function () {
        console.log(this._matrix);
        logActions("Render a board");
    };
    Board.prototype.addBlock = function (rowCoord, colCoord, blockID) {
        logActions("Try to added a block on ".concat(rowCoord, "x").concat(colCoord));
        if (this._usedNumbers.indexOf(blockID) != -1 || blockID === 0) {
            console.log("".concat(blockID, " element is exists or equal to 0!"));
            logActions("".concat(blockID, " element is exists or equal to 0! Can't add an element"));
            return;
        }
        if (colCoord > this._matrixSize.col || rowCoord > this._matrixSize.row || colCoord < 0 || rowCoord < 0) {
            console.log('Out of range!');
            logActions("Out of range! Can't add an element");
            return;
        }
        if (this._matrix[rowCoord][colCoord] != 0) {
            console.log('Coordinates are already used!');
            logActions("Coordinates are already used! Can't add an element");
            return;
        }
        if (rowCoord !== this._matrixSize.row - 1 && this._matrix[rowCoord + 1][colCoord] === 0) {
            console.log('Can\'t put on 0 or replace with new element');
            logActions("Can't put on 0 or replace with new element");
            return;
        }
        logActions("Place new element on ".concat(rowCoord, "x").concat(colCoord));
        this._matrix[rowCoord][colCoord] = blockID;
        this._usedNumbers.push(blockID);
        logActions("Add ".concat(blockID));
    };
    Board.prototype.detectTop = function (colTarget) {
        logActions("Try to detect top on ".concat(colTarget, " column"));
        for (var i = 0; i < this._matrixSize.row; i++) {
            if (this._matrix[i][colTarget] != 0) {
                logActions("The top is ".concat(i, " element"));
                return i;
            }
        }
    };
    Board.prototype.detectCoordinatesBlock = function (block) {
        logActions("Try to detect top on ".concat(block, " coordinates"));
        for (var col = 0; col < this._matrixSize.col; col++) {
            for (var row = 0; row < this._matrixSize.row; row++) {
                if (this._matrix[row][col] === block) {
                    logActions("The coordinate is ".concat(col, " column ").concat(row, " row"));
                    return new BlockCoordinate(row, col);
                }
            }
        }
    };
    Board.prototype.moveBlock = function (first, second) {
        logActions("Try to put ".concat(first, " block on ").concat(second, " block"));
        if (this._usedNumbers.indexOf(first) === -1 || this._usedNumbers.indexOf(second) === -1) {
            console.log("Error! One of block doesn't exists");
            logActions("Error! One of block doesn't exists");
            return;
        }
        if (first === 0 || second === 0) {
            console.log("Error! One of block is equal to 0");
            logActions("Error! One of block is equal to 0");
            return;
        }
        var firstCoordinate = this.detectCoordinatesBlock(first);
        var secondCoordinate = this.detectCoordinatesBlock(second);
        if (secondCoordinate.row - 1 < 0) {
            console.log("Column is filled!");
            logActions("Column is filled!");
            return;
        }
        if (this._matrix[firstCoordinate.row][firstCoordinate.col] === this._matrix[secondCoordinate.row - 1][secondCoordinate.col]) {
            console.log("Blocks are already placed!");
            return;
        }
        this.eliberateBlock(firstCoordinate, secondCoordinate.col);
        this.eliberateBlock(secondCoordinate, firstCoordinate.row);
        this.putOnTop(firstCoordinate, secondCoordinate.col);
        logActions("Success!");
    };
    Board.prototype.eliberateBlock = function (coordinates, restrictedCol) {
        logActions("Try to eliberate block on ".concat(coordinates.col, "X").concat(coordinates.row, " coordinates"));
        if (this._matrix[0][coordinates.col] !== 0) {
            logActions("The block is already the top of the column");
            return;
        }
        while (this._matrix[coordinates.row - 1][coordinates.col] !== 0) {
            logActions("Try to detect the current top of ".concat(coordinates.col));
            var currentTop = new BlockCoordinate(this.detectTop(coordinates.col), coordinates.col);
            var targetCol = void 0;
            if (coordinates.col === restrictedCol) {
                logActions("Current col is restricted col");
                targetCol = (restrictedCol === 0) ? coordinates.col + 2 : coordinates.col - 2;
                logActions("Target top is ".concat(targetCol));
            }
            else {
                targetCol = (restrictedCol < coordinates.col) ? coordinates.col - 1 : coordinates.col + 1;
                logActions("Target top is ".concat(targetCol));
            }
            this.putOnTop(currentTop, targetCol);
        }
    };
    Board.prototype.putOnTop = function (newTopCoordinate, targetCol) {
        logActions("Try to put block on the top");
        var targetTop = this.detectTop(targetCol) - 1;
        var targetCoordinate = new BlockCoordinate(targetTop, targetCol);
        this.changeBlocks(newTopCoordinate, targetCoordinate);
    };
    Board.prototype.changeBlocks = function (firstCoordinate, secondCoordinate) {
        logActions("Change block on ".concat(firstCoordinate.col, "X").concat(firstCoordinate.row, " and ").concat(secondCoordinate.col, "X").concat(secondCoordinate.row, " with places "));
        logActions("Take block from ".concat(secondCoordinate.row, "X").concat(secondCoordinate.col));
        var tmpBlock = this._matrix[secondCoordinate.row][secondCoordinate.col];
        logActions("Change block from ".concat(firstCoordinate.row, "X").concat(firstCoordinate.col));
        this._matrix[secondCoordinate.row][secondCoordinate.col] = this._matrix[firstCoordinate.row][firstCoordinate.col];
        logActions("Put block on  ".concat(firstCoordinate.col, "X").concat(firstCoordinate.row));
        this._matrix[firstCoordinate.row][firstCoordinate.col] = tmpBlock;
    };
    return Board;
}());
//create board
fs.writeFileSync('actions_log.txt', '');
var test = new Board(5, 5);
//add new blocks
test.addBlock(4, 0, 5);
test.addBlock(4, 1, 2);
test.addBlock(4, 2, 3);
test.addBlock(4, 3, 1);
test.addBlock(4, 4, 11);
test.addBlock(3, 0, 10);
test.addBlock(2, 0, 31);
test.addBlock(3, 2, 12);
test.addBlock(3, 4, 21);
var continueCheck = true;
function reciveAnInput() {
    console.clear();
    test.render();
    var readlineSync = require('readline-sync');
    var inputString = readlineSync.question('Input elements to change places(through spaces): ');
    var resultString = inputString.split(' ');
    var firstElement = Number(resultString[0]);
    var secondElement = Number(resultString[1]);
    test.moveBlock(firstElement, secondElement);
    test.render();
}
while (continueCheck) {
    reciveAnInput();
    var readlineSync = require('readline-sync');
    var inputString = readlineSync.question('Continue? (y/n): ');
    if (inputString !== 'y') {
        continueCheck = false;
    }
}
