import React from "react";

function WordleTile(props) {
  return (
    <div className="wordle-tile">
      <div className={props.presence}>{props.letter}</div>
    </div>
  );
}

export default WordleTile;
