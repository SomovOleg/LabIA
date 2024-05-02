const fs = require('fs');

function logActions(action) {
    const date = new Date();
    const currentTime: string = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    fs.appendFileSync('actions_log.txt', currentTime + ' ' + action + '\n');
}

class BlockCoordinate {
    public row: number;
    public col: number;

    constructor(rowCoord: number, colCoord: number) {
        this.row = rowCoord;
        this.col = colCoord;
    }
}

class Board { 
    private _matrix: number[][] = [];
    private _usedNumbers: number[] = [];
    private _matrixSize: BlockCoordinate;
  
    constructor(public numCols: number, public numRows: number) {
        this._matrixSize = new BlockCoordinate(numCols, numRows);

        for(let col = 0; col < numRows; col++) {
            this._matrix[col] = [];

            for(let row = 0; row < numCols; row++) {
                this._matrix[col][row] = 0;
            }
        }

        logActions(`Create a new board with ${numRows} x ${numRows} dimension`)
    }

    render() {
        console.log(this._matrix);
        logActions(`Render a board`)
    }

    addBlock(rowCoord: number, colCoord: number, blockID: number) {
        logActions(`Try to added a block on ${rowCoord}x${colCoord}`)
        if(this._usedNumbers.indexOf(blockID) != -1 || blockID === 0) {
            console.log(`${blockID} element is exists or equal to 0!`);
            logActions(`${blockID} element is exists or equal to 0! Can't add an element`);
            return;
        }

        if(colCoord > this._matrixSize.col || rowCoord > this._matrixSize.row || colCoord < 0 || rowCoord < 0) {
            console.log('Out of range!');
            logActions(`Out of range! Can't add an element`);
            return;
        }

        if(this._matrix[rowCoord][colCoord] != 0) {
            console.log('Coordinates are already used!');
            logActions(`Coordinates are already used! Can't add an element`);
            return;
        }

        if(rowCoord !== this._matrixSize.row - 1 && this._matrix[rowCoord + 1][colCoord] === 0) {
            console.log('Can\'t put on 0 or replace with new element');
            logActions(`Can\'t put on 0 or replace with new element`);
            return;
        }

        logActions(`Place new element on ${rowCoord}x${colCoord}`);
        this._matrix[rowCoord][colCoord] = blockID;

        logActions(`Add ${blockID}`);

    }

    private detectTop(colTarget: number): number {
        logActions(`Try to detect top on ${colTarget} column`)  
        for(let i = 0; i < this._matrixSize.row; i++) {
            if(this._matrix[i][colTarget] != 0) {
                logActions(`The top is ${i} element`);
                return i;
            }
        }
    }

    private detectCoordinatesBlock(block): BlockCoordinate {
        logActions(`Try to detect top on ${block} coordinates`)  
        for(let col = 0; col < this._matrixSize.col; col++) {
            for(let row = 0; row < this._matrixSize.row; row++) {
                if(this._matrix[row][col] === block) {
                    logActions(`The coordinate is ${col} column ${row} row`)  
                    return new BlockCoordinate(row, col);
                }
            }
        }
    }

    public moveBlock(first: number, second: number) {
        logActions(`Try to put ${first} block on ${second} block`)
        if(this._usedNumbers.indexOf(first) === -1 || this._usedNumbers.indexOf(second) === -1) {
            console.log("Error! One of block doesn't exists");
            logActions("Error! One of block doesn't exists")
            return;
        }

        if(first === 0 || second === 0) {
            console.log("Error! One of block is equal to 0");
            logActions("Error! One of block is equal to 0");
            return;
        }

        const firstCoordinate = this.detectCoordinatesBlock(first);
        const secondCoordinate = this.detectCoordinatesBlock(second);

        if(secondCoordinate.row - 1 < 0) {
            console.log("Column is filled!");
            logActions("Column is filled!");
            return;
        }

        if(this._matrix[firstCoordinate.row][firstCoordinate.col] === this._matrix[secondCoordinate.row - 1][secondCoordinate.col]) {
            console.log("Blocks are already placed!");
            return;
        }

        this.eliberateBlock(firstCoordinate, secondCoordinate.col);
        this.eliberateBlock(secondCoordinate, firstCoordinate.row);

        this.putOnTop(firstCoordinate, secondCoordinate.col);
        logActions(`Success!`);
    }

    private eliberateBlock(coordinates: BlockCoordinate, restrictedCol: number) {
        logActions(`Try to eliberate block on ${coordinates.col}X${coordinates.row} coordinates`)
        if(this._matrix[0][coordinates.col] !== 0) {
            logActions("The block is already the top of the column");
            return;
        } 

        while (this._matrix[coordinates.row - 1][coordinates.col] !== 0) {
            logActions(`Try to detect the current top of ${coordinates.col}`);
            const currentTop = new BlockCoordinate(this.detectTop(coordinates.col), coordinates.col);
            let targetCol: number;
    
            if (coordinates.col === restrictedCol) {
                logActions(`Current col is restricted col`);
                targetCol = (restrictedCol === 0) ? coordinates.col + 2 : coordinates.col - 2;
                logActions(`Target top is ${targetCol}`);
            } else {
                targetCol = (restrictedCol < coordinates.col) ? coordinates.col - 1 : coordinates.col + 1;
                logActions(`Target top is ${targetCol}`);
            }
            
            this.putOnTop(currentTop, targetCol);
        }
    }

    private putOnTop(newTopCoordinate: BlockCoordinate, targetCol) {
        logActions("Try to put block on the top");
        let targetTop = this.detectTop(targetCol) - 1;
        let targetCoordinate = new BlockCoordinate(targetTop, targetCol);   
        this.changeBlocks(newTopCoordinate, targetCoordinate);
    }

    private changeBlocks(firstCoordinate: BlockCoordinate, secondCoordinate: BlockCoordinate) {
        logActions(`Change block on ${firstCoordinate.col}X${firstCoordinate.row} and ${secondCoordinate.col}X${secondCoordinate.row} with places `);
        logActions(`Take block from ${secondCoordinate.row}X${secondCoordinate.col}`);
        const tmpBlock = this._matrix[secondCoordinate.row][secondCoordinate.col];
        logActions(`Change block from ${firstCoordinate.row}X${firstCoordinate.col}`);
        this._matrix[secondCoordinate.row][secondCoordinate.col] = this._matrix[firstCoordinate.row][firstCoordinate.col];
        logActions(`Put block on  ${firstCoordinate.col}X${firstCoordinate.row}`);
        this._matrix[firstCoordinate.row][firstCoordinate.col] = tmpBlock;
    }

}

//create board
fs.writeFileSync('actions_log.txt', ''); 
const test = new Board(5, 5);

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

let continueCheck: boolean = true;

function reciveAnInput() {
    console.clear();
    test.render();
    const readlineSync = require('readline-sync');
    const inputString: string = readlineSync.question('Input elements to change places(through spaces): ');
    const resultString: string[] = inputString.split(' ');

    const firstElement = Number(resultString[0]);
    const secondElement = Number(resultString[1]);

    test.moveBlock(firstElement, secondElement);
    test.render();


}

while(continueCheck) {
    reciveAnInput();
    const readlineSync = require('readline-sync');
    const inputString: string = readlineSync.question('Continue? (y/n): ');

    if(inputString !== 'y') {
        continueCheck = false;
    }
}