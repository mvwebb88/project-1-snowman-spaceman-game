// Snowman Rescue Game - app.js
// Final version: 5 wrong guesses, 6 snowman frames, snowflakes, confetti, hint feature

// -----------------------------
// Word list
// -----------------------------
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

// Matching hint for each winter word
const hints = {
  SNOW: "Falls from the sky in cold weather.",
  MITTENS: "You wear these on your hands to keep warm.",
  COCOA: "A hot drink often topped with marshmallows.",
  PENGUIN: "A black and white bird that can't fly.",
  SLEIGH: "A winter vehicle that slides over snow.",
  SCARF: "You wrap this around your neck when it's cold.",
  FROST: "Thin ice that forms on surfaces in the cold.",
  ICICLE: "A hanging spike of ice.",
  SNOWMAN: "A figure made of stacked snowballs.",
  GLACIER: "A large, slow-moving river of ice.",
  BLIZZARD: "A very strong snowstorm.",
  SNOWBALL: "Something you throw in a playful winter fight.",
  CHILL: "Another word for cold.",
  FIREPLACE: "You sit by this to warm up indoors."
};

// We have frames 0–5, so player gets 5 wrong guesses
const MAX_WRONG_GUESSES = 5;

// -----------------------------
// Game state variables
// -----------------------------
let secretWord = "";
let displayedWord = [];
let guessedLetters = [];
let wrongLetters = [];
let wrongGuessCount = 0; // 0–5
let gameStatus = "playing"; // "playing", "won", "lost"
let hintUsed = false;      // Track if hint used this round

// -----------------------------
// Cached DOM elements
// -----------------------------
const snowmanImgEl = document.getElementById("snowman-img");
const guessesLeftEl = document.getElementById("guesses-left");
const wordDisplayEl = document.getElementById("word-display");
const messageEl = document.getElementById("message");
const keyboardEl = document.getElementById("keyboard");
const resetBtnEl = document.getElementById("reset-btn");
const wrongLettersEl = document.getElementById("wrong-letters");
const gameContainerEl = document.getElementById("game-container");
const hintBtnEl = document.getElementById("hint-btn");
const hintTextEl = document.getElementById("hint-text");

// Start the first game when the page loads
init();

/* -----------------------------
   init: start / restart a game
------------------------------ */
function init() {
  // 1. Pick a random winter word
  const randomIndex = Math.floor(Math.random() * winterWords.length);
  secretWord = winterWords[randomIndex];

  // 2. Create underscores for each letter
  displayedWord = Array(secretWord.length).fill("_");

  // 3. Reset state
  guessedLetters = [];
  wrongLetters = [];
  wrongGuessCount = 0;
  gameStatus = "playing";
  hintUsed = false;

  // 4. Reset UI
  updateSnowmanImage(); // shows snowman0.png
  guessesLeftEl.textContent = "Wrong guesses left: " + MAX_WRONG_GUESSES;
  wordDisplayEl.textContent = displayedWord.join(" ");
  messageEl.textContent = "Guess a letter to start warming up! ❄️";
  messageEl.className = "";
  wrongLettersEl.textContent = "Wrong letters: ";
  hintTextEl.textContent = "";
  hintBtnEl.disabled = false;
  gameContainerEl.classList.remove("win", "lose");

  // Clear any leftover confetti (in case of replay)
  const oldConfetti = document.querySelectorAll(".confetti");
  oldConfetti.forEach((c) => c.remove());

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
      startConfetti(); // 🎉 trigger confetti on win
      hintBtnEl.disabled = true; // no hint after game ends
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
    hintBtnEl.disabled = true; // no hint after game ends
  } else {
    messageEl.textContent = `"${letter}" wasn't it. The snowman shivers... ❄️`;
    messageEl.className = "";
  }
}

/* --------------------------------------------------
   updateSnowmanImage: match wrongGuessCount to file
   Frame 0 = PNG, Frames 1–5 = JPEG
--------------------------------------------------- */
function updateSnowmanImage() {
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

/* ---------------------------------------
   showHint: display a hint for this word
---------------------------------------- */
function showHint() {
  if (gameStatus !== "playing" || hintUsed) return;

  hintUsed = true;
  hintBtnEl.disabled = true;

  const hint = hints[secretWord] || "No hint available for this word.";
  hintTextEl.textContent = "Hint: " + hint;
}

/* -----------------------------------------------
   🎉 Simple Confetti Explosion on Win
------------------------------------------------ */
function startConfetti() {
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    // Random emoji for fun
    const symbols = ["❄️", "✨", "💙", "⛄"];
    confetti.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDuration = (Math.random() * 2 + 2) + "s";
    confetti.style.fontSize = (Math.random() * 20 + 20) + "px";

    document.body.appendChild(confetti);

    // Remove after animation
    setTimeout(() => confetti.remove(), 4000);
  }
}

/* -------------------------------------------
   Event listeners
-------------------------------------------- */
resetBtnEl.addEventListener("click", init);
hintBtnEl.addEventListener("click", showHint);







