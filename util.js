'use strict'

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
/////////////////////////////////////////////////////////////////////////////

//change the if and maybe gBoard
//   function getEmptyCells() {
// 	var res = []
// 	for (var i = 1; i < gBoard.length - 1; i++) {
// 		for (var j = 1; j < gBoard[0].length - 1; j++)
// 			if (gBoard[i][j] === '.' ||gBoard[i][j] === ' ' ) {  //why doesnt work with const instead of direct value?
// 				res.push({ i: i, j: j })
// 			}
// 	} return res
// }
/////////////////////////////////////////////////////////////////////////////
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /////////////////////////////////////////////////////////////////////////////
  //print mat + render cell from pacman game

  function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < mat[0].length; j++) {
        var cell = mat[i][j];
        if (cell === FOOD) gNumOfFood++
        var className = 'cell cell' + i + '-' + j;
        strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
  }
  
  // location such as: {i: 2, j: 7}
  function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
  }
  ///////////////////////////////////////////////////////////////////////////

  //move piece from chess game

  function movePiece(elFromCell, elToCell) {
    // use: getCellCoord to get the coords, move the piece
    var fromCoord = getCellCoord(elFromCell.id);
    var toCoord = getCellCoord(elToCell.id)
    // update the MODEl
    var piece = gBoard[fromCoord.i][fromCoord.j]
    gBoard[fromCoord.i][fromCoord.j] = '';
    gBoard[toCoord.i][toCoord.j] = piece;

    // update the DOM
    elFromCell.innerText = '';
    elToCell.innerText = piece;

}

///////////////////////////////////////////////////////////////////////////
//mark cells from chess game

function markCells(coords) {
    // console.log('coords', coords);
    // query select them one by one and add mark 
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i];
        // console.log('coord', coord)
        var selector = getSelector(coord);
        // console.log('selector', selector)
        var elCell = document.querySelector(selector);
        // console.log('elCell', elCell)
        elCell.classList.add('mark')
    }
}

  /////////////////////////////////////////////////////////////////////////////
//create mat from ball game
//   function createMat(ROWS, COLS) {
//     var mat = []
//     for (var i = 0; i < ROWS; i++) {
//         var row = []
//         for (var j = 0; j < COLS; j++) {
//             row.push('')
//         }
//         mat.push(row)
//     }
//     return mat
// }

  /////////////////////////////////////////////////////////////////////////////
//from ball game, move with arrows - combined with moveTo

// Move the player by keyboard arrows
function handleKey(event) {
	// console.log('event.key', event.key);

	var i = gGamerPos.i;
	var j = gGamerPos.j;

	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}
}
                           ///////////////////

// Move the player to a specific location
function moveTo(i, j) {

	var targetCell = gBoard[i][j];
	// console.log('targetCell', targetCell);
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
		console.log('move!', i, j);

		if (targetCell.gameElement === BALL) {
			console.log('Collecting!');
		}

		// Move the gamer:
		// Moving from current position:
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// Moving to selected position:
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// Dom:
		renderCell(gGamerPos, GAMER_IMG);

	} else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

  /////////////////////////////////////////////////////////////////////////////
 //from wiring up day 9 - check it
 
  function getTime() {
    return new Date().toString().split(' ')[4];
}
/////////////////////////////////////////////////////////////////////////////
//drawnum from day 10 - see gNums and change if needed

function drawNum() {
    var idx = getRandomInt(0, gNums.length)
    var num = gNums[idx]
    gNums.splice(idx, 1)
    return num
}


/////////////////////////////////////////////////////////////////////////////
//from pdf - check it

function printPrimaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
    var item = squareMat[d][d];
    console.log(item);
    }
    }




    function printSecondaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
    var item = squareMat[d][squareMat.length - d - 1];
    console.log(item);
    }
    }


/////////////////////////////////////////////////////////////////////////////
//find neg loop in. from day 8 negs

function countFoodAround(mat, rowIdx, colIdx) {
    var foodCounter = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            // console.log('hi')
            var cell = mat[i][j];
            if (cell === food) foodCounter++
        }
    }
    return foodCounter
}

/////////////////////////////////////////////////////////////////////////////











