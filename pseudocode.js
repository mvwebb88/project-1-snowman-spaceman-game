/*
 Winter Spaceman (Snowman Meltdown) - Pseudocode
 This game is based on Spaceman/Hangman rules with a winter theme.
*/

/* Snowman Rescue is a winter-themed version of the classic Spaceman/Hangman game. 
The computer selects a hidden winter-related word and the player tries to guess the
word one letter at a time. Each correct guess reveals the matching letters in the word. 
Each incorrect guess causes the snowman to melt a little more. The player wins by revealing 
the full word before the snowman melts completely. The player loses after a set number of 
wrong guesses, which triggers the fully melted snowman ending. The game includes a clear 
winter theme, a wrong-guess limit, and a reset option to play again with a new word.

*/

/*
Game Setup:

1. Create a list of winter words.
   Example:
   const winterWords = ["snow", "mittens", "penguin", "sleigh", "coc"];

2. Set the maximum number of wrong guesses.
   Example:
   const maxWrongGuesses = 6;

3. Choose a random word from the winterWords list.
   Store it in a variable called secretWord.

4. Create a displayed version of the word using underscores.
   Example:
   secretWord = "SNOW"
   displayedWord = ["_", "_", "_", "_"]

5. Make an empty array called guessedLetters
   to keep track of the letters the player has already guessed.

6. Set wrongGuessCount to 0.

7. Set gameStatus to "playing".

8. Show the player:
   - The underscores for the hidden word
   - A message like "Guess the winter word!"
   - A snowman image in its starting state (just a body)
   - How many wrong guesses are left
*/

/*
When the player guesses a letter:

1. If gameStatus is NOT "playing", ignore the guess.

2. Get the letter the player guessed.
   it will be lowercase so it matches secretWord.

3. If the letter is already in guessedLetters:
      - show a message like "You already guessed that!"

4. Add the guessed letter to guessedLetters.

5. Check if the guessed letter is in secretWord:

   IF the letter IS in secretWord:
      - Loop through each position in secretWord
        and replace the matching underscores in displayedWord.
      
      - Update the screen so the player can see the correct letters.

      - Check if there are NO MORE underscores left:
            If yes:
                Set gameStatus to "won".
                Show "You win! You saved the snowman!"
                Show a happy snowman image.
                Show snow confetti (possibly)

   ELSE (the letter is not in the word):
      - Increase wrongGuessCount by 1.
      - Update "wrong guesses left" on the screen.

      - If wrongGuessCount reaches maxWrongGuesses:
            Set gameStatus to "lost".
            Show "The snowman melted! The word was: ____"
            Show the melted snowman image.
*/

/*
Reset game/ new game:

1. When the player clicks "Play Again":
    - Pick a new random word from winterWords.
    - Reset displayedWord to all underscores.
    - Clear guessedLetters.
    - Reset wrongGuessCount to 0.
    - Set gameStatus back to "playing".
    - Reset the snowman image to a full one.
    - Reset the "wrong guesses left" text.
    - Show a fresh message like "Guess the winter word!"
*/

/* Some challenges that I expect to run into:
     - animations: I tend to struggle with getting animations to work correctly 
        e.x: displaying the changes to the snowman images dynamically along with the guessed correct letter
*/
