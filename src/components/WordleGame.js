import React, { useState, useEffect, useRef } from "react";
import WordleTile from "./WordleTile";
import "../styles/WordleGame.css";

import PossibleWords from "./PossibleWords";      // list of words that can be the actual word
import GuessableWords from "./GuessableWords";    // list of words that can be guessed

import { ToastPortal } from "./Toasts/ToastPortal.js" // Toast Portal is used to create a portal to render toast notifications on top of WordleGame

// finding a random index to pick a word from the list of possible words
let wordIndex = Math.floor(Math.random() * PossibleWords.length);
let theWord = PossibleWords[wordIndex];

// holds the rows of keys to be displayed on the on-screen keyboard
let keyButtons = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["ENTER", "z", "x", "c", "v", "b", "n", "m", "<----------"]
];

let isGameOver = false; // flag to check if the game is over (the player guesses the correct word OR the player lost on guesses)

function WordleGame() {
  const toastRef = useRef();  // holds a ref for toasts
  const [autoClose, setAutoClose] = useState(false);  // holds whether or not the created toast should auto close

  const [theGuess, setTheGuess] = useState("");  // holds valid guesses made by the user to check for correctness
  const [guessList, setGuessList] = useState(["", "", "", "", "", ""]);  // guessList array holds the valid guesses that are made by the user
  const [numGuesses, setNumGuesses] = useState(0);  // holds the number of valid guesses made by the user

  // this event listener will stop an enter press from re-firing a previously clicked button.
  window.addEventListener('keydown', function (e) {
    if ((e.keyIdentifier === 'U+000A' || e.keyIdentifier === 'Enter' || e.keyCode === 13) && e.target.nodeName !== 'BODY') {
      e.preventDefault();
      return false;
    }
  }, true);

  /* presenceList array holds the presence of each letter in each guess made by the user
    "tile-correct" = the word is present and in the correct spot 
    "tile-present" = the word is present, but in the wrong spot 
    "tile-absent" = the word is absent from the word entirely
  */
  const [presenceList, setPresenceList] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);

  /* usedLetters array holds the presence of each letter throughout all guesses made
    "letter-correct" = the word is present and in the correct spot 
    "letter-present" = the word is present, but in the wrong spot 
    "letter-absent" = the word is absent from the word entirely
  */
  //                                              a   b   c   d   e   f   g   h   i   j   k   l   m   n   o   p   q   r   s   t   u   v   w   x   y   z
  const [usedLetters, setUsedLetters] = useState(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);

  const [userInput, setUserInput] = useState(""); // holds the user's input until the user presses enter

  const [dummy, setDummy] = useState(0) // a useState hook used solely to force rerenders when needed.

  // check whether the guess is valid (5 letters? an actual word?).
  const checkGuessValidity = () => {
    if (isGameOver) // if isGameOver is true, do not allow another guess to be made
      return;
    setAutoClose(true);
    if (userInput.length !== 5) // make sure the guess is 5 letters
    {
      console.log("Error. Not enough letters.");
      addToast("info", ("Not enough letters"));
    }
    else if (!(GuessableWords.includes(userInput) || PossibleWords.includes(userInput))) // make sure the guess is in the list of guessable words
    {
      console.log("Error. The word " + userInput + " is not in our word list.");
      addToast("info", ("That is not in our word list."));
    }
    else // if both of the above conditions are met, the guess is valid. Do the following:
    {
      setTheGuess(userInput);           // initialize theGuess as userInput
      setNumGuesses(numGuesses => numGuesses + 1);          // increment guesses counter
      setUserInput("");                 // empty userInput
    }
  };

  // this useEffect will update useState variables after a user makes a valid guess
  useEffect(() => {
    // save guess into guessList
    setGuessList(guessList => {
      guessList[numGuesses - 1] = theGuess;
      return guessList;
    });
    checkGuessCorrectness();          // call the checkGuessCorrectness function
    setDummy(dummy + 1)
  }, [numGuesses]);

  // check the guess against the real word.
  const checkGuessCorrectness = () => {
    setAutoClose(false);

    // arrays to fill in the number of times each letter appears in theWord and theGuess later on
    let theWordLetters = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // initialize each letter as a grey letter (tile-absent), to be changed to yellow (tile-present) or green (tile-correct) in upcoming logic
    let letters = ["tile-absent", "tile-absent", "tile-absent", "tile-absent", "tile-absent",];

    for (let i = 0; i < 5; i++) // fill in the arrays for counting the letters in theWord and theGuess
    {
      theWordLetters[theWord.charCodeAt(i) - "a".charCodeAt(0)]++;
    }

    for (let i = 0; i < 5; i++) // For each letter in the guess...
    {
      // If that letter exists in the actual word and it is in the correct position, set the letter to green
      if (theGuess.charAt(i) === theWord.charAt(i)) {
        letters[i] = "tile-correct";
        theWordLetters[theWord.charCodeAt(i) - "a".charCodeAt(0)]--;
        setUsedLetters(usedLetters => {
          usedLetters[theGuess.charCodeAt(i) - "a".charCodeAt(0)] = "letter-correct";
          return usedLetters;
        });
      }
    }

    for (let i = 0; i < 5; i++) // For each letter in the guess...
    {
      if (letters[i] !== "tile-correct") // If the letter isn't green...
      {
        for (let j = 0; j < 5; j++) // If the letter meets the conditions to be yellow, set the letter to yellow.
        {
          if (theGuess.charAt(i) === theWord.charAt(j) && theWordLetters[theWord.charCodeAt(j) - "a".charCodeAt(0)] !== 0) {
            letters[i] = "tile-present";
            theWordLetters[theWord.charCodeAt(j) - "a".charCodeAt(0)]--;
            if (usedLetters[theGuess.charCodeAt(i) - "a".charCodeAt(0)] !== "letter-correct") {
              setUsedLetters(usedLetters => {
                usedLetters[theGuess.charCodeAt(i) - "a".charCodeAt(0)] = "letter-present";
                return usedLetters;
              })
            }
            break;
          }
        }
      }
    }
    setPresenceList(presenceList => {
      presenceList[numGuesses - 1] = letters;
      return presenceList;
    })

    for (let i = 0; i < 5; i++)  // if any letter is not green, break. Else (all letters are green), congratulate the player for winning and set isGameOver flag to true.
    {
      if (letters[i] !== "tile-correct")
        break;
      else if (i === 4) {
        isGameOver = true;

        var victoryGuesses = (numGuesses === 1) ? " guess!" : " guesses!"
        console.log("Congratulations! The word was " + theWord + ". You got it in " + numGuesses + victoryGuesses);
        addToast("win", ("Congratulations! The word was " + theWord + ". You got it in " + numGuesses + victoryGuesses));
        return;
      }
    }

    // if this point is reached and guesses equals 6, tell the user they lost and set the isGameOver flag to true.
    if (numGuesses === 6) {
      console.log("You lost. The word was " + theWord);
      addToast("lose", ("You lost. The word was " + theWord));
      isGameOver = true;
      return;
    }
  };

  // this useEffect handles coloring the on-screen keyboard buttons grey if the letter is absent.
  useEffect(() => {
    for (let i = 0; i < 5; i++) // For each letter in the guess...
    {
      if (usedLetters[theGuess.charCodeAt(i) - "a".charCodeAt(0)] === "") {
        setUsedLetters(usedLetters => {
          usedLetters[theGuess.charCodeAt(i) - "a".charCodeAt(0)] = "letter-absent";
          return usedLetters;
        })
      }
    }
    setDummy(dummy + 1);
  }, [userInput]);

  // reset game.
  const resetGame = () => {

    console.log("GAME RESET. The word was " + theWord + ".\n")

    // come up with a new word from the list of possible words
    wordIndex = Math.floor(Math.random() * PossibleWords.length);
    theWord = PossibleWords[wordIndex];

    // reset all of the game variables to their original states
    setNumGuesses(0);
    setTheGuess("");
    setGuessList(["", "", "", "", "", ""]);
    setPresenceList([
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ]);
    isGameOver = false;
    setUserInput("");
    setUsedLetters(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);

    // remove all toasts
    toastRef.current.removeToasts();
  }

  // this function will create a toast notification when called
  const addToast = (mode, message, autoClose) => {
    toastRef.current.addMessage({ mode, message, autoClose});
  }

  // this function will update the user input when called
  const updateUserInput = (key) => {
    if(!isGameOver)
    {
      if (key.charAt(0) === "<") {
        let newInput = "";
        for (let i = 0; i < userInput.length; i++) {
          if (i !== userInput.length - 1)
            newInput += userInput.charAt(i);
        }

        setUserInput(newInput);
      }
      else if (userInput.length < 5 && key.charAt(0) >= "a" && key.charAt(0) <= "z")
        setUserInput(userInput + key)
    }
  }

  // this function will update the color of the on-screen keyboard buttons after each guess
  const updateKeyButtons = (key) => {
    return usedLetters[key.charCodeAt(0) - "a".charCodeAt(0)];
  }

  // this useEffect captures keyboard inputs and handles them as necessary
  useEffect(() => {
    const keyPressed = (e) => {
      if (e.key === "Enter")
        checkGuessValidity();
      else if (e.key === "Backspace")
        updateUserInput("<");
      else if (e.key.length === 1)
        updateUserInput(e.key.toLowerCase());
    };
    document.addEventListener('keydown', keyPressed, true);
    return () => document.removeEventListener('keydown', keyPressed, true);
  }, [userInput]);

  return (
    <div className="wordle-game">

      {/* Wordle game board */}
      <div className="wordle-board">
        {/* Each row of presenceList is rendered... */}
        {presenceList.map((guess, rowNum) => (
          <div className="wordle-row">
            {/* Each tile in each row of presenceList is rendered... */}
            {presenceList[rowNum].map((tile, tileNum) => {
              /*
              Determines the letter to render by comparing the amount of guesses to the current row.
              If the row number equals the number of guesses entered, then it will be populated with tiles as userInput is updated.
              Ottherwise, the row will be populated with tiles that were previously submitted to the guessList.
              The presence of a tile is determined from its entry in presenceList, such as if the letter t is absent, present, or in the correct position of the correct word.
              */
              return <WordleTile
                letter={numGuesses === rowNum ? userInput.charAt(tileNum).toUpperCase() : guessList[rowNum].charAt(tileNum).toUpperCase()}
                presence={tile}
              />
            })}
          </div>
        ))}
      </div>

      {/* Keyboard buttons */}
      <div className="keyboard">
        {/* Each row of keyButtons is rendered... */}
        {keyButtons.map((row, rowNum) => (
          <div className="keyboard-row">
          {/* Each tile in each row of keyButtons is rendered... */}
            {keyButtons[rowNum].map((key) => (
              /*
              Render the on-screen keyboard buttons. Each button is rendered with updateKeyButtons in its className to control its color.
              If the key pressed is the ENTER key, then call checkGuessValidity(), otherwise call updateUserInput().
              */
              <div className={"keyboard-button " + updateKeyButtons(key)}>
                <button onClick={() => ((key === "ENTER") ? checkGuessValidity() : updateUserInput(key))}>
                  <div className={key}>{key.toUpperCase()}</div>
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Reset button */}
      <div className="wordle-text-box">
        <input type="submit" value="Reset" onClick={resetGame} />
      </div>

      {/* Toast notifications */}
      <ToastPortal ref={toastRef} autoClose={autoClose} />
    </div>
  );
}

export default WordleGame;
