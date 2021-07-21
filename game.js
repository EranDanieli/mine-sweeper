'use strict'

var gBoard;
var gLevel = [{ size: 4, mines: 2 }, { size: 8, mines: 12 }, { size: 12, mines: 30 }]
var gLevelSelected = gLevel[0]
var gLives = 3;
const MINE = '🐱‍👤'
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function init() {
    gBoard = createMat(gLevelSelected)
    // console.log('gBoard', gBoard)
    printMat(gBoard, '.table')
    gGame.isOn = false;
    // console.log('gBoard',gBoard)
}



function createMat(gLevelSelected) {
    var size = gLevelSelected.size
    var mines = gLevelSelected.mines
    var mat = []
    for (var i = 0; i < size; i++) {
        var row = []
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                idxI: i,
                idxJ: j
            }
            row.push(cell)
        }
        mat.push(row)
    }
    return mat
}

function clickedLevel(ev) {
    gLevelSelected = gLevel[ev.dataset.number]
    init(gLevelSelected)

}
//temp
function printMat(mat, selector) {
    var display;
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            display = ' '
            if (cell.isMine && cell.isShown) display = MINE

            // }else if()

            // console.log('cell.minesAroundCount',cell.minesAroundCount)
            // if(cell.isShown&&cell.minesAroundCount===0) display = 'yes'
            if (cell.isShown && !cell.isMine) display = mat[i][j].minesAroundCount

            var className = `cell cell${i}${j}" data-i="${i}" data-j="${j}"`;
            strHTML += '<td onclick="cellClicked(this)" class="' + className + '"> ' + display + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function insertMines(board, numOfMines) {
    var emptyCells = getEmptyCells(board)
    for (var i = 0; i < numOfMines; i++) {
        var idx = getRandomInt(0, emptyCells.length)
        var cell = emptyCells[idx]
        // console.log('cell with mine "insertMines', cell)
        gBoard[cell.i][cell.j].isMine = true;
        emptyCells.splice(idx, 1)
    }
    return board
}

function cellClicked(ev) {
    console.log('ev',ev)
    var rowIdx = +ev.dataset.i
    var collIdx = +ev.dataset.j
    //first click
    if (!gGame.isOn) {
        gGame.isOn = true;
        gBoard = markCellFirstClick(gBoard, rowIdx, collIdx)
        gBoard = insertMines(gBoard, gLevelSelected.mines)
        gBoard = updateMinesAround(gBoard)
        console.table(gBoard)
        printMat(gBoard, '.table')
        // console.log('first click')
    } else {
        console.log('after first click')
        //clicked on mine
        if (gBoard[rowIdx][collIdx].isMine) {
            // if(gLives<=0) gameOver();
            console.log('click on mine')
            gBoard[rowIdx][collIdx].isShown = true;
            var elCell = document.querySelector(`.cell${rowIdx}${collIdx}`)
            elCell.classList.add('clickedmine')
            console.log('elCell', elCell)
            gLives--
            printMat(gBoard, '.table')
            // gameOver();
        }
        //clicked on number
        if (gBoard[rowIdx][collIdx].minesAroundCount > 0) {
            gBoard[rowIdx][collIdx].isShown = true;
            printMat(gBoard, '.table')
        }
        //clicked on empty
        if (gBoard[rowIdx][collIdx].minesAroundCount === 0) {
            gBoard[rowIdx][collIdx].isShown = true;
            //neg loop to switch isShown to neg with 0;
            printMat(gBoard, '.table')
        }







    }
}


function updateMinesAround(gBoard) {
    var minesCounter = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (gBoard[i][j].isMine) continue
            var rowIdx = cell.idxI
            var collIdx = cell.idxJ


            for (var a = rowIdx - 1; a <= rowIdx + 1; a++) {
                if (a < 0 || a > gBoard.length - 1) continue
                for (var b = collIdx - 1; b <= collIdx + 1; b++) {
                    if (b < 0 || b > gBoard[0].length - 1) continue
                    if (a === rowIdx && b === collIdx) continue
                    var checkedCell = gBoard[a][b];
                    if (checkedCell.isMine) minesCounter++
                }
            }
            if (gBoard[i][j].isMine) continue
            gBoard[i][j].minesAroundCount = minesCounter
            minesCounter = 0;
        }
    }
    return gBoard
}


function markCellFirstClick(board, rowIdx, collIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = collIdx - 1; j <= collIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (j >= collIdx - 1 || j <= collIdx + 1) {
                if (i >= rowIdx - 1 || i < rowIdx + 1) {
                    var cell = board[i][j];
                    cell.isMine = false;
                    cell.isShown = true;
                }
            }
        }
    }
    return board

}

function getEmptyCells(board) {
    var res = []
    var emptyCell;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isShown && !board[i][j].isMine && board[i][j] !== emptyCell) {
                emptyCell = board[i][j]
                res.push({ i: emptyCell.idxI, j: emptyCell.idxJ })
            }
        }
    }
    return res
}



