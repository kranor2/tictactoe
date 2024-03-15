import players from "./players.js";
import Cell from "./cells.js";

function Gameboard() {
    const board = [];
    const getBoard = () => board;
    const getBoardWithValues = () => board.map((row) => row.map((cell) => cell.getValue()));

    for (let i = 0; i < 3; i++) {
        let row = [];
        for (let j = 0; j < 3; j++) {
            row.push(Cell());
        }
        board.push(row);
    }

    const addMove = function(row, column, marker) {
        if (board[row][column].getValue()) {
            return 0;
        }
        board[row][column].changeValue(marker);
        return 1;
    }

    const boardReset = function() {
        board.forEach((row) => {
            row.forEach((cell) => {
                cell.changeValue(null);
            });
        });
    }

    return {getBoard, addMove, getBoardWithValues, boardReset}
}    

function Game() {
    const board = Gameboard()
    let result = null;

    const gameReset = function() {
        result = null;
        board.boardReset();
        changeTurn();
    }

    const getResult = () => result;

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const changeTurn = () => {
        activePlayer = activePlayer === players[0] ? players [1] : players[0];
    }

    const checkForWinner = () => {
        const boardWithValues = board.getBoardWithValues();

        for (let i = 0; i < 3; i++) {
            if (boardWithValues[i][0] === activePlayer.marker &&
                boardWithValues[i][1] === activePlayer.marker &&
                boardWithValues[i][2] === activePlayer.marker
                ) {
                    return true;
                }
        }

        for (let i = 0; i < 3; i++) {
            if (boardWithValues[0][i] === activePlayer.marker &&
                boardWithValues[1][i] === activePlayer.marker &&
                boardWithValues[2][i] === activePlayer.marker
                ) {
                    return true;
                }
        }
            
        if (
            (
                boardWithValues[0][0] === activePlayer.marker &&
                boardWithValues[1][1] === activePlayer.marker &&
                 boardWithValues[2][2] === activePlayer.marker
                ) || (
                boardWithValues[0][2] === activePlayer.marker &&
                boardWithValues[1][1] === activePlayer.marker &&
                boardWithValues[2][0] === activePlayer.marker
                )
            ) {
                return true;
            }
        }

    const checkforTie = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!board.getBoardWithValues()[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    const playRound = function(row, column) {
        if(!board.addMove(row, column, activePlayer.marker)) {
            return;
        }

        if (checkForWinner()) {
            result = `${getActivePlayer().name} has won the game!`;
            return;
        } else if (checkforTie()) {
            result = "Tie";
            return;
        } else {
            changeTurn();
        }
    }

    return {
        playRound,
        getBoard: board.getBoard,
        getActivePlayer,
        getResult,
        gameReset,
    }
}

function ScreenController() {
    const game = Game();
    let board = null;
    let turn = null;
    const container = document.querySelector(".player-menu");
        
    const cellClickHandler = function(event) {
        const cell = event.target;
        game.playRound(cell.dataset.row, cell.dataset.col);
        renderBoard();
        if (game.getResult()) {
            handleGameOver();
        }
    }

    const handleGameOver = function() {
        resetEventListeners();
        renderGameOverScreen(game.getResult());
    }

    const resetEventListeners = function() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.removeEventListener("click", cellClickHandler);
        });
    }

    const renderBoard = function() {
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        }

        turn.textContent = `${game.getActivePlayer().name}'s turn.`;

        for(let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cellBtn = document.createElement("button");
                cellBtn.dataset.row = i;
                cellBtn.dataset.col = j;
                cellBtn.classList.add("cell");

                cellBtn.textContent = game.getBoard()[i][j].getValue();
                board.appendChild(cellBtn);
            }
        }

        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.addEventListener("click", cellClickHandler);
        });
    }
        
    const renderGameOverScreen = function(result) {
        const gameScreen = document.querySelector("player-menu");
        gameScreen.classList.add("faded");

        const gameOverScreen = document.querySelector(".game-over-modal");
        gameOverScreen.classList.remove("hidden");

        gameOverScreen.textContent = "";

        const gameOverText = document.createElement("div");
        gameOverText.classList.add("game-over");
        gameOverText.textContent = result;

        const playAgainBtn = document.createElement("button");
        playAgainBtn.textContent = "Play Again";
        playAgainBtn.classList.add("play-again-btn");

        gameOverScreen.appendChild(gameOverText);
        gameOverScreen.appendChild(playAgainBtn);

        const handlePlayAgain = function() {
            gameOverScreen.classList.add("hidden");
            gameScreen.classList.remove("faded");

            game.resetGame()
            renderBoard();
        }

        playAgainBtn.addEventListener("click", handlePlayAgain);
    }

    const getPlayerNames = function() {
        const player1 = document.querySelector("#player1").value;
        const player2 = document.querySelector("#player2").value;

        players[0].name = player1;
        players[1].name = player2;
    }

    const renderGameScreen = function() {
        container.textContent = "";

        board = document.createElement("div");
        turn = document.createElement("div");

        board.classList.add("gameBoard");
        turn.classList.add("playTurn");

        container.appendChild(board);
        container.appendChild(turn);
    }

    const startGame = function() {
        renderGameScreen();
        renderBoard();
    }

    const startBtn = document.querySelector(".start");
    startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        getPlayerNames();
        startGame();
    });
}

ScreenController();