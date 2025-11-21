// Snowman Rescue Game - app.js
// This file contains all of the game's logic:
// - picking a random word
// - tracking guesses
// - updating the snowman image
// - handling win/lose states
// - showing hints, reveal word, instructions, and confetti

// -----------------------------
// 1. Word list and hints
// -----------------------------

// All possible secret words the game can choose from
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
// The keys (SNOW, COCOA, etc.) must match the words in winterWords
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

// We have snowman frames 0 through 5,
// so the player gets 5 wrong guesses before the final melted frame.
const MAX_WRONG_GUESSES = 5;

// -----------------------------
// 2. Game state variables
// -----------------------------
// These variables hold the current "state" of the game.
// They change as the player guesses letters.

let secretWord = "";        // The chosen word (e.g. "SNOWMAN")
let displayedWord = [];     // Array of letters and underscores shown on screen
let guessedLetters = [];    // All letters the player has already tried
let wrongLetters = [];      // Only the letters that were incorrect guesses
let wrongGuessCount = 0;    // How many wrong guesses so far (0–5)
let gameStatus = "playing"; // Can be "playing", "won", or "lost"
let hintUsed = false;       // True after the player clicks the hint button

// -----------------------------
// 3. Cached DOM elements
// -----------------------------
// We only look up each element once and store it in a variable.
// This is faster and keeps the code cleaner.

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
const revealBtnEl = document.getElementById("reveal-btn");
const instructionsBtnEl = document.getElementById("instructions-btn");
const instructionsPanelEl = document.getElementById("instructions-panel");

// Start the first game as soon as the page loads
init();

/* -----------------------------
   4. init: start / restart a game
   - choose a new word
   - reset all state
   - reset the UI
------------------------------ */
function init() {
  // 1. Pick a random winter word
  const randomIndex = Math.floor(Math.random() * winterWords.length);
  secretWord = winterWords[randomIndex];

  // 2. Create underscores for each letter (e.g. "SNOW" -> ["_", "_", "_", "_"])
  displayedWord = Array(secretWord.length).fill("_");

  // 3. Reset all game state
  guessedLetters = [];
  wrongLetters = [];
  wrongGuessCount = 0;
  gameStatus = "playing";
  hintUsed = false;

  // 4. Reset UI elements to their starting values
  updateSnowmanImage(); // show snowman0.png
  guessesLeftEl.textContent = "Wrong guesses left: " + MAX_WRONG_GUESSES;
  wordDisplayEl.textContent = displayedWord.join(" ");
  messageEl.textContent = "Guess a letter to start warming up! ❄️";
  messageEl.className = "";
  wrongLettersEl.textContent = "Wrong letters: ";
  hintTextEl.textContent = "";
  hintBtnEl.disabled = false;
  revealBtnEl.disabled = false;
  gameContainerEl.classList.remove("win", "lose");

  // Always start with the instructions panel hidden and button text reset
  instructionsPanelEl.classList.add("hidden");
  instructionsBtnEl.textContent = "Instructions";

  // Remove any leftover confetti from a previous game
  const oldConfetti = document.querySelectorAll(".confetti");
  oldConfetti.forEach((c) => c.remove());

  // 5. Build a fresh on-screen keyboard
  generateKeyboard();
}

/* ---------------------------------
   5. generateKeyboard: create A–Z keys
   - creates a button for each letter
   - attaches a click handler to each one
---------------------------------- */
function generateKeyboard() {
  // Clear out any previous buttons
  keyboardEl.innerHTML = "";

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Create one button for each letter in the alphabet
  for (let letter of alphabet) {
    const button = document.createElement("button");
    button.textContent = letter;

    // When the button is clicked, handle the guess
    button.addEventListener("click", function () {
      handleGuess(letter, button);
    });

    keyboardEl.appendChild(button);
  }
}

/* -----------------------------------------------
   6. handleGuess: what happens when a letter is chosen
   - ignore input if game is over
   - prevent duplicate guesses
   - update state for correct or wrong guesses
------------------------------------------------ */
function handleGuess(letter, button) {
  // If the game is not in the "playing" state, ignore input
  if (gameStatus !== "playing") return;

  // Make sure we're working in uppercase to match secretWord
  letter = letter.toUpperCase();

  // If we've already guessed this letter, show a friendly message and stop
  if (guessedLetters.includes(letter)) {
    messageEl.textContent = `You already tried "${letter}". Pick a new one! 😉`;
    return;
  }

  // Track this letter as guessed
  guessedLetters.push(letter);

  // Disable the button so it can't be clicked again
  if (button) button.disabled = true;

  // If the secret word contains the letter, reveal it
  if (secretWord.includes(letter)) {
    revealLetterInWord(letter);
    messageEl.textContent = `Nice! "${letter}" warmed things up! 🔥`;
    messageEl.className = "";

    // Check if there are no more underscores left -> player has guessed the word
    if (!displayedWord.includes("_")) {
      gameStatus = "won";
      messageEl.textContent = "You win! You saved the snowman! ☃️";
      messageEl.className = "win-message";
      gameContainerEl.classList.add("win");
      disableAllButtons();
      startConfetti();             // sparkly celebration
      hintBtnEl.disabled = true;   // no hint needed after winning
      revealBtnEl.disabled = true; // no reveal after game ends
    }
  } else {
    // Otherwise it's a wrong guess
    handleWrongGuess(letter);
  }
}

/* -------------------------------------------------
   7. revealLetterInWord: show correctly guessed letters
   - loop through the secret word
   - if the letter matches, replace the underscore with that letter
-------------------------------------------------- */
function revealLetterInWord(letter) {
  for (let i = 0; i < secretWord.length; i++) {
    if (secretWord[i] === letter) {
      displayedWord[i] = letter;
    }
  }
  // Update the word display on the page
  wordDisplayEl.textContent = displayedWord.join(" ");
}

