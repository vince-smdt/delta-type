import { useRef, useEffect } from "react";
import TypingTestTextBox from "./components/TypingTestTextBox";
import TypingTestTimer from "./components/TypingTestTimer";
import TimeButton from "./components/TimeButton";
import "./App.css";

function App() {
  const words = ["test", "hello", "world", "testing", "typing"];
  const length = 10;
  const textBoxRef = useRef<HTMLDivElement>(null); // TypingTestTextBox ref

  const handleKeyPress = (event: KeyboardEvent) => {
    textBoxRef.current!.focus();
  };

  useEffect(() => {
    textBoxRef.current!.focus();

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });

  return (
    <div id="global-box">
      <div id="time-buttons">
        <TimeButton time={1} timeUnit="min" />
        <TimeButton time={3} timeUnit="min" />
        <TimeButton time={5} timeUnit="min" />
        <TimeButton time={10} timeUnit="min" />
      </div>
      <TypingTestTimer />
      <TypingTestTextBox ref={textBoxRef} words={words} wordsAmount={length} />
    </div>
  );
}

export default App;
