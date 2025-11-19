// Snowman Rescue Game - app.js
// Final version: 5 wrong guesses, 6 snowman frames
// images/snowman0.png, snowman1.jpeg ... snowman5.jpeg

// ----------------------
// Word list
// ----------------------
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

// We have frames 0–5, so player gets 5 wrong guesses
const MAX_WRONG_GUESSES = 5;

// ----------------------
// Game state variables
// ----------------------
let secretWord = "";
let displayedWord = [];
let guessedLetters = [];
let wrongLetters = [];
let wrongGuessCount = 0; // 0–5
let gameStatus = "playing"; // "playing", "won", "lost"

// ----------------------
// Cached DOM elements
// ----------------------
const snowmanImgEl = document.getElementById("snowman-img");
const guessesLeftEl = document.getElementById("guesses-left");
const wordDisplayEl = document.getElementById("word-display");
const messageEl = document.getElementById("message");
const keyboardEl = document.getElementById("keyboard");
const resetBtnEl = document.getElementById("reset-btn");
const wrongLettersEl = document.getElementById("wrong-letters");
const gameContainerEl = document.getElementById("game-container");

// Start the first game when the page loads
init();

/* -----------------------------
   init: start / restart a game
------------------------------ */
function init() {
  // 1. Pick a random word
  const randomIndex = Math.floor(Math.random() * winterWords.length);
  secretWord = winterWords[randomIndex];

  // 2. Create underscores for each letter
  displayedWord = Array(secretWord.length).fill("_");

  // 3. Reset state
  guessedLetters = [];
  wrongLetters = [];
  wrongGuessCount = 0;
  gameStatus = "playing";

  // 4. Reset UI
  updateSnowmanImage(); // shows snowman0.png
  guessesLeftEl.textContent = "Wrong guesses left: " + MAX_WRONG_GUESSES;
  wordDisplayEl.textContent = displayedWord.join(" ");
  messageEl.textContent = "Guess a letter to start warming up! ❄️";
  messageEl.className = "";
  wrongLettersEl.textContent = "Wrong letters: ";
  gameContainerEl.classList.remove("win", "lose");

  // 5. Rebuild keyboard
  generateKeyboard();
}

/* ---------------------------------
   generateKeyboard: make A–Z keys
---------------------------------- */
function generateKeyboard() {
  keyboardEl.innerHTML = "";

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let letter of alphabet) {
    const button = document.createElement("button");
    button.textContent = letter;

    button.addEventListener("click", function () {
      handleGuess(letter, button);
    });

    keyboardEl.appendChild(button);
  }
}

/* -----------------------------------------------
   handleGuess: what happens when you click a key
------------------------------------------------ */
function handleGuess(letter, button) {
  if (gameStatus !== "playing") return;

  letter = letter.toUpperCase();

  // Already guessed?
  if (guessedLetters.includes(letter)) {
    messageEl.textContent = `You already tried "${letter}". Pick a new one! 😉`;
    return;
  }

  guessedLetters.push(letter);
  if (button) button.disabled = true;

  if (secretWord.includes(letter)) {
    // Correct guess
    revealLetterInWord(letter);
    messageEl.textContent = `Nice! "${letter}" warmed things up! 🔥`;
    messageEl.className = "";

    // Check win
    if (!displayedWord.includes("_")) {
      gameStatus = "won";
      messageEl.textContent = "You win! You saved the snowman! ☃️";
      messageEl.className = "win-message";
      gameContainerEl.classList.add("win");
      disableAllButtons();
    }
  } else {
    // Wrong guess
    handleWrongGuess(letter);
  }
}

/* -------------------------------------------------
   revealLetterInWord: fill in correct letter spots
-------------------------------------------------- */
function revealLetterInWord(letter) {
  for (let i = 0; i < secretWord.length; i++) {
    if (secretWord[i] === letter) {
      displayedWord[i] = letter;
    }
  }
  wordDisplayEl.textContent = displayedWord.join(" ");
}

/* ---------------------------------------------
   handleWrongGuess: update for wrong guess
---------------------------------------------- */
function handleWrongGuess(letter) {
  wrongGuessCount++;

  wrongLetters.push(letter);
  wrongLettersEl.textContent = "Wrong letters: " + wrongLetters.join(", ");

  // Update snowman image based on wrongGuessCount
  updateSnowmanImage();

  const guessesLeft = MAX_WRONG_GUESSES - wrongGuessCount;
  guessesLeftEl.textContent = "Wrong guesses left: " + guessesLeft;

  if (wrongGuessCount >= MAX_WRONG_GUESSES) {
    gameStatus = "lost";
    messageEl.textContent =
      "Oh no! The snowman melted! The word was: " + secretWord + ". Try again to rescue the next one! ❄️";
    messageEl.className = "lose-message";
    gameContainerEl.classList.add("lose");
    disableAllButtons();
  } else {
    messageEl.textContent = `"${letter}" wasn't it. The snowman shivers... ❄️`;
    messageEl.className = "";
  }
}

/* --------------------------------------------------
   updateSnowmanImage: match wrongGuessCount to file
--------------------------------------------------- */
function updateSnowmanImage() {
  // Frame 0 is a PNG, frames 1–5 are JPEGs
  if (wrongGuessCount === 0) {
    snowmanImgEl.src = "images/snowman0.png";
  } else if (wrongGuessCount >= 1 && wrongGuessCount <= 5) {
    snowmanImgEl.src = `images/snowman${wrongGuessCount}.jpeg`;
  }
}

/* -----------------------------------------
   disableAllButtons: stop input after game
------------------------------------------ */
function disableAllButtons() {
  const buttons = keyboardEl.querySelectorAll("button");
  buttons.forEach((btn) => (btn.disabled = true));
}

/* -------------------------------------------
   Reset button: start a brand new snowman 🙂
-------------------------------------------- */
resetBtnEl.addEventListener("click", init);




