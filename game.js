'use strict'
window.addEventListener("contextmenu", e => e.preventDefault());
var minesMarkedCounter = 0;
var gBoard;
var gLevel = [{ size: 4, mines: 2 }, { size: 8, mines: 12 }, { size: 12, mines: 30 }]
var gLevelSelected = gLevel[0]
var gLives = '3';
const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ' '
var numOfSafeClick = 3;
var gMinesLocations = [];
var gInterval;
var seconds = +0
var minutes = +0
var gGame = {
    markedCount: 0,
    isOn: false,
    shownCount: 0,
    secsPassed: 0
}


function init() {
    numOfSafeClick = 3;
    minesMarkedCounter=0
    gGame.markedCount=0;
    gGame.shownCount=0;
    restartTimer()
    gMinesLocations = [];
    gGame.isVictory = false
    gBoard = createMat(gLevelSelected)
    gGame.isOn = false;
    gLives = (gLevelSelected.mines===2)? 2 : 3;
    updateLives();
    document.querySelector('.restartbtn').innerHTML =
    `<div class="restartbtn center"> <span><button onclick="init()">😁</button></span> </div>`
    document.getElementById('safeClickBtn').innerText= `${numOfSafeClick} Safe Clicks Left`
    printMat(gBoard, '.table')
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

function printMat(mat, selector) {
    var display;
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = `cell cell${i}${j}" data-i="${i}" data-j="${j}"`;
            display = ' '
            if (cell.isMine && cell.isShown&&gGame.isOn) {
                display = MINE
                className = `cell clickedmine cell${i}${j}" data-i="${i}" data-j="${j}"`;
            } 

            if (cell.isMarked) display = FLAG;
            if (cell.isShown && !cell.isMine) display = mat[i][j].minesAroundCount
            if(cell.isShown && !cell.isMine&& cell.minesAroundCount===0 && gGame.isOn) {
                display = EMPTY;
                className = `cell emptyCell cell${i}${j}" data-i="${i}" data-j="${j}"`;
            }


            strHTML += '<td onmouseup="getMouseClickEvent(event)" onclick="cellClicked(this)" class="' + className + '"> ' + display + ' </td>'
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
        gBoard[cell.i][cell.j].isMine = true;
        emptyCells.splice(idx, 1)
        gMinesLocations.push({ i: cell.i, j: cell.j })
    }
    console.log('gMinesLocations', gMinesLocations)
    return board
}

