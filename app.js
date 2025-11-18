// Snowman Rescue Game - app.js (image-test version)

// Word list
const winterWords = [
  "SNOW", "MITTENS", "COCOA", "PENGUIN", "SLEIGH",
  "SCARF", "FROST", "ICICLE", "SNOWMAN", "GLACIER",
  "BLIZZARD", "SNOWBALL", "CHILL", "FIREPLACE"
];

const MAX_WRONG_GUESSES = 6;

// Game state
let secretWord = "";
let displayedWord = [];
let guessedLetters = [];
let wrongLetters = [];
let wrongGuessCount = 0;
let gameStatus = "playing";

// DOM references
const snowmanImgEl = document.getElementById("snowman-img");
const guessesLeftEl = document.getElementById("guesses-left");
const wordDisplayEl = document.getElementById("word-display");
const messageEl = document.getElementById("message");
const keyboardEl = document.getElementById("keyboard");
const resetBtnEl = document.getElementById("reset-btn");
const wrongLettersEl = document.getElementById("wrong-letters");
const gameContainerEl = document.getElementById("game-container");

// Start the game
init();

function init() {
  // Choose word
  const randomIndex = Math.floor(Math.random() * winterWords.length);
  secretWord = winterWords[randomIndex];

  // Build blank word display
  displayedWord = Array(secretWord.length).fill("_");

  guessedLetters = [];
  wrongLetters = [];
  wrongGuessCount = 0;
  gameStatus = "playing";

  // ❗ FORCE IMAGE TO SNOWMAN0.JFIF ONLY
  // This guarantees your image loads for now.
  snowmanImgEl.src = "images/snowman0.png";


  guessesLeftEl.textContent = "Wrong guesses left: " + MAX_WRONG_GUESSES;
  wordDisplayEl.textContent = displayedWord.join(" ");
  messageEl.textContent = "Guess a letter to start warming up! ❄️";
  messageEl.className = "";
  wrongLettersEl.textContent = "Wrong letters: ";
  gameContainerEl.classList.remove("win", "lose");

  generateKeyboard();
}

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

function handleGuess(letter, button) {
  if (gameStatus !== "playing") return;

  letter = letter.toUpperCase();

  if (guessedLetters.includes(letter)) {
    messageEl.textContent = `You already tried "${letter}". Pick a new one! 😉`;
    return;
  }

  guessedLetters.push(letter);
  if (button) button.disabled = true;

  if (secretWord.includes(letter)) {
    revealLetter(letter);
    messageEl.textContent = `Nice! "${letter}" warmed things up! 🔥`;

    if (!displayedWord.includes("_")) {
      gameStatus = "won";
      messageEl.textContent = "You win! You saved the snowman! ☃️";
      messageEl.className = "win-message";
      gameContainerEl.classList.add("win");
      disableAllButtons();
    }
  } else {
    handleWrongGuess(letter);
  }
}

function revealLetter(letter) {
  for (let i = 0; i < secretWord.length; i++) {
    if (secretWord[i] === letter) {
      displayedWord[i] = letter;
    }
  }
  wordDisplayEl.textContent = displayedWord.join(" ");
}

function handleWrongGuess(letter) {
  wrongGuessCount++;

  wrongLetters.push(letter);
  wrongLettersEl.textContent = "Wrong letters: " + wrongLetters.join(", ");

  // ❗ DO *NOT* CHANGE THE IMAGE YET
  // Once snowman0.jfif shows, we will re-enable:
  // snowmanImgEl.src = "images/snowman" + wrongGuessCount + ".jfif";

  guessesLeftEl.textContent =
    "Wrong guesses left: " + (MAX_WRONG_GUESSES - wrongGuessCount);

  if (wrongGuessCount >= MAX_WRONG_GUESSES) {
    gameStatus = "lost";
    messageEl.textContent =
      "Oh no! The snowman melted! The word was: " + secretWord;
    messageEl.className = "lose-message";
    gameContainerEl.classList.add("lose");
    disableAllButtons();
  } else {
    messageEl.textContent = `"${letter}" wasn't it. The snowman shivers... ❄️`;
  }
}

function disableAllButtons() {
  const btns = keyboardEl.querySelectorAll("button");
  btns.forEach((b) => (b.disabled = true));
}

resetBtnEl.addEventListener("click", init);



