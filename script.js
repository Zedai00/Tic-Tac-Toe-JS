function Board() {
  // Creating a 3x3 Board or 9 cells
  const board = [];

  for (let i = 0; i < 3; i++) {
    board[i] = [];
    for (let j = 0; j < 3; j++) {
      board[i].push(Cell());
    }
  }

  const getActualBoard = () => board;

  // put players mark in cell if empty or else return
  const putMark = (row, col, mark) => {
    if (board[row][col].getValue() === "") {
      board[row][col].setValue(mark);
      return true;
    } else {
      return false;
    }
  };

  const isFull = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].getValue() === "") {
          return false;
        }
      }
    }
    return true;
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

  return { getActualBoard, putMark, printBoard, clearBoard, isFull };
}

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
      mark: "X",
      score: 0,
      win: false,
    },
    {
      name: playerTwoName,
      mark: "O",
      score: 0,
      win: false,
    },
  ];

  const board = Board();

  let activePlayer = players[0];

  const getPlayers = () => players;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const checkWinner = () => {
    const mark = getActivePlayer().mark;
    const currentBoard = board.getActualBoard();
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

  const getBoard = () => board;

  const playRound = (row, col) => {
    console.log(`Putting ${getActivePlayer().name} into Cell (${row}, ${col})`);
    board.putMark(row, col, getActivePlayer().mark);
    if (checkWinner()) {
      getActivePlayer().score++;
      getActivePlayer().win = true;
      return;
    }
    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    clearBoard,
    getBoard,
    getPlayers,
  };
}

function ScreenController(playerOne, playerTwo) {
  let game;
  console.log(playerOne);
  if (playerOne !== "" && playerTwo !== "") {
    game = GameController(playerOne, playerTwo);
  } else if (playerOne !== "") {
    game = GameController(playerOne, undefined);
  } else if (playerTwo !== "") {
    game = GameController(undefined, playerTwo);
  } else {
    game = GameController();
  }
  const infoDiv = document.querySelector(".info");
  const boardDiv = document.querySelector(".board");
  const ctrlBtn = document.querySelector(".btn");
  const player1 = game.getPlayers()[0];
  const player2 = game.getPlayers()[1];

  const updateScreen = () => {
    boardDiv.textContent = "";
    const currentBoard = game.getBoard().getActualBoard();
    const activePlayer = game.getActivePlayer();

    currentBoard.forEach((row, rowIndex) => {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");
      row.forEach((cell, colIndex) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");

        const char = document.createElement("div");
        char.dataset.row = rowIndex;
        char.dataset.col = colIndex;
        char.classList.add("char");
        if (char.textContent === "") {
          char.textContent = cell.getValue();
        }
        cellDiv.append(char);
        rowDiv.append(cellDiv);
      });
      boardDiv.append(rowDiv);
    });

    if (activePlayer.score === 3) {
      infoDiv.textContent = `${activePlayer.name} is the Grand Winner!!!`;
    } else if (activePlayer.win) {
      infoDiv.textContent = `${activePlayer.name} Win's!!!`;
      ctrlBtn.textContent = "Next Round";
    } else if (game.getBoard().isFull()) {
      infoDiv.textContent = `It's A Tie`;
      ctrlBtn.textContent = "Next Round";
    } else {
      infoDiv.textContent = `${activePlayer.name}'s turn...`;
    }
  };

  function resetGame() {
    game = GameController();
    updateScreen();
  }

  function clearGame() {
    game.getBoard().clearBoard();
    ctrlBtn.textContent = "Restart";
    player1.win = false;
    player2.win = false;
    updateScreen();
  }

  function clickHandlerBoard(e) {
    const cellRow = e.target.dataset.row;
    const cellCol = e.target.dataset.col;

    if (!cellRow && !cellCol) return;
    if (e.target.textContent) return;
    if (game.getPlayers()[0].win || game.getPlayers()[1].win) return;

    game.playRound(cellRow, cellCol);
    updateScreen();
  }

  function clickHandlerBtn() {
    if (
      (player1.win && player1.score === 3) ||
      (player2.win && player2.score === 3)
    ) {
      resetGame();
    } else if (player1.win || player2.win) {
      clearGame();
    } else if (game.getBoard().isFull()) {
      clearGame();
    } else {
      resetGame();
    }
  }
  updateScreen();

  boardDiv.addEventListener("click", clickHandlerBoard);
  ctrlBtn.addEventListener("click", clickHandlerBtn);
}

function MenuController() {
  const playerOne = document.querySelector("#playerOneInput");
  const playerTwo = document.querySelector("#playerTwoInput");
  const startBtn = document.querySelector(".start");
  const menu = document.querySelector(".menu");
  const game = document.querySelector(".game");

  function startGame() {
    menu.style.display = "none";
    game.style.display = "flex";
    ScreenController(playerOne.value, playerTwo.value);
  }

  startBtn.addEventListener("click", startGame);
}

MenuController();