/* ---------------------------------------------
   8. handleWrongGuess: update when guess is wrong
   - increment wrongGuessCount
   - update snowman image
   - update wrong-letters list and guesses left
   - check for lose condition
---------------------------------------------- */
function handleWrongGuess(letter) {
  // Increase wrongGuessCount by 1
  wrongGuessCount++;

  // Track this letter as a wrong guess and show it on the page
  wrongLetters.push(letter);
  wrongLettersEl.textContent = "Wrong letters: " + wrongLetters.join(", ");

  // Change the snowman image to the next "melting" frame
  updateSnowmanImage();

  // Update how many wrong guesses remain
  const guessesLeft = MAX_WRONG_GUESSES - wrongGuessCount;
  guessesLeftEl.textContent = "Wrong guesses left: " + guessesLeft;

  // Check if the player has used up all wrong guesses
  if (wrongGuessCount >= MAX_WRONG_GUESSES) {
    gameStatus = "lost";
    messageEl.textContent =
      "Oh no! The snowman melted! The word was: " + secretWord + ". Try again to rescue the next one! ❄️";
    messageEl.className = "lose-message";
    gameContainerEl.classList.add("lose");
    disableAllButtons();
    hintBtnEl.disabled = true;   // no hint after game ends
    revealBtnEl.disabled = true; // no reveal after game ends
  } else {
    // Otherwise, encourage the player to keep trying
    messageEl.textContent = `"${letter}" wasn't it. The snowman shivers... ❄️`;
    messageEl.className = "";
  }
}

/* --------------------------------------------------
   9. updateSnowmanImage: change the snowman picture
   - frame 0 (no wrong guesses) is a PNG
   - frames 1–5 (wrong guesses) are JPEGs
--------------------------------------------------- */
function updateSnowmanImage() {
  if (wrongGuessCount === 0) {
    // Starting image (fully safe snowman)
    snowmanImgEl.src = "images/snowman0.png";
  } else if (wrongGuessCount >= 1 && wrongGuessCount <= 5) {
    // Each wrong guess moves to the next image: snowman1.jpeg, snowman2.jpeg, etc.
    snowmanImgEl.src = `images/snowman${wrongGuessCount}.jpeg`;
  }
}

/* -----------------------------------------
   10. disableAllButtons: stop input after game ends
------------------------------------------ */
function disableAllButtons() {
  const buttons = keyboardEl.querySelectorAll("button");
  buttons.forEach((btn) => (btn.disabled = true));
}

/* ---------------------------------------
   11. showHint: display a hint for this word
   - only works once per round
   - does not cost a wrong guess
---------------------------------------- */
function showHint() {
  // Only allow a hint if the game is still going and we haven't used one yet
  if (gameStatus !== "playing" || hintUsed) return;

  hintUsed = true;
  hintBtnEl.disabled = true;

  // Look up the hint for the current secretWord.
  // If none exists, show a fallback message.
  const hint = hints[secretWord] || "No hint available for this word.";
  hintTextEl.textContent = "Hint: " + hint;
}

/* ---------------------------------------
   12. revealWord: let the player give up
   - reveals the entire word
   - melts the snowman fully
   - counts as a loss
---------------------------------------- */
function revealWord() {
  // Only allow reveal while game is actively being played
  if (gameStatus !== "playing") return;

  // Fill displayedWord with the full secret word
  displayedWord = secretWord.split("");
  wordDisplayEl.textContent = displayedWord.join(" ");

  // Instantly melt the snowman to the final frame
  wrongGuessCount = MAX_WRONG_GUESSES;
  updateSnowmanImage();
  guessesLeftEl.textContent = "Wrong guesses left: 0";

  // Mark the game as lost since the player gave up
  gameStatus = "lost";
  messageEl.textContent =
    "You revealed the word! The snowman melted. The word was: " + secretWord + ". ❄️";
  messageEl.className = "lose-message";
  gameContainerEl.classList.add("lose");

  // Disable all input buttons
  disableAllButtons();
  hintBtnEl.disabled = true;
  revealBtnEl.disabled = true;
}

/* -----------------------------------------------
   13. startConfetti: simple confetti effect on win
   - creates small emoji elements that fall down the screen
------------------------------------------------ */
function startConfetti() {
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    // Use random winter-ish emojis for extra fun
    const symbols = ["❄️", "✨", "💙", "⛄"];
    confetti.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    // Random horizontal position and animation settings
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDuration = (Math.random() * 2 + 2) + "s";
    confetti.style.fontSize = (Math.random() * 20 + 20) + "px";

    // Add the confetti element to the page
    document.body.appendChild(confetti);

    // Remove it after the animation finishes so the DOM doesn't fill up
    setTimeout(() => confetti.remove(), 4000);
  }
}

/* ---------------------------------------
   14. toggleInstructions: show/hide panel
   - toggles a hidden class on the instructions panel
   - switches button text between "Instructions" / "Hide Instructions"
---------------------------------------- */
function toggleInstructions() {
  instructionsPanelEl.classList.toggle("hidden");

  if (instructionsPanelEl.classList.contains("hidden")) {
    instructionsBtnEl.textContent = "Instructions";
  } else {
    instructionsBtnEl.textContent = "Hide Instructions";
  }
}

/* -------------------------------------------
   15. Event listeners
   - reset button starts a brand new game
   - hint button shows a hint
   - reveal button reveals the word
   - instructions button toggles the instructions panel
-------------------------------------------- */
resetBtnEl.addEventListener("click", init);
hintBtnEl.addEventListener("click", showHint);
revealBtnEl.addEventListener("click", revealWord);
instructionsBtnEl.addEventListener("click", toggleInstructions);









