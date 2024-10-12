function createMove(x, y) {
    return { x, y }
}

let board = (function () {
    let zero = []
    let cross = []
    let getAllMoves = (() => zero.concat(cross))

    function addMove(sign, move) {
        let allMoves = getAllMoves()
        for (let i = 0; i < allMoves.length; i++) {
            let current = allMoves[i]
            if (current.x == move.x && current.y == move.y) return false
        }

        if (sign == "zero") {
            zero.push(move)
        } else if (sign == "cross") {
            cross.push(move)
        }

        if (checkDiagonal(sign) || checkHorizontal(sign) || checkVertical(sign)) {
            return true
        }

    }

    function checkHorizontal(sign) {
        let moves = (sign == "zero") ? zero : cross

        let columns = {
            0: 0,
            1: 0,
            2: 0,

            addWin: function (columnIndex) {
                if (this[columnIndex] == 2) return true

                this[columnIndex]++
                return false
            }
        }

        for (let i = 0; i < moves.length; i++) {
            let current = moves[i]
            if (columns.addWin(current.x)) return true
        }

        return false
    }

    function checkVertical(sign) {
        let moves = (sign == "zero") ? zero : cross

        let rows = {
            0: 0,
            1: 0,
            2: 0,

            addWin: function (rowIndex) {
                if (this[rowIndex] == 2) return true
                this[rowIndex]++
                return false
            }
        }

        for (let i = 0; i < moves.length; i++) {
            let current = moves[i]
                        if (rows.addWin(current.y)) return true
        }

        return false
    }

    function checkDiagonal(sign) {
        let moves = (sign == "zero") ? zero : cross

        let wins = {
            same: 0,
            distinct: 0,

            addWin: function (type) {
                if (this[type] == 2) return true

                this[type]++
                return false
            }
        }

        for (let i = 0; i < moves.length; i++) {
            let current = moves[i]

            if (current.x == current.y) {
                if (Math.abs(current.x - current.y) == 2) {
                    if (wins.addWin("distinct")) return true
                } else {
                    if (wins.addWin("same")) return true
                }
            }
        }

        return false
    }

    return { addMove, allMoves: getAllMoves }
})()


let tttGrid = document.querySelector(".ttt-grid")
let topBar = document.querySelector(".top-bar")
let lastMove = "zero"

function makeMove(event) {
    let targetSquare = event.target.closest(".grid-square")

    let colIndexClass;
    let rowIndexClass;

    for (let i = 0; i < targetSquare.classList.length; i++) {
        let currClass = targetSquare.classList[i]

        if (currClass.startsWith("grid-col")) {
            colIndexClass = currClass
            break
        }
    }

    for (let i = 0; i < targetSquare.parentElement.classList.length; i++) {
        let currClass = targetSquare.parentElement.classList[i]

        if (currClass.startsWith("row")) {
            rowIndexClass = currClass
            break
        }
    }

    let colIndex = Number(colIndexClass.slice(-1))
    let rowIndex = Number(rowIndexClass.slice(-1))

    let move = createMove(colIndex, rowIndex)
    
    let result = board.addMove(lastMove, move)

    if (result != false) {
        if (lastMove == "zero") {
            if (result == true) topBar.textContent = "Cross Wins!"
            else topBar.textContent = "Zero plays next"

            lastMove = "cross"
            targetSquare.textContent = "X"
        } else {
            if (result == true) topBar.textContent = "Zero Wins!"
            else topBar.textContent = "Cross plays next"

            lastMove = "zero"
            targetSquare.textContent = "O"
        }
    } else {
        topBar.textContent = "Try again!"
    }

    if (result == true) {
        tttGrid.removeEventListener("click", makeMove)
    }
}

tttGrid.addEventListener("click", makeMove)