function cellClicked(ev, click) {

    if (gGame.isVictory) return
    if (gLives === 0) return
   

    var rowIdx = +ev.dataset.i
    var collIdx = +ev.dataset.j

    if (click === 'right') {
        if(!gBoard[rowIdx][collIdx].isMarked){
             gGame.markedCount++
        }else gGame.markedCount--
        gBoard[rowIdx][collIdx].isMarked = (!gBoard[rowIdx][collIdx].isMarked)
        printMat(gBoard, '.table')
        checkVictoryByFlags()
        return
        
    }
    if (gBoard[rowIdx][collIdx].isMarked) return
    //first click
    if (!gGame.isOn) {
        if (!gGame.isOn)
         gInterval = setInterval(startTimer, 1000)
        gGame.isOn = true;
        gBoard = markCellFirstClick(gBoard, rowIdx, collIdx)
        gBoard = insertMines(gBoard, gLevelSelected.mines)
        gBoard = updateMinesAround(gBoard)
        printMat(gBoard, '.table')
    } else {
        //clicked on mine
        if (gBoard[rowIdx][collIdx].isMine) {
            gBoard[rowIdx][collIdx].isShown = true;
            gLives--
            updateLives()
            printMat(gBoard, '.table')
            checkLoss()
            return
        }
        //clicked on number
        if (gBoard[rowIdx][collIdx].minesAroundCount > 0) {
            if (!gBoard[rowIdx][collIdx].isShown) gGame.shownCount++
            gBoard[rowIdx][collIdx].isShown = true;
            printMat(gBoard, '.table')
        }
        //clicked on empty
        if (gBoard[rowIdx][collIdx].minesAroundCount === 0) {
            if (!gBoard[rowIdx][collIdx].isShown) gGame.shownCount++
            gBoard[rowIdx][collIdx].isShown = true;
            for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
                if (i < 0 || i > gBoard.length - 1) continue
                for (var j = collIdx - 1; j <= collIdx + 1; j++) {
                    if (j < 0 || j > gBoard[0].length - 1) continue
                    if (j >= collIdx - 1 || j <= collIdx + 1) {
                        if (i >= rowIdx - 1 || i < rowIdx + 1) {
                            var cell = gBoard[i][j];
                            if (cell.isMine || cell.isMarked || cell.isShown) continue
                            cell.isShown = true;
                            gGame.shownCount++
                        }
                    }
                }
            }
            printMat(gBoard, '.table')
        }
        checkVictoryShown()
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
                    gGame.shownCount++
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

function updateLives() {
    document.querySelector('.left').innerHTML = `<span>Lives:</span><span> ${gLives}</span>`
}

function getMouseClickEvent(ev) {
    var mouseSideClick = (ev.button > 0) ? 'right' : 'left'
    cellClicked(ev.target, mouseSideClick)


}

function gameOver() {
    document.querySelector('.restartbtn').innerHTML =
        `<div class="restartbtn center"> <span><button onclick="init()">😔</button></span> </div>`
    console.log('You Lost')
    clearInterval(gInterval)



}

function checkVictoryByFlags() {
    if(gGame.markedCount>gLevelSelected.mines)return
     minesMarkedCounter = 0;
    if (gLives === 0) gameOver();
    for (var i = 0; i < gMinesLocations.length; i++) {
        if (gBoard[gMinesLocations[i].i][gMinesLocations[i].j].isMarked) minesMarkedCounter++
    }
    if (gLevelSelected.mines === minesMarkedCounter ) { 
        showRestOfcells()
        victory()
    }
}
function victory() {
    document.querySelector('.restartbtn').innerHTML =
        `<div class="restartbtn center"> <span><button onclick="init()">😎</button></span> </div>`
    console.log('YOU WIN!')
    gGame.isVictory = true;
    clearInterval(gInterval)
}

function startTimer() {
    var elSeconds = document.getElementById('seconds')
    var elMinutes = document.getElementById('minutes')

    seconds++
    if (seconds <= 9) elSeconds.innerHTML = '0' + seconds;
    if (seconds > 9) elSeconds.innerHTML = seconds;
    if (seconds > 59) {
        seconds = +0
        elSeconds.innerHTML = '0' + seconds;
        minutes++
        elMinutes.innerHTML = '0' + minutes;
    }

}
function restartTimer() {
    clearInterval(gInterval)
    var elTimer = document.querySelector('.right')
    seconds = +0
    minutes = +0
    elTimer.innerHTML = `<span id="minutes">00</span>:<span id="seconds">00</span>`
}
function checkVictoryShown() {
    if (gGame.shownCount === (gLevelSelected.size * gLevelSelected.size) - gLevelSelected.mines)
        victory()
}
function checkLoss(){
    if(gLives<1){
        revealAllMines()
        gameOver()

    } 
}
function showRestOfcells(){
    for(var i = 0 ; i<gBoard.length;i++){
        for(var j = 0 ; j<gBoard[0].length;j++){
            var cell = gBoard[i][j];
            if(!cell.isShown) cell.isShown=true
        }
    }printMat(gBoard,'.table')
}

function revealAllMines(){
for(var i = 0 ; i<gMinesLocations.length;i++){
    var cellLocation = gMinesLocations[i]
    var cellIdxI = cellLocation.i
    var cellIdxJ = cellLocation.j
    gBoard[cellIdxI][cellIdxJ].isShown=true
    printMat(gBoard,'.table')
}
}


function safeClick(){
    if(!gGame.isOn) return
   if(numOfSafeClick<1)return
   numOfSafeClick--
    var currCells = getEmptyCells(gBoard)
    var idx = getRandomInt(0,currCells.length-1)
    var cell = currCells[idx]
   var elCell = document.querySelector(`.cell${cell.i}${cell.j}`)
   console.log('cell',cell)
   console.log('elCell',elCell)
   elCell.classList.add('safeclick')
   setTimeout(function(){
       elCell.classList.remove('safeclick')},1500)
       document.getElementById('safeClickBtn').innerText= `${numOfSafeClick} Safe Clicks Left`

}