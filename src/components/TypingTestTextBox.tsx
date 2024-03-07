import { forwardRef, useRef, useEffect, useState, KeyboardEvent } from "react";
import "./styles/TypingTestTextBox.css";

interface Props {
  words: string[];
  wordsAmount: number;
  onClick: Function;
}

const TypingTestTextBox = forwardRef<HTMLDivElement, Props>(
  ({ words, wordsAmount, onClick }: Props, ref) => {
    const cursorRef = useRef<HTMLDivElement>(null);
    let lastInputTimeStamp = 0; // For cursor blinking animation

    // Generates the string used for the typing test
    const generateRandomWordListString = (words: string[]) => {
      let wordListString = "";
      for (let i = 0; i < wordsAmount; i++) {
        const randomWordIndex = Math.floor(Math.random() * words.length);
        wordListString += words[randomWordIndex] + " ";
      }
      return wordListString.trim();
    };

    // For cursor blinking animation
    let [intervalLastInput, setIntervalLastInput] = useState(0);
    // Strings containing the contents of the typing test text box
    let [typedChars, setTypedChars] = useState("");
    let [errorChars, setErrorChars] = useState("");
    let [untypedChars, setUntypedChars] = useState(
      generateRandomWordListString(words)
    );

    const backspace = () => {
      if (errorChars.length > 0) {
        setErrorChars(errorChars.slice(0, -1));
      } else if (typedChars.length > 0) {
        setUntypedChars(typedChars[typedChars.length - 1] + untypedChars);
        setTypedChars(typedChars.slice(0, -1));
      }
    };

    const ctrlBackspace = () => {
      let allErrorCharsErased = false;
      let charCondition = (str: string, index: number) => false;
      let charConditionSet = false;

      // Handle errorChars
      if (errorChars.length > 0) {
        let errorIndex = errorChars.length - 1;

        // Condition for whether spaces or chars are being erased
        charCondition =
          errorChars[errorIndex] === " "
            ? (chars: string, index: number) => chars[index] === " "
            : (chars: string, index: number) => chars[index] !== " ";
        charConditionSet = true;

        // Erase error chars
        while (charCondition(errorChars, errorIndex) && errorIndex >= 0)
          errorIndex--;
        setErrorChars(errorChars.slice(0, errorIndex + 1));

        // Flag to specify so typedChars can also start being erased
        if (errorIndex === -1) allErrorCharsErased = true;
      }

      // Return if space/char already reached during ctrl+backspace of error chars
      if (errorChars.length > 0 && !allErrorCharsErased) return;

      // Handle typedChars
      if (typedChars.length > 0) {
        let typedIndex = typedChars.length - 1;

        // Condition for whether spaces or chars are being erased
        if (!charConditionSet)
          charCondition =
            typedChars[typedIndex] === " "
              ? (chars: string, index: number) => chars[index] === " "
              : (chars: string, index: number) => chars[index] !== " ";

        // Erase typed chars
        while (charCondition(typedChars, typedIndex) && typedIndex >= 0)
          typedIndex--;
        setUntypedChars(typedChars.slice(typedIndex + 1) + untypedChars);
        setTypedChars(typedChars.slice(0, typedIndex + 1));
      }
    };

    // Handle key presses when typing test text box is focused
    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
      setIntervalLastInput(Date.now());

      const key = event.key;

      // Handle backspace
      if (key === "Backspace") {
        if (event.ctrlKey === true) ctrlBackspace();
        else backspace();
        return;
      }

      // Ignore specific keypresses
      if (
        (untypedChars.length === 0 && errorChars.length === 0) || // No more chars to type
        key === "Dead" || // Dead keys that wait for next keystroke (Ex. ^ -> ê)
        event.ctrlKey === true || // Excludes ctrl+key
        event.altKey === true || // Excludes alt+key
        event.metaKey === true || // Excludes meta+key
        key.length !== 1 // Excludes non-letters (Ex. Shift)
      )
        return;

      // Handle typed character
      onClick(); // Emit typed char event to parent
      if (errorChars.length === 0 && key === untypedChars[0]) {
        setTypedChars(typedChars + untypedChars[0]);
        setUntypedChars(untypedChars.slice(1));
      } else {
        setErrorChars(errorChars + key);
      }
    };

    // Shows cursor
    const onFocus = () => {
      cursorRef.current!.classList.remove("not-visible");
    };

    // Hides cursor
    const onBlur = () => {
      cursorRef.current!.classList.add("not-visible");
    };

    // Background tasks
    useEffect(() => {
      const backgroundHandleCursor = setInterval(() => {
        const timeBeforeCursorAnim = 200; // In milliseconds
        const cursor = cursorRef.current;

        if (cursor === null) return;

        // Check whether to add the flashing animation to the cursor or not
        const elapsed = Date.now() - intervalLastInput;
        if (elapsed < timeBeforeCursorAnim)
          cursor.classList.remove("cursor-animation");
        else if (cursor.classList.contains("cursor-animation") === false) {
          cursor.classList.add("cursor-animation");

          // Restart animation
          cursor.style.animationName = "none";
          requestAnimationFrame(() => {
            cursor.style.animationName = "";
          });
        }
      }, 10);

      return () => {
        clearInterval(backgroundHandleCursor);
      };
    }, [intervalLastInput]);

    return (
      <div
        id="typing-test-container"
        className="d-flex"
        onKeyDown={(event) => handleKeyPress(event)}
        ref={ref}
        tabIndex={0}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <div id="typed-chars" className="char-container">
          <span className="text-primary">{typedChars}</span>
          <span id="error-chars" className="text-danger">
            {errorChars}
          </span>
        </div>
        <div id="cursor" ref={cursorRef}></div>
        <div id="untyped-chars" className="char-container">
          <span className="text-dark">{untypedChars}</span>
        </div>
      </div>
    );
  }
);

export default TypingTestTextBox;
