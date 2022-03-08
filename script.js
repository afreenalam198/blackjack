//Blackjack


let blackjackGame = {
    'player': {'scoreSpan': '#playerScore', 'div': '#userZone', 'score': 0},
    'dealer': {'scoreSpan': '#dealerScore', 'div': '#dealerZone', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'K', 'Q'],
    'cardPoints': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'A': [1, 11], 'J': 10, 'K': 10, 'Q': 10},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnOver': false,
};

const PLAYER = blackjackGame['player'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('assets/sounds/swish.m4a');
const winSound = new Audio('assets/sounds/cash.mp3');
const lossSound = new Audio('assets/sounds/aww.mp3');

document.querySelector('#new-game-btn').addEventListener('click', blackjackNewGame);
document.querySelector('#hit-btn').addEventListener('click', blackjackHit);
document.querySelector('#stand-btn').addEventListener('click', blackjackDealer);
document.querySelector('#deal-btn').addEventListener('click', blackjackDeal);


function blackjackNewGame() {
    blackjackGame['wins'] = 0;
    blackjackGame['losses'] = 0;
    blackjackGame['draws'] = 0;
    updateTableResult();
    blackjackDeal();
}

function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
        let cardPicked = pickRandomCard();
        showCard(cardPicked, PLAYER);
        updateScore(cardPicked, PLAYER);
        showScore(PLAYER);
        blackjackGame['turnOver'] = true;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms)); 
}

async function blackjackDealer() {
    
    if (blackjackGame['turnOver'] === true) {
        blackjackGame['isStand'] = true;
        while (DEALER['score'] <= 15 && blackjackGame['isStand'] === true) {
            let cardPicked = pickRandomCard();
            showCard(cardPicked, DEALER);
            updateScore(cardPicked, DEALER);
            showScore(DEALER);
            await sleep(1000);
        }

        
        let winner = computeWinner();
        showResultText(winner);
        updateTableResult();   
        blackjackGame['turnOver'] = false;
    }
}


function pickRandomCard() {
    let indexPick = Math.floor(Math.random() * 13);
    //console.log(blackjackGame['cards'][indexPick]);
    return blackjackGame['cards'][indexPick];
    
}

function updateScore(cardPicked, activePlayer) {
    //console.log(cardPicked);
    //console.log(blackjackGame['cardPoints'][cardPicked]);
    let cardPoint = blackjackGame['cardPoints'][cardPicked]; 

    //if Ace is picked check to see if adding 11 will keep the score below or equal to 21
    //if not then add 1

    if (cardPicked =='A') {
        if (activePlayer['score'] + cardPoint[1] <= 21) {
            cardPoint = cardPoint[1];
        } else {
            cardPoint = cardPoint[0];
        }
    }   
    activePlayer['score'] += cardPoint;
}

function showScore(activePlayer) {
    if (activePlayer['score'] <= 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = '#BD1C1C';
    }
   
}


function showCard(cardPicked, activePlayer) {

    if (activePlayer['score'] <= 21) {
        let cardImg = document.createElement('img');
        cardImg.src = `assets/images/${cardPicked}.png`;  //nicer way of string concatenation
        cardImg.style.height = '120px';
        cardImg.style.padding = '10px';
        document.querySelector(activePlayer['div']).appendChild(cardImg);
        hitSound.play();
    }
    
}


function blackjackDeal() {

    blackjackGame['isStand'] = false;
    blackjackGame['turnOver'] = false;
    let allImages_userZone = document.querySelector(PLAYER['div']).querySelectorAll('img');
    let allImages_dealerZone = document.querySelector(DEALER['div']).querySelectorAll('img');
    //console.log(allImages);
    let len_allImages_userZone = allImages_userZone.length;
    let len_allImages_dealerZone = allImages_dealerZone.length;

    for (let i=0; i<len_allImages_userZone; i++) {
        allImages_userZone[i].remove();
    }

    for (let i=0; i<len_allImages_dealerZone; i++) {
        allImages_dealerZone[i].remove();
    }

    PLAYER['score'] = 0;
    DEALER['score'] = 0;

    document.querySelector(PLAYER['scoreSpan']).textContent = 0;
    document.querySelector(PLAYER['scoreSpan']).style.color = 'white';
    document.querySelector(DEALER['scoreSpan']).textContent = 0;
    document.querySelector(DEALER['scoreSpan']).style.color = 'white';

    document.querySelector('#textResult').textContent = "Let's Play!";
    document.querySelector('#textResult').style.color = 'white';
    
}


function computeWinner() {
    let winner;
    if (PLAYER['score'] <= 21) {
        if (PLAYER['score'] > DEALER['score'] || DEALER['score'] > 21) {
            winner = PLAYER;
            blackjackGame['wins']++;
        } else if (PLAYER['score'] === DEALER['score']) {
            blackjackGame['draws']++;
        } else if (DEALER['score'] > PLAYER['score']) {
            winner = DEALER;
            blackjackGame['losses']++;
        }
    } else if (PLAYER['score'] > 21 && DEALER['score'] <= 21){
        winner = DEALER;
        blackjackGame['losses']++;
    } else if (PLAYER['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++;
    }
    return winner;
}


function showResultText(winner) {
    let text, textColour;
    
    if (winner === PLAYER) {
        text = 'Player Won!';
        textColour = '#134EE7';
        winSound.play();
    } else if (winner === DEALER) {
        text = 'Dealer Won!';
        textColour = '#BD1C1C';
        lossSound.play();
    } else if (winner === undefined) {
        text = 'Draw!';
        textColour = '#ffc107';
        winSound.play();
    }

    document.querySelector('#textResult').textContent = text;
    document.querySelector('#textResult').style.color = textColour;
}


function updateTableResult() {
    document.querySelector('#wins').textContent = blackjackGame['wins'];
    document.querySelector('#draws').textContent = blackjackGame['draws'];
    document.querySelector('#losses').textContent = blackjackGame['losses'];
}