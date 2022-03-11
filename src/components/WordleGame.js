import React, {useState, useEffect} from "react";
import "../styles/WordleGame.css";

import PossibleWords from "./PossibleWords";
import GuessableWords from "./GuessableWords";


// finding a random index to pick a word from the list of possible words
let wordIndex = Math.floor(Math.random() * ((PossibleWords.length)));
//console.log(wordIndex);
let theWord = PossibleWords[wordIndex];
//console.log(theWord);

let guesses = 0;
let theGuess = "";
let guessList = ["", "", "", "", "", ""];
let colorsList = [["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]]

let isGameOver = false;

function WordleGame() {

  //const [isValid, setIsValid] = useState();

  let isValid = false;

  const [userInput, setUserInput] = useState("");

  const checkGuessValidity = () => {  // check whether the guess is valid (5 letters? an actual word?).

    if(isGameOver)
    {
      return;
    }

    if(userInput.length !== 5) // make sure the guess is 5 letters
    {
      console.log("Error. Input is " + userInput.length + " character(s). It should be 5.");
      isValid = false;
    }
    else if(!GuessableWords.includes(userInput))  // make sure the guess is in the list of guessable words
    {
      console.log("Error. The word " + userInput + " is not in our word list.");
      isValid = false;
    }
    else
    {
      isValid = true;
    }

    //console.log(isValid);

    if(isValid) // if the guess is valid, increment guesses and call the checkGuessCorrectness function
    {
      theGuess = userInput;
      guessList[guesses] = theGuess;
      guesses++;
      setUserInput("");
      checkGuessCorrectness();
    }
  }

  const checkGuessCorrectness = () => {   // check the guess against the real word.
    
    // arrays to fill in the number of times each letter appears in theWord and theGuess later on
    let theWordLetters = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let theGuessLetters = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // initialize each letter as a grey letter (tile-absent), to be changed to yellow (tile-present) or green (tile-correct) in upcoming logic
    let letters = ["tile-absent", "tile-absent", "tile-absent", "tile-absent", "tile-absent"];
    
    for(let i = 0; i < 5; i++)  // fill in the arrays for counting the letters in theWord and theGuess
    {
      //console.log(theWord.charAt(i))
      //console.log(theGuess.charAt(i))

      //console.log(theWord.charCodeAt(i) - 'a'.charCodeAt(0))
      //console.log(theGuess.charCodeAt(i) - 'a'.charCodeAt(0))

      theWordLetters[theWord.charCodeAt(i) - 'a'.charCodeAt(0)]++;
      theGuessLetters[theGuess.charCodeAt(i) - 'a'.charCodeAt(0)]++;
    }

    /*
    //=================== DEBUG STUFF ===================
    
    for(let i = 0; i < 26; i ++)
        console.log(theWordLetters[i] + " ");
    
    for(let i = 0; i < 26; i ++)
        console.log(theGuessLetters[i] + " ");
    
    
    //===================================================
    //*/

    for(let i = 0; i < 5; i++)  // For each letter in the guess...
    {
      if(theGuess.charAt(i) === theWord.charAt(i)) // If that letter exists in the actual word and is in the correct position, set the letter to green 
      {
        letters[i] = "tile-correct";
        theWordLetters[theWord.charCodeAt(i) - 'a'.charCodeAt(0)]--;
      }

      /*
      //=================== DEBUG STUFF ===================
      
      console.log("\t" + theGuess.charAt(i) + ": " + letters[i]);
      
      for(let k = 0; k < 26; k ++)
      console.log(theWordLetters[k] + " ");


      for(let k = 0; k < 26; k ++)
      console.log(theGuessLetters[k] + " ");
      
      //===================================================
      //*/
    }

    for(let i = 0; i < 5; i++)      // For each letter in the guess...
    {
        if(letters[i] !== ("tile-correct"))     // If the letter isn't green...
        {
            for(let j = 0; j < 5; j++)  // If the letter meets the conditions to be yellow, set the letter to yellow.
            {
              if(theGuess.charAt(i) === theWord.charAt(j) && theWordLetters[theWord.charCodeAt(j) - 'a'.charCodeAt(0)] !== 0)
              {
                  letters[i] = "tile-present";
                  theWordLetters[theWord.charCodeAt(j) - 'a'.charCodeAt(0)]--;
                  break;
              }
            }
        }

        console.log("\t" + theGuess.charAt(i) + ": " + letters[i]);

        /*
        //=================== DEBUG STUFF ===================
        
        for(let k = 0; k < 26; k ++)
            console.log(theWordLetters[k] + " ");

        for(let k = 0; k < 26; k ++)
          console.log(theGuessLetters[k] + " ");
        
        //===================================================
        //*/
    }

    colorsList[guesses - 1] = letters;

    for(let i = 0; i < 5; i++)      // if any letter is not green, break. Else (all letters are green), congratulate the player for winning and set isGameOver flag to true.
    {
        if(letters[i] !== "tile-correct")
            break;
        else if(i === 4)
        {
          isGameOver = true;

          if(guesses === 1)
          {
            console.log("Congratulations! The word was " + theWord + ". You got it in " + guesses + " guess!");
            return;
          }
          
          console.log("Congratulations! The word was " + theWord + ". You got it in " + guesses + " guesses!");
          return;
        }
    }
    
    if(guesses === 6)                // if this point is reached and guesses equals 6, tell the user they lost and set the isGameOver flag to true.
    {
        console.log("You lost. The word was " + theWord);
        isGameOver = true;
        return;
    }

    //console.log(guessList);
    
    //for(let i = 0; i < 6; i++) console.log(colorsList[i])
    
    console.log("")

  }

  return (
    <div className="wordle-game">
      {/* WordleGame */}
      <div className="wordle-board">
        <div className="wordle-row">
          <div className="wordle-tile">
            <div className={colorsList[0][0]}>{guesses === 0 ? userInput.charAt(0) : guessList[0].charAt(0)}</div>
          </div>
          <div className="wordle-tile">
            <div className={colorsList[0][1]}>{guesses === 0 ? userInput.charAt(1) : guessList[0].charAt(1)}</div>
          </div>
          <div className="wordle-tile">
            <div className={colorsList[0][2]}>{guesses === 0 ? userInput.charAt(2) : guessList[0].charAt(2)}</div>
          </div>
          <div className="wordle-tile">
            <div className={colorsList[0][3]}>{guesses === 0 ? userInput.charAt(3) : guessList[0].charAt(3)}</div>
          </div>
          <div className="wordle-tile">
            <div className={colorsList[0][4]}>{guesses === 0 ? userInput.charAt(4) : guessList[0].charAt(4)}</div>
          </div>
        </div>
        <div className="wordle-row">
          <div className="wordle-tile">
            <div className={colorsList[1][0]}>{guesses === 1 ? userInput.charAt(0) : guessList[1].charAt(0)}</div>
          </div>
          <div className="wordle-tile">
            <div className={colorsList[1][1]}>{guesses === 1 ? userInput.charAt(1) : guessList[1].charAt(1)}</div>
          </div>
          <div className="wordle-tile">
            <div className={colorsList[1][2]}>{guesses === 1 ? userInput.charAt(2) : guessList[1].charAt(2)}</div>
          </div>
          <div className="wordle-tile">
            <div className={colorsList[1][3]}>{guesses === 1 ? userInput.charAt(3) : guessList[1].charAt(3)}</div>
          </div>
          <div className="wordle-tile">
            <div className={colorsList[1][4]}>{guesses === 1 ? userInput.charAt(4) : guessList[1].charAt(4)}</div>
          </div>
        </div>
        <div className="wordle-row">
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
        </div>
        <div className="wordle-row">
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
        </div>
        <div className="wordle-row">
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
        </div>
        <div className="wordle-row">
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
          <div className="wordle-tile"></div>
        </div>
      </div>

        <input type="text" value={userInput} onChange={(event) => {
          setUserInput(event.target.value);
        }} />
        <input type="submit" value="Submit" onClick = {checkGuessValidity} />
    </div>
  );
}

export default WordleGame;
