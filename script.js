document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');
    const statusDisplay = document.querySelector('.status');
    const resetButton = document.querySelector('.reset-button');
    const modal = document.querySelector('.modal');
    const confirmResetButton = document.getElementById('confirm-reset');
    const cancelResetButton = document.getElementById('cancel-reset');
    const startGameButton = document.getElementById('start-game');
    const player1Input = document.getElementById('player1-name');
    const player2Input = document.getElementById('player2-name');
    const player1ScoreDisplay = document.getElementById('player1-score');
    const player2ScoreDisplay = document.getElementById('player2-score');
    const resetScoreButton = document.querySelector('.reset-score-button');

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

    startGameButton.addEventListener('click', startGame);

    function startGame() {
        player1Name = player1Input.value || 'Player 1';
        player2Name = player2Input.value || 'Player 2';
        player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
        player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;
        document.querySelector('.login-section').style.display = 'none';
        document.querySelector('.game-section').style.display = 'block';
        resetGame();
    }

    function handleCellClick(event) {
        if (!gameActive) return;

        const row = event.target.getAttribute('data-row');
        const col = event.target.getAttribute('data-col');

        if (board[row][col] !== '') return;

        board[row][col] = currentPlayer;
        event.target.textContent = currentPlayer;

        if (checkWin(currentPlayer)) {
            gameActive = false;
            updateScore(currentPlayer);
            displayAlert(`${currentPlayer === 'X' ? player1Name : player2Name} wins!`);
            moveTimeout = setTimeout(resetGame, 5000);
        } else if (isBoardFull()) {
            displayAlert('It\'s a tie!');
            moveTimeout = setTimeout(resetGame, 5000);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatus();
        }
    }

    function checkWin(player) {
        const size = currentBoardSize;

        // Check rows and columns
        for (let i = 0; i < size; i++) {
            if (board[i].every(cell => cell === player) || board.every(row => row[i] === player)) {
                return true;
            }
        }

        // Check diagonals
        if (board.every((row, index) => row[index] === player) || board.every((row, index) => row[size - 1 - index] === player)) {
            return true;
        }

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
        player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;
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
        player1Name = 'Player 1';
        player2Name = 'Player 2';
        player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
        player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;
        highlightLeadingPlayer();
        document.querySelector('.login-section').style.display = 'block';
        document.querySelector('.game-section').style.display = 'none';
    });

    function displayAlert(message) {
        const alertBox = document.createElement('div');
        alertBox.classList.add('alert');
        alertBox.textContent = message;
        document.body.appendChild(alertBox);
        setTimeout(() => {
            alertBox.remove();
        }, 3000);
    }
});
