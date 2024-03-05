import { forwardRef, useRef, useEffect, useState, KeyboardEvent } from "react";
import "./styles/TypingTestTextBox.css";

interface Props {
  words: string[];
  wordsAmount: number;
}

const TypingTestTextBox = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { words, wordsAmount } = props; // Extract props

  // Generates the string used for the typing test
  const generateRandomWordListString = (words: string[]) => {
    let wordListString = "";
    for (let i = 0; i < wordsAmount; i++) {
      const randomWordIndex = Math.floor(Math.random() * words.length);
      wordListString += words[randomWordIndex] + " ";
    }
    return wordListString.trim();
  };

  // Handle key presses when typing test text box is focused
  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const key = event.key;

    if (key === "Backspace") {
      if (errorChars.length > 0) {
        setErrorChars(errorChars.slice(0, -1));
      } else if (typedChars.length > 0) {
        setUntypedChars(typedChars[typedChars.length - 1] + untypedChars);
        setTypedChars(typedChars.slice(0, -1));
      }
      return;
    }

    if (
      (untypedChars.length === 0 && errorChars.length === 0) ||
      key === "Dead" ||
      event.ctrlKey === true
    )
      return;

    if (key.length !== 1) return; // Excludes non-letters (Ex. Ctrl)

    if (errorChars.length === 0 && key === untypedChars[0]) {
      setTypedChars(typedChars + untypedChars[0]);
      setUntypedChars(untypedChars.slice(1));
    } else {
      setErrorChars(errorChars + key);
    }
  };

  // Strings containing the contents of the typing test text box
  let [typedChars, setTypedChars] = useState("");
  let [errorChars, setErrorChars] = useState("");
  let [untypedChars, setUntypedChars] = useState(
    generateRandomWordListString(words)
  );

  return (
    <div
      className="d-flex"
      onKeyDown={(event) => handleKeyPress(event)}
      ref={ref}
      tabIndex={0}
    >
      <div id="typed-chars" className="char-container text-primary">
        {typedChars}
      </div>

      <div id="untyped-chars" className="char-container">
        <span className="text-danger">{errorChars}</span>
        <span className="text-dark">{untypedChars}</span>
      </div>
    </div>
  );
});

export default TypingTestTextBox;
