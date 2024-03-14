let gameboard = document.querySelector(".game-board");
const result = document.getElementById("Result");
const quit = document.getElementById("quit");
const restart = document.getElementById("restart");

quit.addEventListener("click", () => {
    console.log("quit has been clicked")
})

const Player = function(name, marker) {
    const playerName = name;
    let turn = false;
    let playerMarker = marker;
    const moves = [];
    return {playerName, turn, playerMarker, moves}
}
boardState = {
    boardFilled: [],
    winningCombo: [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]]
}

const Player1 = Player("Player 1", 'X');
const Player2 = Player("Player 2", 'O');
Player1.turn = true;