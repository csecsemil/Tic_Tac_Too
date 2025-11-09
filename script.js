// dom elemek lekerese
const statusDisplay = document.getElementById('status');
const gameBoard = document.getElementById('game-board'); // HOZZÁADVA
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
let gameState = [];//jatek allapota tomb
let gameMode = '2P'; //Aktualis jatek mod (2 jatekos vagy 3 jatekos)
let boardSize = 3;//tabla merete
const winConditionLength = 3; //Hany szimbólum kell a győzelemhez


//uzenet a jatekosoknak
const players2P = ['X', 'O'];
const players3P = ['X', 'O', 'Z'];
const winningMessage = (player) => `Player ${player} won!`;
const drawMessage = `Draw!`;
const currentPlayerTurn = (player) => `Pleyer ${player} 's turn`;



/**
* Létrehozza a játéktáblát (5x5 vagy 3x3)
*/
function createGameBoard() {
    gameBoard.innerHTML = '';

    //beallitja a grid meretet
    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

    //
    gameBoard.classList.remove('board-3x3', 'board-5x5');
    gameBoard.classList.add(`board-${boardSize}x${boardSize}`);

    const totalCells = boardSize * boardSize;
    gameState = Array(totalCells).fill('');

    //letrehozza a cellakat
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell'); //hozzaadja a cella stilusat
        cell.setAttribute('data-index', i); //elmenti az indexet a cellan
        cell.addEventListener('click', handleCellClick);//esemenyfigyelo hozzaadasa
        gameBoard.appendChild(cell);//hozzaadja a jatektablahoz a cellat
    }
}

/*valt a kovetkezo jatekosra a jelenlegi modban*/
function handlePlayerChange() {
    //megkeresi a megfelelo jatekos listat
    const currentPlayers = gameMode === '2P' ? players2P : players3P;
    const currentIndex = currentPlayers.indexOf(currentPlayer);//aktualis jatekos indexe

    //kiszamitja a kovetkezo jatekos indexet (korberforgoan: 0, 1, 2, 0, ...)
    const nextIndex = (currentIndex + 1) % currentPlayers.length;
    currentPlayer = currentPlayers[nextIndex];//beallitja a kovetkezo jatekost

    statusDisplay.innerHTML = currentPlayerTurn(currentPlayer);//frissiti a statusz kijelzot
}


/** 
 * Kezeli a cellára kattintás eseményét.
 */
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index')); // kiszámítja a kattintott cella indexét

    // Ha a cella már ki van töltve vagy a játék inaktív, akkor semmit sem csinál
    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    //a lepes vegrehajtasa
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add('filled', currentPlayer);//hozzaadja a stilusokat

    handleResultValidation();//ertekeli a jatek eredmenyet
}

//Ellenorzi a jatek eredmenyet
function checkWin() {
    const N = boardSize;// 3 (2P-hez) vagy 5 (3P-hez)
    const K = winConditionLength; // Mindig 3
    const currentPlayers = gameMode === '2P' ? players2P : players3P

    //vegigmegy minden jatekoson
    for (const player of currentPlayers) {
        // Vizsgálja a sorokat

        // Vizsgálja az vízszintes kombinációkat
        for (let row = 0; row < N; row++) { // minden sor vegig
            for (let col = 0; col <= N - K; col++) {// minden oszlop vegig ahol elfer a kombinacio
                let combo = [];//
                let isWin = true;
                for (let k = 0; k < K; k++) {//vegig megy a K hosszusagon
                    const index = row * N + (col + k);//kiszamitja az indexet
                    if (gameState[index] !== player) {//ha nem egyezik a jatekos jelevel
                        isWin = false;//nem nyert
                        break;
                    }
                    combo.push(index);//hozzaadja a kombinaciohoz az indexet
                }
                if (isWin) return { winner: player, combo };//ha nyert visszater az eredmennyel
            }
        }

        //2. fuggoleges kombinaciok vizsgalata
        for (let col = 0; col < N; col++) {
            for (let row = 0; row <= N - K; row++) {
                let combo = [];
                let isWin = true;
                for (let k = 0; k < K; k++) {
                    const index = (row + k) * N + col;//sor index változik, oszlop fix
                    if (gameState[index] !== player) {
                        isWin = false;
                        break;
                    }
                    combo.push(index);
                }
                if (isWin) return { winner: player, combo};
            }
        }

        //3. atlo kombinaciok vizsgalata (Jobb felülről le)
        for (let row = 0; row <= N - K; row++) {
            for (let col = 0; col <= N - K; col++) {
                let combo = [];
                let isWin = true;
                for (let k = 0; k < K; k++) {
                    const index = (row + k) * N + (col + k);//mindkettő növekszik
                    if (gameState[index] !== player) {
                        isWin = false;
                        break;
                    }
                    combo.push(index);
                }
                if (isWin) return { winner: player, combo };
            }
        }
        //4. atlo kombinaciok vizsgalata (Jobb felülről le)
        for (let row = 0; row <= N - K; row++) {
            for (let col = K - 1; col < N; col++) {
                let combo = [];
                let isWin = true;
                for (let k = 0; k < K; k++) {
                    const index = (row + k) * N + (col - k);//sor növekszik, oszlop csökken
                    if (gameState[index] !== player) {
                        isWin = false;
                        break;
                    }
                    combo.push(index);
                }
                if (isWin) return { winner: player, combo};
            }
        }
    }
    return { winner: null, combo: [] };//nincs nyertes
}


