import { useRef, useEffect, useState, KeyboardEvent } from "react";

interface Props {
  words: string[];
  wordsAmount: number;
}

const TypingTestTextBox = ({ words, wordsAmount }: Props) => {
  // Generates the string used for the typing test
  const generateRandomWordListString = (words: string[]) => {
    let wordListString = "";
    for (let i = 0; i < wordsAmount; i++) {
      const randomWordIndex = Math.floor(Math.random() * words.length);
      wordListString += words[randomWordIndex] + " ";
    }
    return wordListString;
  };

  // Handle key presses when typing test text box is focused
  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    const key = event.key;

    if (
      (untypedChars.length === 0 && errorChars.length === 0) ||
      key === "Dead"
    )
      return;

    if (key === "Backspace") {
      if (errorChars.length > 0) {
        setErrorChars(errorChars.slice(0, -1));
      } else if (typedChars.length > 0) {
        setUntypedChars(typedChars[typedChars.length - 1] + untypedChars);
        setTypedChars(typedChars.slice(0, -1));
      }
      return;
    }

    if (key.length !== 1) return;

    if (errorChars.length === 0 && key === untypedChars[0]) {
      setTypedChars(typedChars + untypedChars[0]);
      setUntypedChars(untypedChars.slice(1));
    } else {
      setErrorChars(errorChars + key);
    }
  };

  // Auto focuses the div containing the typing test
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    boxRef.current!.focus();
  });

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
      ref={boxRef}
      tabIndex={0}
    >
      <span className="text-primary" style={{ whiteSpace: "pre" }}>
        {typedChars}
      </span>
      <span className="text-danger" style={{ whiteSpace: "pre" }}>
        {errorChars}
      </span>
      <span>|</span>
      <span className="text-dark" style={{ whiteSpace: "pre" }}>
        {untypedChars}
      </span>
    </div>
  );
};

export default TypingTestTextBox;
