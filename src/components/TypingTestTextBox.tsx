import {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  useContext,
} from "react";
import { TypingTestContext } from '../contexts/TypingTestContext';
import "./styles/TypingTestTextBox.css";

interface Props {
  updateStatsSignal: boolean;
  regenerateTestSignal: boolean;
  hidden: boolean;
  onKeyPress: Function;
}

const TypingTestTextBox = forwardRef<HTMLInputElement, Props>(
  (
    {
      updateStatsSignal,
      regenerateTestSignal,
      hidden,
      onKeyPress,
    }: Props,
    ref
  ) => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!, []);

    const { typedChars, errorChars, untypedChars, errorAmount, regenerateTest, setTypedChars, setErrorChars, setUntypedChars, setErrorAmount } = useContext(TypingTestContext);

    // For cursor blinking animation
    let [intervalLastInput, setIntervalLastInput] = useState(0);

    const backspace = () => {
      let syncedTypedChars = typedChars;
      if (errorChars.length > 0) {
        setErrorChars(errorChars.slice(0, -1));
      } else if (typedChars.length > 0) {
        setUntypedChars(typedChars[typedChars.length - 1] + untypedChars);
        syncedTypedChars = typedChars.slice(0, -1);
        setTypedChars(syncedTypedChars);
      }
      updateStats(syncedTypedChars, errorAmount);
    };

    const ctrlBackspace = () => {
      let allErrorCharsErased = false;
      let charCondition = (str: string, index: number) => false;
      let charConditionSet = false;
      let syncedTypedChars = typedChars;

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
        syncedTypedChars = typedChars.slice(0, typedIndex + 1);
        setTypedChars(syncedTypedChars);
      }
      updateStats(syncedTypedChars, errorAmount);
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
      let syncedTypedChars = typedChars + untypedChars[0];
      let syncedErrorAmount = errorAmount;
      if (errorChars.length === 0 && key === untypedChars[0]) {
        setTypedChars(syncedTypedChars);
        setUntypedChars(untypedChars.slice(1));
      } else {
        setErrorChars(errorChars + key);
        syncedErrorAmount++;
        setErrorAmount(syncedErrorAmount);
      }
      updateStats(syncedTypedChars, syncedErrorAmount);
    };

    // Calls parent keypress callback function, generates necessary info
    const updateStats = (
      typed: string,
      errors: number,
      startTestSignal: boolean = true
    ) => {
      let charsTypedAmount = typed.length;
      let totalCharsTypedAmount = charsTypedAmount + errors;
      let accuracy =
        totalCharsTypedAmount === 0
          ? 0
          : Math.round((charsTypedAmount / totalCharsTypedAmount) * 100);

      onKeyPress(charsTypedAmount, accuracy, startTestSignal);
    };

    // Shows cursor
    const onFocus = () => {
      cursorRef.current!.classList.remove("not-visible");
    };

    // Hides cursor
    const onBlur = () => {
      cursorRef.current!.classList.add("not-visible");
    };

    const focusTextBox = () => {
      inputRef.current?.focus();
    };

    // Cursor handler
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

    // Regenerate test
    useEffect(() => {
      regenerateTest();
      setTypedChars("");
      setErrorChars("");
      setErrorAmount(0);
    }, [regenerateTestSignal]);

    useEffect(() => {
      updateStats(typedChars, errorAmount, false);
    }, [updateStatsSignal]);

    return (
      <div
        id="typing-test-container"
        className={hidden ? "display-none" : ""}
        onClick={focusTextBox}
      >
        <div id="typed-chars" className="char-container">
          <span className="text-primary">{typedChars}</span>
          <span id="error-chars" className="text-danger">
            {errorChars}
          </span>
        </div>
        <div id="cursor" ref={cursorRef}></div>
        <div id="untyped-chars" className="char-container">
          <span>{untypedChars}</span>
        </div>
        <input
          ref={inputRef}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={(event) => handleKeyPress(event)}
          id="focusable-input"
        ></input>
      </div>
    );
  }
);

export default TypingTestTextBox;
