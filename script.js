document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');
    const statusDisplay = document.querySelector('.status');
    const resetButton = document.querySelector('.reset-button');
    const modal = document.querySelector('.modal');
    const confirmResetButton = document.getElementById('confirm-reset');
    const cancelResetButton = document.getElementById('cancel-reset');
    const singlePlayerButton = document.getElementById('single-player-button');
    const twoPlayerButton = document.getElementById('two-player-button');
    const startSingleGameButton = document.getElementById('start-single-game');
    const startTwoGameButton = document.getElementById('start-two-game');
    const playerNameInput = document.getElementById('player-name');
    const player1Input = document.getElementById('player1-name');
    const player2Input = document.getElementById('player2-name');
    const player1ScoreDisplay = document.getElementById('player1-score');
    const player2ScoreDisplay = document.getElementById('player2-score');
    const resetScoreButton = document.querySelector('.reset-score-button');
    const gridSizeSelector = document.getElementById('grid-size');
    const difficultyLevelSelector = document.getElementById('difficulty-level');

    let currentPlayer = 'X';
    let player1Name = 'Player 1';
    let player2Name = 'Player 2';
    let player1Score = 0;
    let player2Score = 0;
    let gameActive = true;
    let currentBoardSize = 3;
    let board = Array(currentBoardSize).fill().map(() => Array(currentBoardSize).fill(''));
    let moveTimeout;
    let gameCounter = 0;
    let isSinglePlayer = false;
    let difficultyLevel = 'easy';

    singlePlayerButton.addEventListener('click', () => {
        document.querySelector('.mode-selection').style.display = 'none';
        document.querySelector('.login-section.single-player').style.display = 'block';
    });

    twoPlayerButton.addEventListener('click', () => {
        document.querySelector('.mode-selection').style.display = 'none';
        document.querySelector('.login-section.two-player').style.display = 'block';
    });

    startSingleGameButton.addEventListener('click', startSinglePlayerGame);
    startTwoGameButton.addEventListener('click', startTwoPlayerGame);

    function startSinglePlayerGame() {
        player1Name = playerNameInput.value || 'Player 1';
        player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
        player2ScoreDisplay.style.display = 'none';
        difficultyLevel = difficultyLevelSelector.value;
        isSinglePlayer = true;
        document.querySelector('.login-section.single-player').style.display = 'none';
        document.querySelector('.game-section').style.display = 'block';
       initGame();
}

function startTwoPlayerGame() {
    player1Name = player1Input.value || 'Player 1';
    player2Name = player2Input.value || 'Player 2';
    player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
    player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;
    player2ScoreDisplay.style.display = 'block';
    isSinglePlayer = false;
    document.querySelector('.login-section.two-player').style.display = 'none';
    document.querySelector('.game-section').style.display = 'block';
    initGame();
}

gridSizeSelector.addEventListener('change', () => {
    currentBoardSize = parseInt(gridSizeSelector.value);
    initGame();
});

