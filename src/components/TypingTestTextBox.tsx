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

    if (untypedChars.length === 0) return;

    if (key === untypedChars[0]) {
      setTypedChars(typedChars + untypedChars[0]);
      setUntypedChars(untypedChars.slice(1));
    }
  };

  // Auto focuses the div containing the typing test
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    boxRef.current!.focus();
  });

  // Strings containing the contents of the typing test text box
  let [typedChars, setTypedChars] = useState("");
  let [untypedChars, setUntypedChars] = useState(
    generateRandomWordListString(words)
  );

  return (
    <div onKeyDown={(event) => handleKeyPress(event)} ref={boxRef} tabIndex={0}>
      <p className="text-secondary" style={{ whiteSpace: "pre" }}>
        {typedChars}
      </p>
      <p className="text-dark" style={{ whiteSpace: "pre" }}>
        {untypedChars}
      </p>
    </div>
  );
};

export default TypingTestTextBox;
