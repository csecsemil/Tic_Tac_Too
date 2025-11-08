// dom elemek lekerese
const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const closeModalButton = document.getElementById('modal-close-button');

//jatek allapota
let gameActive = true;
let currentPlayer = 'X';
//A tábla 9 mezője, a tárolt értékek: '', 'X', vagy 'O'
let gameState = ['', '', '', '', '', '', '', '', ''];

// győzelmi kombinációk
const winningCondition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

//uzenet a jatekosoknak
const winningMessage = (player) => `Játékos ${player} nyert!`;
const drawMessage = `Döntetlen!`;
const currentPlayerTurn = (player) => `Játékos ${player} következik`;

//kezdeti allapot
statusDisplay.innerHTML = currentPlayerTurn(currentPlayer);

/** 
 * Kezeli a cellára kattintás eseményét.
 * @param {Event} clickedCellEvent - A kattintási esemény
 */
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // Ellenőrzi, hogy a játék aktív-e, és hogy a cella már foglalt-e
    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    //a lepes feldolgozo funkció hívása
    handleMove(clickedCell, clickedCellIndex);
    //elenorzi a jatek kimenetelet
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
        const winCondition = winningConditions[i];
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
    currentPlayer = currentPlayer = currentPlayer === 'X' ? 'O' : 'x';
    statusDisplay.innerHTML = currentPlayerTurn(currentPlayer);
}

//visszaállítja a játékot kezdeti állapotba
function handleRestartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', '',];ű
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
modalCloseButton.addEventListener('click', handleRestartGame);

