const board = (() => {
  // Creating a 3x3 Board or 9 cells
  const board = [];

  for (let i = 0; i < 3; i++) {
    board[i] = [];
    for (let j = 0; j < 3; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  // put players mark in cell if empty or else return
  const putMark = (row, col, mark) => {
    if (board[row][col].getValue() === "") {
      board[row][col].setValue(mark);
      return true;
    } else {
      return false;
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues);
  };

  const clearBoard = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].getValue() !== "") {
          board[i][j].setValue("");
        }
      }
    }
  };

  return { getBoard, putMark, printBoard, clearBoard };
})();

function Cell() {
  let value = "";

  const getValue = () => {
    return value;
  };

  const setValue = (mark) => (value = mark);

  return {
    getValue,
    setValue,
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two",
) {
  const players = [
    {
      name: playerOneName,
      mark: 1,
      score: 0,
    },
    {
      name: playerTwoName,
      mark: 2,
      score: 0,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();

    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const checkWinner = () => {
    let mark = getActivePlayer().mark;
    const currentBoard = board.getBoard();
    console.log(currentBoard[0][0].getValue());
    // column wise cheking winner

    for (let i = 0; i < 3; i++) {
      let match = true;
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i][j].getValue() !== mark) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }

    // row wise checking
    for (let i = 0; i < 3; i++) {
      let match = true;
      for (let j = 0; j < 3; j++) {
        if (currentBoard[j][i].getValue() !== mark) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }

    // diagonal checking
    let diag = true;
    for (let i = 0; i < 3; i++) {
      if (currentBoard[i][i].getValue() !== mark) {
        diag = false;
        break;
      }
    }
    if (diag) return true;
    diag = true;
    for (let i = 0; i < 3; i++) {
      if (currentBoard[i][2 - i].getValue() !== mark) {
        diag = false;
        break;
      }
    }
    if (diag) return true;

    return false;
  };

  const clearBoard = () => {
    board.clearBoard();
    board.printBoard();
  };

  const playRound = (row, col) => {
    console.log(`Putting ${getActivePlayer().name} into Cell (${(row, col)})`);
    board.putMark(row, col, getActivePlayer().mark);
    let win;

    if (checkWinner()) {
      console.log(`Player ${getActivePlayer().name} wins`);
      win = `Player ${getActivePlayer().name} wins`;
      getActivePlayer().score++;
      if (getActivePlayer.score === 3) {
        console.log(`Player ${getActivePlayer().name} is the overall winner`);
        win = `Player ${getActivePlayer().name} is the overall winner`;
      }
    }
    switchPlayerTurn();
    printNewRound();
    return win;
  };

  printNewRound();

  return { playRound, getActivePlayer, clearBoard, getBoard: board.getBoard };
}

function ScreenController() {
  const game = GameController();
  const infoDiv = document.querySelector(".info");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    boardDiv.textContent = "";
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    infoDiv.textContent = `${activePlayer.name}'s turn...`;

    board.forEach((row, rowIndex) => {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");
      row.forEach((cell, colIndex) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");

        cellDiv.dataset.row = rowIndex;
        cellDiv.dataset.col = colIndex;
        if (cellDiv.textContent === "") {
          cellDiv.textContent = cell.getValue();
        }
        rowDiv.append(cellDiv);
      });
      boardDiv.append(rowDiv);
    });
  };

  function clickHandlerBoard(e) {
    const cellRow = e.target.dataset.row;
    const cellCol = e.target.dataset.col;
    const activePlayer = game.getActivePlayer();

    if (!cellRow && !cellCol) return;

    let info = game.playRound(cellRow, cellCol);
    if (info) {
      infoDiv.textContent = info;
      updateScreen();
    } else {
      updateScreen();
    }
  }
  updateScreen();

  boardDiv.addEventListener("click", clickHandlerBoard);
}

ScreenController();
