import React, { useState, useEffect } from "react";
import WordleTile from "./WordleTile";
import "../styles/WordleGame.css";

import PossibleWords from "./PossibleWords";      // list of words that can be the actual word
import GuessableWords from "./GuessableWords";    // list of words that can be guessed

// finding a random index to pick a word from the list of possible words
let wordIndex = Math.floor(Math.random() * PossibleWords.length);
let theWord = PossibleWords[wordIndex];

let keyButtons = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["ENTER", "z", "x", "c", "v", "b", "n", "m", "<----------"]
];

let isGameOver = false; // flag to check if the game is over (the player guesses the correct word OR the player lost on guesses)

function WordleGame() {
  const [guesses, setGuesses] = useState(0);  // holds the number of valid guesses made by the user

  const [theGuess, setTheGuess] = useState("");  // holds valid guesses made by the user to check for correctness

  // guessList array holds the valid guesses that are made by the user
  const [guessList, setGuessList] = useState(["", "", "", "", "", ""]);

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
  //a   b   c   d   e   f   g   h   i   j   k   l   m   n   o   p   q   r   s   t   u   v   w   x   y   z
  const [usedLetters, setUsedLetters] = useState(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);

  const [userInput, setUserInput] = useState("");   // holds the user's input until the user presses enter

  const [dummy, setDummy] = useState(0) // a useState hook used solely to force rerenders when needed.

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
    else if (!(GuessableWords.includes(userInput) || PossibleWords.includes(userInput))) // make sure the guess is in the list of guessable words
    {
      console.log("Error. The word " + userInput + " is not in our word list.");
    }
    else // if both of the above conditions are met, the guess is valid. Do the following:
    {
      setTheGuess(userInput);           // initialize theGuess as userInput
      setGuesses(guesses + 1);          // increment guesses counter
      setUserInput("");                 // empty userInput
    }
  };

  useEffect(() => {
    var arr = guessList
    arr[guesses - 1] = theGuess
    setGuessList(arr);    // save guess into guessList
    checkGuessCorrectness();          // call the checkGuessCorrectness function
    setDummy(dummy + 1)
  }, [guesses]);

  // check the guess against the real word.
  const checkGuessCorrectness = () => {

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
        var arr = usedLetters
        arr[theGuess.charCodeAt(i) - "a".charCodeAt(0)] = "letter-correct"
        setUsedLetters(arr);
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
                var arr = usedLetters;
                arr[theGuess.charCodeAt(i) - "a".charCodeAt(0)] = "letter-present"
                return arr
              })
            }
            break;
          }
          else if (usedLetters[theGuess.charCodeAt(i) - "a".charCodeAt(0)] === "") {
            setUsedLetters(usedLetters => {
              var arr = usedLetters;
              arr[theGuess.charCodeAt(i) - "a".charCodeAt(0)] = "letter-absent"
              return arr
            })
          }
        }
      }
    }
    setPresenceList(presenceList => {
      var arr = presenceList;
      arr[guesses - 1] = letters
      return arr
    })

    for (let i = 0; i < 5; i++)  // if any letter is not green, break. Else (all letters are green), congratulate the player for winning and set isGameOver flag to true.
    {
      if (letters[i] !== "tile-correct")
        break;
      else if (i === 4) {
        isGameOver = true;

        if (guesses === 1) {
          console.log("Congratulations! The word was " + theWord + ". You got it in " + guesses + " guess!");
          return;
        }

        console.log("Congratulations! The word was " + theWord + ". You got it in " + guesses + " guesses!");
        return;
      }
    }

    // if this point is reached and guesses equals 6, tell the user they lost and set the isGameOver flag to true.
    if (guesses === 6) {
      console.log("You lost. The word was " + theWord);
      isGameOver = true;
      return;
    }
  };

  // reset game.
  const resetGame = () => {

    console.log("GAME RESET. The word was " + theWord + ".\n")

    // come up with a new word from the list of possible words
    wordIndex = Math.floor(Math.random() * PossibleWords.length);
    theWord = PossibleWords[wordIndex];

    // reset all of the game variables to their original states
    setGuesses(0);
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
  }

  const updateUserInput = (key) => {
    if (key.charAt(0) === "<") {
      let newInput = "";
      for (let i = 0; i < userInput.length; i++) {
        if (i !== userInput.length - 1)
          newInput += userInput.charAt(i);
      }

      setUserInput(newInput);
    }
    else if (userInput.length < 5 && ((key.charAt(0) >= "a" && key.charAt(0) <= "z") || (key.charAt(0) >= "A" && key.charAt(0) <= "Z")))
      setUserInput(userInput + key)
  }

  const updateKeyButtons = (key) => {
    useEffect(() => {
      var arr = usedLetters
      arr[key - "a".charCodeAt(0)] = usedLetters[key - "a".charCodeAt(0)];
      setUsedLetters(arr);
    }, []);

    return usedLetters[key.charCodeAt(0) - "a".charCodeAt(0)];
  }

  const handleEnterButton = () => {
    return (
      <button onClick={() => checkGuessValidity()}>
        <div className={"enter"}>{"ENTER"}</div>
      </button>
    )
  }

  const handleWordleBoard = () => {
    return (
      <div className="wordle-board">
        {/* Each row of presenceList is rendered... */}
        {presenceList.map((guess, rowNum) => (
          <div className="wordle-row">
            {/* Each tile of a row in presenceList is rendered... */}
            {presenceList[rowNum].map((tile, tileNum) => {
              /*
              
              Determines the letter to render by comparing the amount of guesses to the current row.
              
              If the row you are on represents the number of guesses then it will be populated with tiles as you type,
              If not, then the row will be populated with tiles that were submitted to the guessList.
              
              The presence of a tile is determined from its entry in presenceList, such as if the letter t is absent,
              present, or in the correct position of the correct word.
              
              */
              return <WordleTile
                letter={guesses === rowNum ? userInput.charAt(tileNum).toUpperCase() : guessList[rowNum].charAt(tileNum).toUpperCase()}
                presence={tile}
              />
            })}
          </div>
        ))}
      </div>
    )
  }

  useEffect(() => {
    const keyPressed = (e) => {
      if (e.key.toLowerCase() === "enter")
        checkGuessValidity();
      else if (e.key.toLowerCase() === "backspace")
        updateUserInput("<");
      else if (e.key.length === 1)
        updateUserInput(e.key.toLowerCase());
    };
    handleEnterButton();
    handleWordleBoard()
    document.addEventListener('keydown', keyPressed, true);
    return () => document.removeEventListener('keydown', keyPressed, true);
  }, [userInput]);

  return (
    <div className="wordle-game">
      {/* WordleGame */}
      {handleWordleBoard()}

      {/* Keyboard buttons */}
      <div className="keyboard">
        {/* Each row of presenceList is rendered... */}
        {keyButtons.map((row, rowNum) => (
          <div className="keyboard-row">
            {keyButtons[rowNum].map((key) => (
              <div className={"keyboard-button " + updateKeyButtons(key)}>
                {(key === "ENTER") ? handleEnterButton() :
                  <button onClick={() => (updateUserInput(key))}>
                    <div className={key}>{key.toUpperCase()}</div>
                  </button>}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Reset button */}
      <div className="wordle-text-box">
        <input type="submit" value="Reset" onClick={resetGame} />
      </div>


    </div>
  );
}

export default WordleGame;
