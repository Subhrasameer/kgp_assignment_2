document.addEventListener('DOMContentLoaded', () => {
    const singlePlayerBtn = document.getElementById('singlePlayerBtn');
    const twoPlayerBtn = document.getElementById('twoPlayerBtn');
    const singlePlayerForm = document.getElementById('singlePlayerForm');
    const twoPlayerForm = document.getElementById('twoPlayerForm');
    const startSinglePlayerBtn = document.getElementById('startSinglePlayerBtn');
    const startTwoPlayerBtn = document.getElementById('startTwoPlayerBtn');
    const playerNameInput = document.getElementById('playerName');
    const player1NameInput = document.getElementById('player1Name');
    const player2NameInput = document.getElementById('player2Name');
    const difficultySelect = document.getElementById('difficulty');
    const gameSection = document.querySelector('.game-section');
    const statusDisplay = document.getElementById('statusDisplay');
    const gameBoard = document.getElementById('gameBoard');
    const player1ScoreDisplay = document.getElementById('player1Score');
    const player2ScoreDisplay = document.getElementById('player2Score');
    const resetGameBtn = document.getElementById('resetGameBtn');
    const resetScoreBtn = document.getElementById('resetScoreBtn');
    const resetModal = document.getElementById('resetModal');
    const confirmResetBtn = document.getElementById('confirmResetBtn');
    const cancelResetBtn = document.getElementById('cancelResetBtn');

    let isSinglePlayer = false;
    let currentPlayer = 'X';
    let gameActive = true;
    let player1Name = 'Player 1';
    let player2Name = 'Player 2';
    let player1Score = parseInt(localStorage.getItem('player1Score')) || 0;
    let player2Score = parseInt(localStorage.getItem('player2Score')) || 0;
    let gridSize = 3;
    let board = [];

    const updateScore = (player) => {
        if (player === 'X') {
            player1Score++;
            localStorage.setItem('player1Score', player1Score);
        } else {
            player2Score++;
            localStorage.setItem('player2Score', player2Score);
        }
        player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
        if (!isSinglePlayer) {
            player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;
        }
        highlightLeadingPlayer();
    };

    const highlightLeadingPlayer = () => {
        if (player1Score > player2Score) {
            player1ScoreDisplay.classList.add('leading');
            player2ScoreDisplay.classList.remove('leading');
        } else if (player2Score > player1Score) {
            player2ScoreDisplay.classList.add('leading');
            player1ScoreDisplay.classList.remove('leading');
        } else {
            player1ScoreDisplay.classList.remove('leading');
            player2ScoreDisplay.classList.remove('leading');
            player1ScoreDisplay.classList.remove('leading');
            player2ScoreDisplay.classList.remove('leading');
        }
    };

    const initializeBoard = () => {
        board = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
        gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;
        gameBoard.innerHTML = '';
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const cell = document.createElement('div');
                cell.addEventListener('click', () => handleCellClick(i, j));
                gameBoard.appendChild(cell);
            }
        }
        updateStatus();
    };

    const handleCellClick = (row, col) => {
        if (!gameActive || board[row][col] !== '') return;

        board[row][col] = currentPlayer;
        document.querySelector(`.game-board div:nth-child(${row * gridSize + col + 1})`).textContent = currentPlayer;

        if (checkWin(currentPlayer)) {
            statusDisplay.textContent = `${currentPlayer} wins!`;
            updateScore(currentPlayer);
            gameActive = false;
            setTimeout(resetBoard, 5000);
        } else if (isBoardFull()) {
            statusDisplay.textContent = 'It\'s a tie!';
            setTimeout(resetBoard, 5000);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatus();
            if (isSinglePlayer && currentPlayer === 'O') {
                makeComputerMove();
            }
        }
    };

    const updateStatus = () => {
        statusDisplay.textContent = `${currentPlayer}'s turn`;
    };

    const isBoardFull = () => {
        return board.every(row => row.every(cell => cell !== ''));
    };

    const checkWin = (player) => {
        const winCondition = Array(gridSize).fill(player).join('');
        
        // Check rows
        for (let i = 0; i < gridSize; i++) {
            if (board[i].join('') === winCondition) return true;
        }
        
        // Check columns
        for (let i = 0; i < gridSize; i++) {
            if (board.map(row => row[i]).join('') === winCondition) return true;
        }
        
        // Check diagonals
        if (board.map((row, i) => row[i]).join('') === winCondition) return true;
        if (board.map((row, i) => row[gridSize - i - 1]).join('') === winCondition) return true;
        
        return false;
    };

    const resetBoard = () => {
        gameActive = true;
        currentPlayer = 'X';
        initializeBoard();
    };

    const makeComputerMove = () => {
        let moveMade = false;
        const difficulty = difficultySelect.value;

        if (difficulty === 'easy') {
            // Make a random move
            while (!moveMade) {
                const row = Math.floor(Math.random() * gridSize);
                const col = Math.floor(Math.random() * gridSize);
                if (board[row][col] === '') {
                    handleCellClick(row, col);
                    moveMade = true;
                }
            }
        } else if (difficulty === 'medium') {
            // Medium AI logic can be added here
        } else if (difficulty === 'hard') {
            // Hard AI logic can be added here
        }
    };

    // Event Listeners
    singlePlayerBtn.addEventListener('click', () => {
        singlePlayerForm.style.display = 'block';
        twoPlayerForm.style.display = 'none';
    });

    twoPlayerBtn.addEventListener('click', () => {
        twoPlayerForm.style.display = 'block';
        singlePlayerForm.style.display = 'none';
    });

    startSinglePlayerBtn.addEventListener('click', () => {
        player1Name = playerNameInput.value || 'Player 1';
        player2Name = 'Computer';
        isSinglePlayer = true;
        initializeGame();
    });

    startTwoPlayerBtn.addEventListener('click', () => {
        player1Name = player1NameInput.value || 'Player 1';
        player2Name = player2NameInput.value || 'Player 2';
        isSinglePlayer = false;
        initializeGame();
    });

    const initializeGame = () => {
        document.querySelector('.login-section').style.display = 'none';
        gameSection.style.display = 'block';
        player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
        player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;
        highlightLeadingPlayer();
        resetBoard();
    };

    resetGameBtn.addEventListener('click', () => {
        resetModal.style.display = 'flex';
    });

    confirmResetBtn.addEventListener('click', () => {
        resetBoard();
        resetModal.style.display = 'none';
    });

    cancelResetBtn.addEventListener('click', () => {
        resetModal.style.display = 'none';
    });

    resetScoreBtn.addEventListener('click', () => {
        player1Score = 0;
        player2Score = 0;
        localStorage.setItem('player1Score', player1Score);
        localStorage.setItem('player2Score', player2Score);
        player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
        if (!isSinglePlayer) {
            player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;
        }
        highlightLeadingPlayer();
        document.querySelector('.login-section').style.display = 'block';
        document.querySelector('.game-section').style.display = 'none';
    });

    // Initialize game board
    initializeBoard();
    updateStatus();
});
