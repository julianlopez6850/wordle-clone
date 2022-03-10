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
let isGameOver = false;

function WordleGame() {

  //const [isValid, setIsValid] = useState();

  let isValid = false;

  const [userInput, setUserInput] = useState("");

  const getUserInput = () => {
    //console.log(userInput);
    //console.log(guesses);
  }

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
      guesses++;
      checkGuessCorrectness();
    }
  }

  const checkGuessCorrectness = () => {   // check the guess against the real word.
    
    // initialize theGuess as userInput
    let theGuess = userInput;
    
    // arrays to fill in the number of times each letter appears in theWord and theGuess later on
    let theWordLetters = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let theGuessLetters = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // initialize each letter as a grey letter, to be changed to yellow or green in upcoming logic
    let letters = ["grey", "grey", "grey", "grey", "grey"];
    
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
        letters[i] = "green";
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
        if(letters[i] !== ("green"))     // If the letter isn't green...
        {
            for(let j = 0; j < 5; j++)  // If the letter meets the conditions to be yellow, set the letter to yellow.
            {
              if(theGuess.charAt(i) === theWord.charAt(j) && theWordLetters[theWord.charCodeAt(j) - 'a'.charCodeAt(0)] !== 0)
              {
                  letters[i] = "yellow";
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

    for(let i = 0; i < 5; i++)      // if any letter is not green, break. Else (all letters are green), congratulate the player for winning and set isGameOver flag to true.
    {
        if(letters[i] !== "green")
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

    console.log("")

  }

  useEffect(() => {
    getUserInput();
  }, [userInput]);

  return (
    <div className="wordle-game">
      {/* WordleGame */}
      <div className="wordle-board">
        <div className="wordle-row">
          <div className="wordle-tile">
            <div className="tile-present">A</div>
          </div>
          <div className="wordle-tile">
            <div className="tile-absent">A</div>
          </div>
          <div className="wordle-tile">
            <div className="tile-absent">A</div>
          </div>
          <div className="wordle-tile">
            <div className="tile-correct">A</div>
          </div>
          <div className="wordle-tile">
            <div className="tile-absent">A</div>
          </div>
        </div>
        <div className="wordle-row">
          <div className="wordle-tile">
            <div className="tile-absent">B</div>
          </div>
          <div className="wordle-tile">
            <div className="tile-correct">B</div>
          </div>
          <div className="wordle-tile">
            <div className="tile-absent">B</div>
          </div>
          <div className="wordle-tile">
            <div className="tile-correct">B</div>
          </div>
          <div className="wordle-tile">
            <div className="tile-present">B</div>
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

        <input type="text" onChange={(event) => {
          setUserInput(event.target.value);
        }} />
        <input type="submit" value="Submit" onClick = {checkGuessValidity} />
    </div>
  );
}

export default WordleGame;