//ertekeli a jatek eredmenyet
function handleResultValidation() {
    const result = checkWin();//ellenorzi, van e nyertes

    if (result.winner) {
        gameActive = false; //leallitja a jatekot
        const winnerMessage = winningMessage(result.winner);
        statusDisplay.innerHTML = winnerMessage; //kiirja az eredmenyt

        //kiemeli a nyero vonalat
        result.combo.forEach(index => {
            document.querySelector(`.cell[data-index="${index}"]`).classList.add('winning-cell');
        });

        showModal(winnerMessage);//megjeleniti a modalt
        return;
    }

    //dontetlen ellenorzes, ha minden cella tele van es nincs nyertes
    let roundDraw = !gameState.includes(''); //ha nincs ures cella
    if (roundDraw) {
        gameActive = false; //leallitja a jatekot
        statusDisplay.innerHTML = drawMessage; //kiirja az eredmenyt
        showModal(drawMessage);//megjeleniti a modalt
        return;
    }

    handlePlayerChange(); // ha nincs vege a jateknak, valt a jatekos
}



//visszaállítja a játékot kezdeti állapotba
function handleRestartGame() {
    gameActive = true;
    currentPlayer = 'X';

    createGameBoard(); // JAVÍTVA: createBoard helyett
    
    statusDisplay.innerHTML = currentPlayerTurn(currentPlayer);
    hideModal();
}

//valt a jatekmodok kozott
function changeGameMode(newMode) {
    if (gameMode !== newMode) {//cak akkorcsinal valamit ha valtozik a mod
        gameMode = newMode;
        boardSize = newMode === '2P' ? 3 : 5; //beallitja a tabla meretet

        //frissiti a gombok allapotat
        mode2pButton.classList.remove('active');
        mode3pButton.classList.remove('active');
        if (newMode === '2P') {
            mode2pButton.classList.add('active');
        } else {
            mode3pButton.classList.add('active');
        }

        handleRestartGame(); //ujrainditja a jatekot uj modban

        statusDisplay.innerHTML = `${boardSize}x${boardSize} mód aktív. Játékos X kezd.`;

    }
}

//modal megjelenitese
function showModal(message) {
    modalMessage.innerHTML = message;
    modal.classList.remove('hidden'); // JAVÍTVA: MediaSourceHandle helyett
}

//modal elrejtese
function hideModal() {
    modal.classList.add('hidden');//hozzaadja a hidden osztalyt
}

//esemenyfigyelok hozzaadasa
resetButton.addEventListener('click', handleRestartGame);
closeModalButton.addEventListener('click', handleRestartGame); //modal bezarasa es jatek ujrainditasa

mode2pButton.addEventListener('click', () => changeGameMode('2P')); //2 jatekos mod gomb
mode3pButton.addEventListener('click', () => changeGameMode('3P')); //3 jatekos mod gomb

//kezdeti tabla letrehozasa
window.onload = () => {
    changeGameMode('2P'); //alapertelmezett mod 2 jatekos
}

