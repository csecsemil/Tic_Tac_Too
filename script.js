// dom elemek lekerese
const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const closeModalButton = document.getElementById('modal-close-button');
const mode2pButton = document.getElementById('mode-2p');
const mode3pButton = document.getElementById('mode-3p');


//jatek allapota
let gameActive = true;
let currentPlayer = 'X';
//A tábla 9 mezője, a tárolt értékek: '', 'X', vagy 'O'
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameMode = '2P';
let boardSize = 3;


//uzenet a jatekosoknak
const players2P = ['X', 'O'];
const players3P = ['X', 'O', 'Z'];
const winningMessage = (player) => `Játékos ${player} nyert!`;
const drawMessage = `Döntetlen!`;
const currentPlayerTurn = (player) => `Játékos ${player} következik`;



/**
* Létrehozza a játéktáblát (5x5 vagy 3x3)
*/
function createGameBoard() {
    gameBoard.innerHTML = '';

    //beallitja a grid meretet
    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

    gameBoard.classList.remove('board-3x3', 'board-5x5');
    gameBoard.classList.add(`board-${boardSize}x${boardSize}`);

    const totalCells = boardSize * boardSize;
    gameState = Array(totalCells).fill('');

    //letrehozza a cellakat
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);
    }
}

/*valt a kovetkezo jatekosra a jelenlegi modban*/
function handlePlayerChange() {
    const currentPlayers = gameMode === '2P' ? players2P : players3P;
    const currentIndex = currentPlayers.indexOf(currentPlayer);

    const nextIndex = (currentIndex + 1) % currentPlayers.length;
    currentPlayer = currentPlayers[nextIndex];

    statusDisplay.innerHTML = currentPlayerTurn(currentPlayer);
}


/** 
 * Kezeli a cellára kattintás eseményét.
 */
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // Ellenőrzi, hogy a játék aktív-e, és hogy a cella már foglalt-e
    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    //a lepes vegrehajtasa
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add('filled', currentPlayer);

    handleResultValidation();
}

/**
* Végrehajtja a lépést: frissíti a belső állapotot és a vizuális megjelenítést.
* @param {HTMLElement} clickedCell - A kattintott DOM elem
* @param {number} clickedCellIndex - A kattintott cella indexe
*/
function handleMove(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add('filled', currentPlayer);
}

// Ellenőrzi a játék eredményét
function handleResultValidation() {
    let roundWon = false;
    let winningCombo = [];

    //vegig megy a nyero kombinacion
    for (let i = 0; i < winningCondition.length; i++) {
        const winCondition = winningCondition[i]; 
        // lekeri a 3 cella erteket
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        
        

        //ha valamelyik ures akkor meg nincs nyertes ezen a vonalon
        if (a === '' || b === '' || c === '') {
            continue; 
        }
        //Ha a 3 ertek megeggyezik, van egy nyertes
        if (a === b && b === c) {
            roundWon = true;
            winningCombo = winCondition;
            break;
        }
    }

    if (roundWon) {
        gameActive = false; // leallitjaajatekot
        statusDisplay.innerHTML = winningMessage(currentPlayer);

        //kiemelt a nyero vonalat
        winningCombo.forEach(index => {
            cells[index].classList.add('winning-cell');
        });

        //megjeleniti a modalt (popup) a gyoztes uzenettel
        showModal(winningMessage(currentPlayer));
        return;
    }

    //elenorzi a dontetlent
    let roundDraw = !gameState.includes('');
    if (roundDraw) {
        gameActive = false;
        statusDisplay.innerHTML = drawMessage;
        //megjeleniti a modalt a dontetlen uzenettel
        showModal(drawMessage);
        return;
    }

    //valt a kovetkezo jatekosra 
    handlePlayerChange();
}

//Vált a következő játékosra x o
function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = currentPlayerTurn(currentPlayer);
}

//visszaállítja a játékot kezdeti állapotba
function handleRestartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', '']; 
    statusDisplay.innerHTML = currentPlayerTurn(currentPlayer);

    //Vissza allitje az osszes cella vizuális allapotat
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('filled', 'X', 'O', 'winning-cell');
    });
    hideModal();
}

/**
* Megjeleníti az üzenetdobozt (modal).
* @param {string} message - A modálban megjelenítendő üzenet
*/
function showModal(message) {
    modalMessage.innerHTML = message;
    modal.classList.remove('hidden');
}

//elrejti az uzenet doboz modalt
function hideModal() {
    modal.classList.add('hidden')
}

//esemenyfigyelok

//hozza adja a katt figyelot minden cellára
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

//ujrainditas gomb figyelo
resetButton.addEventListener('click', handleRestartGame);

//modal bezaro gomb
closeModalButton.addEventListener('click', handleRestartGame); 
