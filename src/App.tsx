import { useState, useRef, useEffect } from "react";
import TimeButton from "./components/TimeButton";
import TypingTestStats from "./components/TypingTestStats";
import TypingTestTextBox from "./components/TypingTestTextBox";
import TypingTestTimer from "./components/TypingTestTimer";
import "./App.css";

function App() {
  let [testDuration, setTestDuration] = useState(60);
  let [testInProgress, setTestInProgress] = useState(false);

  const words = ["test", "hello", "world", "testing", "typing"];
  const length = 10;
  const textBoxRef = useRef<HTMLDivElement>(null); // TypingTestTextBox ref
  const timeButtonsRef = useRef<HTMLDivElement>(null); // TimeButton ref
  const statsRef = useRef<HTMLDivElement>(null); // TypingTestStats ref

  const handleKeyPress = (event: KeyboardEvent) => {
    textBoxRef.current!.focus();
  };

  const handleTypingTestKeyPress = () => {
    startTest();
  };

  const changeTestDuration = (durationInSeconds: number) => {
    setTestDuration(durationInSeconds);
  };

  const startTest = () => {
    setTestInProgress(true);
    timeButtonsRef.current!.classList.add("display-none");
    statsRef.current!.classList.remove("display-none");
  };

  useEffect(() => {
    // Auto-focus typing test text box
    textBoxRef.current!.focus();

    // Hide stats
    statsRef.current!.classList.add("display-none");

    // Every key press auto-focuses on the text box
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div id="global-box">
      <div ref={timeButtonsRef} id="time-buttons">
        <TimeButton time={1} timeUnit="min" onClick={changeTestDuration} />
        <TimeButton time={3} timeUnit="min" onClick={changeTestDuration} />
        <TimeButton time={5} timeUnit="min" onClick={changeTestDuration} />
        <TimeButton time={10} timeUnit="min" onClick={changeTestDuration} />
      </div>
      <TypingTestStats ref={statsRef} />
      <TypingTestTimer duration={testDuration} testStarted={testInProgress} />
      <TypingTestTextBox
        ref={textBoxRef}
        words={words}
        wordsAmount={length}
        onClick={handleTypingTestKeyPress}
      />
    </div>
  );
}

export default App;
