import React, { useState, useEffect } from "react";
import WordleTile from "./WordleTile";
import "../styles/WordleGame.css";

import PossibleWords from "./PossibleWords";      // list of words that can be the actual word
import GuessableWords from "./GuessableWords";    // list of words that can be guessed

// finding a random index to pick a word from the list of possible words
let wordIndex = Math.floor(Math.random() * PossibleWords.length);
let theWord = PossibleWords[wordIndex];

let guesses = 0;  // holds the number of valid guesses made by the user
let theGuess = "";  // holds valid guesses made by the user to check for correctness

// guessList array holds the valid guesses that are made by the user
let guessList = ["", "", "", "", "", ""];

/* presenceList array holds the presence of each letter of each guess made by the user
  "tile-correct" = the word is present and in the correct spot 
  "tile-present" = the word is present, but in the wrong spot 
  "tile-absent" = the word is absent from the word entirely
*/
let presenceList = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

let isGameOver = false; // flag to check if the game is over (the player guesses the correct word OR the player lost on guesses)

function WordleGame() {
  
  const [userInput, setUserInput] = useState("");   // holds the user's input until the user presses enter

  // check whether the guess is valid (5 letters? an actual word?).
  const checkGuessValidity = () => {
    
    if (isGameOver) // if isGameOver is true, do not allow another guess to be made
    {
      return;
    }

    if (userInput.length !== 5) // make sure the guess is 5 letters
    {
      console.log("Error. Input is " + userInput.length + " character(s). It should be 5.");
    }
    else if (!GuessableWords.includes(userInput)) // make sure the guess is in the list of guessable words
    {      
      console.log("Error. The word " + userInput + " is not in our word list.");
    }
    else // if both of the above conditions are met, the guess is valid. Do the following:
    {
      theGuess = userInput;             // initialize theGuess as userInput
      guessList[guesses] = theGuess;    // save guess into guessList
      guesses++;                        // increment guesses counter
      setUserInput("");                 // empty userInput
      checkGuessCorrectness();          // call the checkGuessCorrectness function
    }
  };

  // check the guess against the real word.
  const checkGuessCorrectness = () => {
    
    // arrays to fill in the number of times each letter appears in theWord and theGuess later on
    let theWordLetters = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    let theGuessLetters = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    // initialize each letter as a grey letter (tile-absent), to be changed to yellow (tile-present) or green (tile-correct) in upcoming logic
    let letters = ["tile-absent", "tile-absent", "tile-absent", "tile-absent", "tile-absent",];

    for (let i = 0; i < 5; i++) // fill in the arrays for counting the letters in theWord and theGuess
    {
      theWordLetters[theWord.charCodeAt(i) - "a".charCodeAt(0)]++;
      theGuessLetters[theGuess.charCodeAt(i) - "a".charCodeAt(0)]++;
    }

    for (let i = 0; i < 5; i++) // For each letter in the guess...
    {
      // If that letter exists in the actual word and it is in the correct position, set the letter to green
      if (theGuess.charAt(i) === theWord.charAt(i))
      {
        letters[i] = "tile-correct";
        theWordLetters[theWord.charCodeAt(i) - "a".charCodeAt(0)]--;
      }
    }

    for (let i = 0; i < 5; i++) // For each letter in the guess...
    {
      if (letters[i] !== "tile-correct") // If the letter isn't green...
      {
        for (let j = 0; j < 5; j++) // If the letter meets the conditions to be yellow, set the letter to yellow.
        {
          if (theGuess.charAt(i) === theWord.charAt(j) && theWordLetters[theWord.charCodeAt(j) - "a".charCodeAt(0)] !== 0)
          {
            letters[i] = "tile-present";
            theWordLetters[theWord.charCodeAt(j) - "a".charCodeAt(0)]--;
            break;
          }
        }
      }

      console.log("\t" + theGuess.charAt(i) + ": " + letters[i]);
    }

    presenceList[guesses - 1] = letters;

    for (let i = 0; i < 5; i++)  // if any letter is not green, break. Else (all letters are green), congratulate the player for winning and set isGameOver flag to true.
    {
      if (letters[i] !== "tile-correct") 
        break;
      else if (i === 4) 
      {
        isGameOver = true;

        if (guesses === 1) 
        {
          console.log("Congratulations! The word was " + theWord + ". You got it in " + guesses + " guess!");
          return;
        }

        console.log("Congratulations! The word was " + theWord + ". You got it in " + guesses + " guesses!");
        return;
      }
    }

    // if this point is reached and guesses equals 6, tell the user they lost and set the isGameOver flag to true.
    if (guesses === 6) 
    {
      console.log("You lost. The word was " + theWord);
      isGameOver = true;
      return;
    }
    console.log("");
  };

  // reset game.
  const resetGame = () => {
    
    // come up with a new word from the list of possible words
    wordIndex = Math.floor(Math.random() * PossibleWords.length);
    theWord = PossibleWords[wordIndex];

    // reset all of the game variables to their original states
    guesses = 0;
    theGuess = "";
    guessList = ["", "", "", "", "", ""];
    presenceList = [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ];
    guesses = 0;
    isGameOver = false;
    setUserInput(" ");

    console.log("GAME RESET\n")
  }

  useEffect(() => {
    if(userInput === " ")
      setUserInput("");
  }, [userInput]);

  return (
    <div className="wordle-game">
      {/* WordleGame */}
      <div className="wordle-board">
        {/* Each row of presenceList is rendered... */}
        {presenceList.map((guess, rowNum) => (
          <div className="wordle-row">
            {/* Each tile of a row in presenceList is rendered... */}
            {presenceList[rowNum].map((tile, tileNum) => (
              /*
              
              Determines the letter to render by comparing the amount of guesses to the current row.
              
              If the row you are on represents the number of guesses then it will be populated with tiles as you type,
              If not, then the row will be populated with tiles that were submitted to the guessList.
              
              The presence of a tile is determined from its entry in presenceList, such as if the letter t is absent,
              present, or in the correct position of the correct word.
              
              */
              <WordleTile 
                letter={guesses === rowNum ? userInput.charAt(tileNum).toUpperCase() : guessList[rowNum].charAt(tileNum).toUpperCase()} 
                presence={tile}
              />
            ))}
          </div>
        ))}
      </div>

      {/* User input field */}
      <div className="wordle-text-box">
        <input type="text" value={userInput} onChange={(event) => {setUserInput(event.target.value)}} />
      </div>
      
      {/* Submit button */}
      <input type="submit" value="Submit" onClick={checkGuessValidity} />
      
      {/* Reset button */}
      <div>
        <input type="submit" value="Reset" onClick={resetGame} />
      </div>
    </div>
  );
}

export default WordleGame;