function handleCellClick(event) {
    if (!gameActive) return;

    const row = parseInt(event.target.getAttribute('data-row'));
    const col = parseInt(event.target.getAttribute('data-col'));

    if (board[row][col] !== '') return;

    board[row][col] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        statusDisplay.textContent = `${currentPlayer === 'X' ? player1Name : player2Name} Wins!`;
        alert(`${currentPlayer === 'X' ? player1Name : player2Name} Wins!`);
        updateScore(currentPlayer);
        gameActive = false;
        moveTimeout = setTimeout(resetGame, 5000);
        } else if (isBoardFull()) {
            statusDisplay.textContent = 'Game is a draw!';
            alert('Game is a draw!');
            gameActive = false;
            moveTimeout = setTimeout(resetGame, 5000);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatus();
            if (isSinglePlayer && currentPlayer === 'O') {
                setTimeout(makeAIMove, 1000);
            }
        }
    }

    function checkWin(player) {
        for (let i = 0; i < currentBoardSize; i++) {
            if (board[i].every(cell => cell === player)) return true;
            if (board.every(row => row[i] === player)) return true;
        }

        if (board.every((row, index) => row[index] === player)) return true;
        if (board.every((row, index) => row[currentBoardSize - index - 1] === player)) return true;

        return false;
    }

    function isBoardFull() {
        return board.every(row => row.every(cell => cell !== ''));
    }

    function resetGame() {
        clearTimeout(moveTimeout);
        gameCounter++;
        currentPlayer = gameCounter % 2 === 0 ? 'X' : 'O';

        board = Array(currentBoardSize).fill().map(() => Array(currentBoardSize).fill(''));
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${currentBoardSize}, 100px)`;
        gameBoard.style.gridTemplateRows = `repeat(${currentBoardSize}, 100px)`;

        for (let i = 0; i < currentBoardSize; i++) {
            for (let j = 0; j < currentBoardSize; j++) {
                const cell = document.createElement('div');
                cell.setAttribute('data-row', i);
                cell.setAttribute('data-col', j);
                cell.addEventListener('click', handleCellClick);
                gameBoard.appendChild(cell);
            }
        }

        gameActive = true;
        updateStatus();
    }

    function updateStatus() {
        statusDisplay.textContent = `${currentPlayer === 'X' ? player1Name : player2Name}'s turn`;
    }

    function updateScore(player) {
        if (player === 'X') {
            player1Score++;
        } else {
            player2Score++;
        }
        player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
        if (!isSinglePlayer) {
            player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;
        }
        highlightLeadingPlayer();
    }

    function highlightLeadingPlayer() {
        if (player1Score > player2Score) {
            player1ScoreDisplay.classList.add('leading');
            player2ScoreDisplay.classList.remove('leading');
        } else if (player2Score > player1Score) {
            player2ScoreDisplay.classList.add('leading');
            player1ScoreDisplay.classList.remove('leading');
        } else {
            player1ScoreDisplay.classList.remove('leading');
            player2ScoreDisplay.classList.remove('leading');
        }
    }

    function makeAIMove() {
        let row, col;

        if (difficultyLevel === 'easy') {
            [row, col] = getRandomMove();
        } else if (difficultyLevel === 'medium') {
            [row, col] = getMediumMove();
        } else {
            [row, col] = getHardMove();
        }

        board[row][col] = 'O';
        const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
        cell.textContent = 'O';

        if (checkWin('O')) {
            statusDisplay.textContent = `${player2Name} Wins!`;
            alert(`${player2Name} Wins!`);
            updateScore('O');
            gameActive = false;
            moveTimeout = setTimeout(resetGame, 5000);
        } else if (isBoardFull()) {
            statusDisplay.textContent = 'Game is a draw!';
            alert('Game is a draw!');
            gameActive = false;
            moveTimeout = setTimeout(resetGame, 5000);
        } else {
            currentPlayer = 'X';
            updateStatus();
        }
    }

    function getRandomMove() {
        const emptyCells = [];
        for (let i = 0; i < currentBoardSize; i++) {
            for (let j = 0; j < currentBoardSize; j++) {
                if (board[i][j] === '') {
                    emptyCells.push([i, j]);
                }
            }
        }
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    function getMediumMove() {
        if (board[Math.floor(currentBoardSize / 2)][Math.floor(currentBoardSize / 2)] === '') {
            return [Math.floor(currentBoardSize / 2), Math.floor(currentBoardSize / 2)];
        }
        const corners = [
            [0, 0], [0, currentBoardSize - 1],
            [currentBoardSize - 1, 0], [currentBoardSize - 1, currentBoardSize - 1]
        ];
        for (const [r, c] of corners) {
            if (board[r][c] === '') {
                return [r, c];
            }
        }
        return getRandomMove();
    }

    function getHardMove() {
        const winningMove = findWinningMove('O');
        if (winningMove) return winningMove;
        const blockingMove = findWinningMove('X');
        if (blockingMove) return blockingMove;
        return getMediumMove();
    }

    function findWinningMove(player) {
        for (let i = 0; i < currentBoardSize; i++) {
            for (let j = 0; j < currentBoardSize; j++) {
                if (board[i][j] === '') {
                    board[i][j] = player;
                    if (checkWin(player)) {
                        board[i][j] = '';
                        return [i, j];
                    }
                    board[i][j] = '';
                }
            }
        }
        return null;
    }

    resetButton.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    confirmResetButton.addEventListener('click', () => {
        modal.style.display = 'none';
        resetGame();
    });

    cancelResetButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    resetScoreButton.addEventListener('click', () => {
        player1Score = 0;
        player2Score = 0;
        player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
        if (!isSinglePlayer) {
            player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;
        }
        highlightLeadingPlayer();
        document.querySelector('.login-section').style.display = 'block';
        document.querySelector('.game-section').style.display = 'none';
    });

    function initGame() {
        gameCounter++;
        currentPlayer = gameCounter % 2 === 0 ? 'X' : 'O';
        board = Array(currentBoardSize).fill().map(() => Array(currentBoardSize).fill(''));
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${currentBoardSize}, 100px)`;
        gameBoard.style.gridTemplateRows = `repeat(${currentBoardSize}, 100px)`;

        for (let i = 0; i < currentBoardSize; i++) {
            for (let j = 0; j < currentBoardSize; j++) {
                const cell = document.createElement('div');
                cell.setAttribute('data-row', i);
                cell.setAttribute('data-col', j);
                cell.addEventListener('click', handleCellClick);
                gameBoard.appendChild(cell);
            }
        }

        gameActive = true;
        updateStatus();
    }
});

