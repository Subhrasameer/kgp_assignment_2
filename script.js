let gameState = {
    currentPlayer: 'X',
    player1Name: 'Player 1',
    player2Name: 'Player 2',
    player1Score: 0,
    player2Score: 0,
    gameActive: true,
    currentBoardSize: 3,
    board: [],
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('single-player-button').addEventListener('click', () => showLoginSection('single'));
    document.getElementById('two-player-button').addEventListener('click', () => showLoginSection('two'));
    document.getElementById('start-single-game').addEventListener('click', startSinglePlayerGame);
    document.getElementById('start-two-game').addEventListener('click', startTwoPlayerGame);
    document.querySelector('.reset-button').addEventListener('click', showResetModal);
    document.getElementById('confirm-reset').addEventListener('click', resetGame);
    document.getElementById('cancel-reset').addEventListener('click', closeModal);
    document.querySelector('.reset-score-button').addEventListener('click', resetScore);
    document.getElementById('grid-size').addEventListener('change', updateGridSize);
});

function showLoginSection(mode) {
    document.querySelector('.mode-selection').style.display = 'none';
    if (mode === 'single') {
        document.querySelector('.login-section.single-player').style.display = 'block';
    } else {
        document.querySelector('.login-section.two-player').style.display = 'block';
    }
}

function startSinglePlayerGame() {
    gameState.player1Name = document.getElementById('player-name').value || 'Player 1';
    gameState.player2Name = 'Computer';
    gameState.currentPlayer = 'X';
    gameState.gameActive = true;
    document.querySelector('.login-section.single-player').style.display = 'none';
    document.querySelector('.game-section').style.display = 'block';
    initGameBoard();
}

function startTwoPlayerGame() {
    gameState.player1Name = document.getElementById('player1-name').value || 'Player 1';
    gameState.player2Name = document.getElementById('player2-name').value || 'Player 2';
    gameState.currentPlayer = 'X';
    gameState.gameActive = true;
    document.querySelector('.login-section.two-player').style.display = 'none';
    document.querySelector('.game-section').style.display = 'block';
    initGameBoard();
}

function initGameBoard() {
    const boardSize = gameState.currentBoardSize;
    gameState.board = Array(boardSize).fill().map(() => Array(boardSize).fill(''));
    const gameBoard = document.querySelector('.game-board');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-col', j);
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    if (!gameState.gameActive) return;
    const row = parseInt(event.target.getAttribute('data-row'));
    const col = parseInt(event.target.getAttribute('data-col'));
    
    if (gameState.board[row][col] !== '') return;

    gameState.board[row][col] = gameState.currentPlayer;
    event.target.textContent = gameState.currentPlayer;

    if (checkWin()) {
        updateStatus(`${gameState.currentPlayer} wins!`);
        updateScore();
        gameState.gameActive = false;
        return;
    }

    if (checkDraw()) {
        updateStatus(`It's a draw!`);
        gameState.gameActive = false;
        return;
    }

    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`It's ${gameState.currentPlayer}'s turn`);
}

function checkWin() {
    const board = gameState.board;
    const size = gameState.currentBoardSize;

    // Check rows, columns, and diagonals
    for (let i = 0; i < size; i++) {
        if (board[i].every(cell => cell === gameState.currentPlayer)) return true;
        if (board.every(row => row[i] === gameState.currentPlayer)) return true;
    }

    if (board.every((row, idx) => row[idx] === gameState.currentPlayer)) return true;
    if (board.every((row, idx) => row[size - 1 - idx] === gameState.currentPlayer)) return true;

    return false;
}

function checkDraw() {
    return gameState.board.flat().every(cell => cell !== '');
}

function updateStatus(message) {
    document.querySelector('.status').textContent = message;
}

function updateScore() {
    if (gameState.currentPlayer === 'X') {
        gameState.player1Score++;
        document.getElementById('player1-score').textContent = `${gameState.player1Name}: ${gameState.player1Score}`;
    } else {
        gameState.player2Score++;
        document.getElementById('player2-score').textContent = `${gameState.player2Name}: ${gameState.player2Score}`;
    }
}

function resetGame() {
    gameState.gameActive = true;
    gameState.currentPlayer = 'X';
    initGameBoard();
    updateStatus(`It's ${gameState.currentPlayer}'s turn`);
    closeModal();
}

function showResetModal() {
    document.querySelector('.modal').style.display = 'block';
}

function closeModal() {
    document.querySelector('.modal').style.display = 'none';
}

function resetScore() {
    gameState.player1Score = 0;
    gameState.player2Score = 0;
    document.getElementById('player1-score').textContent = `${gameState.player1Name}: 0`;
    document.getElementById('player2-score').textContent = `${gameState.player2Name}: 0`;
}

function updateGridSize() {
    const newSize = parseInt(document.getElementById('grid-size').value);
    gameState.currentBoardSize = newSize;
    resetGame();
}
