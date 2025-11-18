// Snowman Rescue Game - app.js

// List of winter words for the player to guess
const winterWords = ["SNOW", "MITTENS", "COCOA", "PENGUIN", "SLEIGH", "SCARF", "FROST"];

// Maximum number of wrong guesses allowed
const MAX_WRONG_GUESSES = 6;

// Game state variables
let secretWord = "";
let displayedWord = [];
let guessedLetters = [];
let wrongGuessCount = 0;
let gameStatus = "playing"; // "playing", "won", or "lost"

// Cached element references (HTML elements we will update)
const snowmanImgEl = document.getElementById("snowman-img");
const guessesLeftEl = document.getElementById("guesses-left");
const wordDisplayEl = document.getElementById("word-display");
const messageEl = document.getElementById("message");
const keyboardEl = document.getElementById("keyboard");
const resetBtnEl = document.getElementById("reset-btn");

// Initialize the game when the page loads
init();

// Set up a new round of the game
function init() {
  // Pick a random word from the list
  const randomIndex = Math.floor(Math.random() * winterWords.length);
  secretWord = winterWords[randomIndex];

  // Set up the displayed word as underscores
  displayedWord = Array(secretWord.length).fill("_");

  // Reset game state
  guessedLetters = [];
  wrongGuessCount = 0;
  gameStatus = "playing";

  // Reset what the player sees
  snowmanImgEl.src = "images/snowman0.png";
  guessesLeftEl.textContent = "Wrong guesses left: " + MAX_WRONG_GUESSES;
  wordDisplayEl.textContent = displayedWord.join(" ");
  messageEl.textContent = "Guess a letter to begin!";

  // Build the on-screen keyboard
  generateKeyboard();
}

// Create A–Z buttons for the player to click
function generateKeyboard() {
  // Clear any old buttons
  keyboardEl.innerHTML = "";

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < alphabet.length; i++) {
    const letter = alphabet[i];

    const button = document.createElement("button");
    button.textContent = letter;

    // When a button is clicked, call handleGuess
    button.addEventListener("click", function () {
      handleGuess(letter, button);
    });

    keyboardEl.appendChild(button);
  }
}

// Handle a single letter guess
function handleGuess(letter, button) {
  // If the game is over, do nothing
  if (gameStatus !== "playing") {
    return;
  }

  // Make sure we work with uppercase letters
  letter = letter.toUpperCase();

  // If the letter was already guessed, show a message and stop
  if (guessedLetters.includes(letter)) {
    messageEl.textContent = "You already guessed that letter.";
    return;
  }

  // Remember this letter, and disable the button
  guessedLetters.push(letter);
  if (button) {
    button.disabled = true;
  }

  // Check if the letter is in the secret word
  if (secretWord.includes(letter)) {
    // Reveal all matching positions
    for (let i = 0; i < secretWord.length; i++) {
      if (secretWord[i] === letter) {
        displayedWord[i] = letter;
      }
    }

    // Update the word on the screen
    wordDisplayEl.textContent = displayedWord.join(" ");
    messageEl.textContent = "Nice! Keep going.";

    // Check for a win (no more underscores)
    if (!displayedWord.includes("_")) {
      gameStatus = "won";
      messageEl.textContent = "You win! You saved the snowman! ☃️";
      // Optional: you can point to a special happy snowman image if you have one
      // snowmanImgEl.src = "images/snowman_happy.png";
    }
  } else {
    // Wrong guess
    wrongGuessCount++;

    // Update snowman image (snowman1.png, snowman2.png, etc.)
    if (wrongGuessCount <= MAX_WRONG_GUESSES) {
      snowmanImgEl.src = "images/snowman" + wrongGuessCount + ".png";
    }

    // Update how many guesses are left
    const guessesLeft = MAX_WRONG_GUESSES - wrongGuessCount;
    guessesLeftEl.textContent = "Wrong guesses left: " + guessesLeft;

    // If the player used all wrong guesses, they lose
    if (wrongGuessCount >= MAX_WRONG_GUESSES) {
      gameStatus = "lost";
      messageEl.textContent = "Oh no! The snowman melted! The word was: " + secretWord;
      // Optional: if you have a special melted image:
      // snowmanImgEl.src = "images/snowman_melted.png";
      disableAllButtons();
    } else {
      messageEl.textContent = "Nope! Try another letter.";
    }
  }
}

// Disable all keyboard buttons (used when the game is over)
function disableAllButtons() {
  const buttons = keyboardEl.querySelectorAll("button");
  buttons.forEach(function (btn) {
    btn.disabled = true;
  });
}

// Reset button starts a new game
resetBtnEl.addEventListener("click", function () {
  init();
});
