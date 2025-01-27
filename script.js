const cards = document.querySelector('.game-container');
const restartButton = document.querySelector('#restart');
const overlay = document.querySelector('#overlay');
let timer;
let gameInterval;
let points = 0;
let moves = 0;
let matchedCards = 0;
let flippedCards = [];
let isFlipping = false;
let level = 'easy'; // Default level

// Card values
const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];

function createCards() {
    cards.innerHTML = ''; // Clear previous cards
    let levelCards;

    // Set the number of cards and timer based on the selected level
    if (level === "easy") {
        levelCards = cardValues.slice(0, 8); // Easy: 8 pairs
        timer = 60; // 1 minute
    } else if (level === "medium") {
        levelCards = cardValues.slice(0, 12); // Medium: 12 pairs
        timer = 90; // 1.5 minutes
    } else if (level === "hard") {
        levelCards = cardValues.slice(0, 16); // Hard: 16 pairs
        timer = 120; // 2 minutes
    }

    const shuffledCards = shuffle(levelCards.concat(levelCards));

    shuffledCards.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.card = value;

        const front = document.createElement('div');
        front.classList.add('card-front');
        front.textContent = '?';

        const back = document.createElement('div');
        back.classList.add('card-back');
        back.textContent = value;

        card.appendChild(front);
        card.appendChild(back);
        card.addEventListener('click', flipCard);

        cards.appendChild(card);
    });

    // Update the timer and start the game
    document.querySelector("#timer").textContent = `Time: ${formatTime(timer)}`;
    document.querySelector("#points").textContent = `Points: ${points}`;
    startTimer();
    document.querySelector("#restart").classList.add('hidden'); // Hide restart button initially
    overlay.classList.add('hidden'); // Hide overlay initially
}

// Shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Function to flip a card
function flipCard() {
    if (isFlipping || this.classList.contains('flipped') || this.classList.contains('matched')) return;

    this.classList.add('flipped');
    flippedCards.push(this);
    moves++;

    if (flippedCards.length === 2) {
        isFlipping = true;
        setTimeout(checkMatch, 1000);
    }
}

// Function to check if the flipped cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.card === card2.dataset.card) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards += 2;
        points += 10; // Add points for matching
        document.querySelector("#points").textContent = `Points: ${points}`;
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }

    flippedCards = [];
    isFlipping = false;

    if (matchedCards === cardValues.length * 2) {
        clearInterval(gameInterval);
        document.querySelector("#message").textContent = "You Win!";
        document.querySelector(".game-status").classList.add("won");
        document.querySelector("#restart").classList.remove('hidden');
    }
}

// Timer function
function startTimer() {
    gameInterval = setInterval(() => {
        timer--;
        document.querySelector("#timer").textContent = `Time: ${formatTime(timer)}`;
        if (timer <= 0) {
            clearInterval(gameInterval);
            document.querySelector("#message").textContent = "Time's Up! Game Over!";
            overlay.classList.remove('hidden'); // Show the overlay with "Try Again"
            document.querySelector("#restart").classList.remove('hidden');
            disableCards(); // Disable further interaction
        }
    }, 1000);
}

// Function to disable all cards
function disableCards() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.add('disabled');
        card.removeEventListener('click', flipCard); // Remove event listener to prevent flipping
    });
}

// Function to format time
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Add event listeners to level buttons
document.querySelectorAll(".level-btn").forEach(button => {
    button.addEventListener('click', function() {
        level = this.dataset.level;
        matchedCards = 0;
        moves = 0;
        points = 0;
        createCards();
        document.querySelector(".game-status").classList.remove("won");
        document.querySelector("#message").textContent = "Game Started!";
        document.querySelector("#restart").classList.add('hidden');
        overlay.classList.add('hidden'); // Hide the "Try Again" overlay
    });
});

// Restart button functionality
restartButton.addEventListener('click', function() {
    matchedCards = 0;
    moves = 0;
    points = 0;
    createCards();
    document.querySelector("#restart").classList.add('hidden');
    overlay.classList.add('hidden');
});

