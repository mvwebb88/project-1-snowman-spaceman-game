// Snowman Rescue Game - app.js
// ---------------------------------------------
// A winter-themed word guessing game.
// The player tries to guess the secret word
// one letter at a time before the snowman melts.
// ---------------------------------------------

// List of winter words for the player to guess
const winterWords = [
  "SNOW",
  "MITTENS",
  "COCOA",
  "PENGUIN",
  "SLEIGH",
  "SCARF",
  "FROST",
  "ICICLE",
  "SNOWMAN",
  "GLACIER",
  "BLIZZARD",
  "SNOWBALL",
  "CHILL",
  "FIREPLACE"
];

// Maximum number of wrong guesses allowed (0–6)
const MAX_WRONG_GUESSES = 6;

// Game state variables (these will change while we play)
let secretWord = "";       // the answer word, like "SNOW"
let displayedWord = [];    // what the player currently sees, like ["S", "_", "_", "W"]
let guessedLetters = [];   // all letters the player has clicked
let wrongLetters = [];     // only wrong letters
let wrongGuessCount = 0;   // how many wrong guesses so far
let gameStatus = "playing"; // can be "playing", "won", or "lost"

// Cached DOM references (get HTML elements one time)
const snowmanImgEl = document.getElementById("snowman-img");
const guessesLeftEl = document.getElementById("guesses-left");
const wordDisplayEl = document.getElementById("word-display");
const messageEl = document.getElementById("message");
const keyboardEl = document.getElementById("keyboard");
const resetBtnEl = document.getElementById("reset-btn");
const wrongLettersEl = document.getElementById("wrong-letters");
const gameContainerEl = document.getElementById("game-container");

// Start the first round as soon as the page loads
init();


function init() {
  // 1. Choose a random winter word
  const randomIndex = Math.floor(Math.random() * winterWords.length);
  secretWord = winterWords[randomIndex];

  // 2. Create underscores for each letter of the word
  displayedWord = Array(secretWord.length).fill("_");

  // 3. Reset game state
  guessedLetters = [];
  wrongLetters = [];
  wrongGuessCount = 0;
  gameStatus = "playing";

  // 4. Reset what the player sees
  //    If snowman images are not set up yet, the game will still work.
  snowmanImgEl.src = "images/snowman0.png";
  guessesLeftEl.textContent = "Wrong guesses left: " + MAX_WRONG_GUESSES;
  wordDisplayEl.textContent = displayedWord.join(" ");
  messageEl.textContent = "Guess a letter to start warming up! ❄️";
  messageEl.className = "";
  wrongLettersEl.textContent = "Wrong letters: ";
  gameContainerEl.classList.remove("win", "lose");

  // 5. Build the on-screen A–Z keyboard
  generateKeyboard();
}

/* ---------------------------------
   generateKeyboard: make A–Z keys
---------------------------------- */
function generateKeyboard() {
  // Clear any existing buttons (for a new game)
  keyboardEl.innerHTML = "";

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let letter of alphabet) {
    const button = document.createElement("button");
    button.textContent = letter;

    // When a button is clicked, handle that guess
    button.addEventListener("click", function () {
      handleGuess(letter, button);
    });

    keyboardEl.appendChild(button);
  }
}

function handleGuess(letter, button) {
  // If the game is already over, ignore clicks
  if (gameStatus !== "playing") return;

  letter = letter.toUpperCase();

  // If we already tried this letter, give a gentle reminder
  if (guessedLetters.includes(letter)) {
    messageEl.textContent = "You already tried \"" + letter + "\". Pick a new letter! 😉";
    return;
  }

  // Remember this letter and disable its button
  guessedLetters.push(letter);
  if (button) button.disabled = true;

  // Case 1: correct guess
  if (secretWord.includes(letter)) {
    revealLetterInWord(letter);
    messageEl.textContent = "Nice and toasty! \"" + letter + "\" is in the word. 🔥";
    messageEl.className = "";

    // Check if the player has revealed the entire word
    if (!displayedWord.includes("_")) {
      gameStatus = "won";
      messageEl.textContent = "You win! You saved the snowman! ☃️";
      messageEl.className = "win-message";
      gameContainerEl.classList.add("win");
      // Optional future improvement:
      // snowmanImgEl.src = "images/snowman_happy.png";
      disableAllButtons();
    }

  } else {
    // Case 2: wrong guess
    handleWrongGuess(letter);
  }
}

function revealLetterInWord(letter) {
  for (let i = 0; i < secretWord.length; i++) {
    if (secretWord[i] === letter) {
      displayedWord[i] = letter;
    }
  }
  wordDisplayEl.textContent = displayedWord.join(" ");
}

function handleWrongGuess(letter) {
  wrongGuessCount++;

  // Track and display wrong letters
  wrongLetters.push(letter);
  wrongLettersEl.textContent = "Wrong letters: " + wrongLetters.join(", ");

  // Try to change the snowman image (if files exist)
  if (wrongGuessCount <= MAX_WRONG_GUESSES) {
    snowmanImgEl.src = "images/snowman" + wrongGuessCount + ".png";
  }

  // Update remaining guesses
  const guessesLeft = MAX_WRONG_GUESSES - wrongGuessCount;
  guessesLeftEl.textContent = "Wrong guesses left: " + guessesLeft;

  // Check if player has lost
  if (wrongGuessCount >= MAX_WRONG_GUESSES) {
    gameStatus = "lost";
    messageEl.textContent =
      "Oh no! The snowman melted! The word was: " + secretWord + ". Try again to rescue the next one! ❄️";
    messageEl.className = "lose-message";
    gameContainerEl.classList.add("lose");
    disableAllButtons();
  } else {
    messageEl.textContent =
      "Brrr! \"" + letter + "\" isn’t in the word. The snowman is getting colder... ❄️";
    messageEl.className = "";
  }
}

function disableAllButtons() {
  const buttons = keyboardEl.querySelectorAll("button");
  buttons.forEach((btn) => (btn.disabled = true));
}

resetBtnEl.addEventListener("click", init);


