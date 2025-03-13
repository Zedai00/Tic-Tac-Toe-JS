function GameBoard() {
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
    if (board[row][col].getValue() === 0) {
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

  return { getBoard, putMark, printBoard };
}

function Cell() {
  let value = 0;

  const getValue = () => value;

  const setValue = (mark) => (value = mark);

  return {
    getValue,
    setValue,
  };
}

function Game(playerOneName = "Player One", playerTwoName = "Player Two") {
  const board = GameBoard();

  const players = [
    {
      name: playerOneName,
      mark: 1,
    },
    {
      name: playerTwoName,
      mark: 2,
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

  const playRound = (row, col) => {
    console.log(`Putting ${getActivePlayer().name} into Cell (${(row, col)})`);
    board.putMark(row, col, getActivePlayer().mark);

    if (checkWinner()) {
      console.log(`Player ${getActivePlayer().name} wins`);
      resetGame();
    }

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return { playRound, getActivePlayer };
}

const game = Game();
