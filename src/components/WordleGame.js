import React from "react";
import "../styles/WordleGame.css";

function WordleGame() {
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
    </div>
  );
}

export default WordleGame;
