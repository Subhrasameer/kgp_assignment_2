document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('loginSection');
    const loginForm = document.getElementById('loginForm');
    const gameSection = document.getElementById('gameSection');
    const gameBoard = document.getElementById('gameBoard');
    const currentPlayerElement = document.getElementById('currentPlayer');
    const resetButton = document.getElementById('resetButton');
    const resetModal = document.getElementById('resetModal');
    const confirmResetButton = document.getElementById('confirmReset');
    const cancelResetButton = document.getElementById('cancelReset');
    const resetScoresButton = document.getElementById('resetScoresButton');
    const player1ScoreElement = document.getElementById('player1Score');
    const player2ScoreElement = document.getElementById('player2Score');
    const player1NameElement = document.getElementById('player1Name');
    const player2NameElement = document.getElementById('player2Name');
    const player1NameInput = document.getElementById('player1NameInput');
    const player2NameInput = document.getElementById('player2NameInput');
    const boardSizeSelect = document.getElementById('boardSize');

    let currentPlayer = 'X';
    let board = [];
    let boardSize = 3;
    let player1Score = 0;
    let player2Score = 0;
    let gameCount = 0;

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        player1NameElement.innerText = player1NameInput.value;
        player2NameElement.innerText = player2NameInput.value;
        loginSection.classList.add('hidden');
        gameSection.classList.remove('hidden');
        resetBoard();
    });

    resetButton.addEventListener('click', () => {
        resetModal.style.display = 'flex';
    });

    confirmResetButton.addEventListener('click', () => {
        resetModal.style.display = 'none';
        resetBoard();
    });

    cancelResetButton.addEventListener('click', () => {
        resetModal.style.display = 'none';
    });

    resetScoresButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the scores?')) {
            player1Score = 0;
            player2Score = 0;
            updateScores();
            alert('Please re-enter player names.');
            loginSection.classList.remove('hidden');
            gameSection.classList.add('hidden');
        }
    });
    
    boardSizeSelect.addEventListener('change', () => {
        boardSize = parseInt(boardSizeSelect.value);
        resetBoard();
    });
    
    function resetBoard() {
        board = Array(boardSize).fill().map(() => Array(boardSize).fill(''));
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 100px)`;
        gameBoard.style.gridTemplateRows = `repeat(${boardSize}, 100px)`;
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement('div');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', handleCellClick);
                gameBoard.appendChild(cell);
            }
        }
    }
    
    function handleCellClick(event) {
        const row = event.target.dataset.row;
        const col = event.target.dataset.col;
        if (!board[row][col]) {
            board[row][col] = currentPlayer;
            event.target.innerText = currentPlayer;
            if (checkWin(row, col)) {
                updateScores();
                setTimeout(() => {
                    alert(`${currentPlayer} wins!`);
                    resetBoard();
                }, 1000);
            } else if (checkTie()) {
                setTimeout(() => {
                    alert('It\'s a tie!');
                    resetBoard();
                }, 1000);
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                currentPlayerElement.innerText = currentPlayer;
            }
        }
    }
    
    function checkWin(row, col) {
        row = parseInt(row);
        col = parseInt(col);
        const symbol = board[row][col];
        let win = true;
    
        // Check row
        for (let i = 0; i < boardSize; i++) {
            if (board[row][i] !== symbol) {
                win = false;
                break;
            }
        }
        if (win) return true;
    
        // Check column
        win = true;
        for (let i = 0; i < boardSize; i++) {
            if (board[i][col] !== symbol) {
                win = false;
                break;
            }
        }
        if (win) return true;
    
        // Check diagonal
        win = true;
        if (row === col) {
            for (let i = 0; i < boardSize; i++) {
                if (board[i][i] !== symbol) {
                    win = false;
                    break;
                }
            }
        } else {
            win = false;
        }
        if (win) return true;
    
        // Check anti-diagonal
        win = true;
        if (row + col === boardSize - 1) {
            for (let i = 0; i < boardSize; i++) {
                if (board[i][boardSize - i - 1] !== symbol) {
                    win = false;
                    break;
                }
            }
        } else {
            win = false;
        }
        return win;
    }
    
    function checkTie() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (!board[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
    
    function updateScores() {
        if (currentPlayer === 'X') {
            player1Score++;
        } else {
            player2Score++;
        }
        player1ScoreElement.innerText = player1Score;
        player2ScoreElement.innerText = player2Score;
        localStorage.setItem('player1Score', player1Score);
        localStorage.setItem('player2Score', player2Score);
    }
    
    function loadScores() {
        player1Score = parseInt(localStorage.getItem('player1Score')) || 0;
        player2Score = parseInt(localStorage.getItem('player2Score')) || 0;
        player1ScoreElement.innerText = player1Score;
        player2ScoreElement.innerText = player2Score;
    }
    
    function toggleSymbols() {
        gameCount++;
        if (gameCount % 2 === 0) {
            currentPlayer = 'X';
        } else {
            currentPlayer = 'O';
        }
        currentPlayerElement.innerText = currentPlayer;
    }
    
    loadScores();
    toggleSymbols();
});    