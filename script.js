const boardEl = document.getElementById("board");
const popup = document.getElementById("popup");
const winnerMsg = document.getElementById("winnerMsg");
const boardSizeSelect = document.getElementById("boardSize");
const modeSelect = document.getElementById("mode");
const difficultySelect = document.getElementById("difficulty");
const restartBtn = document.getElementById("restart");
const playerXScoreEl = document.getElementById("playerXScore");
const playerOScoreEl = document.getElementById("playerOScore");

let board = [];
let currentPlayer = "X";
let gameActive = true;
let scores = { X: 0, O: 0 };

function createBoard(size) {
  board = Array(size)
    .fill(null)
    .map(() => Array(size).fill(""));
  boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  boardEl.innerHTML = "";

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", () => makeMove(row, col));
      boardEl.appendChild(cell);
    }
  }
}

function makeMove(row, col) {
  if (!gameActive || board[row][col] !== "") return;
  board[row][col] = currentPlayer;
  const cellEl = boardEl.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
  cellEl.textContent = currentPlayer;
  cellEl.classList.add(currentPlayer === "X" ? "x" : "o", "animate");

  if (checkWinner(currentPlayer)) {
    endGame(currentPlayer);
    return;
  }

  if (board.flat().every(cell => cell !== "")) {
    endGame("draw");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (modeSelect.value === "ai" && currentPlayer === "O") {
    setTimeout(aiMove, 400);
  }
}

function aiMove() {
  const difficulty = difficultySelect.value;
  let move;

  if (difficulty === "easy") {
    move = randomMove();
  } else if (difficulty === "medium") {
    move = randomMove(0.5) || randomMove();
  } else {
    move = bestMove();
  }

  if (move) makeMove(move.row, move.col);
}

function randomMove(prob = 1) {
  if (Math.random() > prob) return null;
  const empty = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      if (board[r][c] === "") empty.push({ row: r, col: c });
    }
  }
  return empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
}

function bestMove() {
  const empty = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      if (board[r][c] === "") empty.push({ row: r, col: c });
    }
  }
  return empty[Math.floor(Math.random() * empty.length)];
}

function checkWinner(player) {
  const size = board.length;
  for (let i = 0; i < size; i++) {
    if (board[i].every(cell => cell === player)) return true;
    if (board.map(row => row[i]).every(cell => cell === player)) return true;
  }
  if (board.map((r, i) => r[i]).every(cell => cell === player)) return true;
  if (board.map((r, i) => r[size - 1 - i]).every(cell => cell === player)) return true;
  return false;
}

function endGame(result) {
  gameActive = false;
  if (result === "draw") {
    winnerMsg.textContent = "It's a Draw!";
  } else {
    winnerMsg.textContent = `${result} Wins!`;
    scores[result]++;
    updateScoreboard();
  }
  popup.style.display = "block";
}

function updateScoreboard() {
  playerXScoreEl.textContent = `X: ${scores.X}`;
  playerOScoreEl.textContent = `O: ${scores.O}`;
}

function closePopup() {
  popup.style.display = "none";
  resetBoard();
}

function resetBoard() {
  gameActive = true;
  currentPlayer = "X";
  createBoard(Number(boardSizeSelect.value));
}

restartBtn.addEventListener("click", resetBoard);
boardSizeSelect.addEventListener("change", resetBoard);
modeSelect.addEventListener("change", resetBoard);
difficultySelect.addEventListener("change", resetBoard);

createBoard(3);
