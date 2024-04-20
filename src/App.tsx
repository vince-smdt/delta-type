import { useState, useRef, useEffect } from "react";
import RestartButton from "./components/RestartButton";
import TimeButton from "./components/TimeButton";
import TypingTestStats from "./components/TypingTestStats";
import TypingTestTextBox from "./components/TypingTestTextBox";
import TypingTestTimer from "./components/TypingTestTimer";
import "./App.css";

function App() {
  let [testDuration, setTestDuration] = useState(60);
  let [testStartTime, setTestStartTime] = useState(Date.now());
  let [testInProgress, setTestInProgress] = useState(false);
  let [testFinished, setTestFinished] = useState(false);
  let [testWPM, setTestWPM] = useState(0);
  let [testCharsTyped, setTestCharsTyped] = useState(0);
  let [testAccuracy, setTestAccuracy] = useState(0);

  const words = ["test", "hello", "world", "testing", "typing"];
  const length = 10000;
  const textBoxRef = useRef<HTMLDivElement>(null); // TypingTestTextBox ref

  const handleKeyPress = (event: KeyboardEvent) => {
    textBoxRef.current!.focus();
  };

  const handleTypingTestKeyPress = (
    wordsTyped: number,
    charsTyped: number,
    accuracy: number
  ) => {
    if (testInProgress === false) startTest();
    let testSecondsElapsed = (Date.now() - testStartTime) / 1000;
    let wpm = Math.round((wordsTyped * 60) / testSecondsElapsed);
    setTestWPM(wpm);
    setTestCharsTyped(charsTyped);
    setTestAccuracy(accuracy);
  };

  const changeTestDuration = (durationInSeconds: number) => {
    setTestDuration(durationInSeconds);
  };

  const startTest = () => {
    setTestInProgress(true);
    setTestStartTime(Date.now());
  };

  const stopTest = () => {
    setTestInProgress(false);
    setTestFinished(true);
  };

  const restartTest = () => {
    setTestInProgress(false);
    setTestFinished(false);
  };

  useEffect(() => {
    // Auto-focus typing test text box
    textBoxRef.current!.focus();

    // Every key press auto-focuses on the text box
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div id="global-box">
      {!testInProgress && !testFinished && (
        <div id="time-buttons">
          <TimeButton time={10} timeUnit="sec" onClick={changeTestDuration} />
          <TimeButton time={30} timeUnit="sec" onClick={changeTestDuration} />
          <TimeButton time={1} timeUnit="min" onClick={changeTestDuration} />
          <TimeButton time={3} timeUnit="min" onClick={changeTestDuration} />
          <TimeButton time={5} timeUnit="min" onClick={changeTestDuration} />
        </div>
      )}
      {(testInProgress || testFinished) && (
        <TypingTestStats
          wpm={testWPM}
          charsTyped={testCharsTyped}
          accuracy={testAccuracy}
        />
      )}
      <TypingTestTimer
        duration={testDuration}
        testStarted={testInProgress}
        startTime={testStartTime}
        onFinish={stopTest}
      />
      {!testFinished && (
        <TypingTestTextBox
          ref={textBoxRef}
          words={words}
          wordsAmount={length}
          testInProgress={testInProgress}
          testFinished={testFinished}
          onKeyPress={handleTypingTestKeyPress}
        />
      )}
      <RestartButton onClick={restartTest} />
    </div>
  );
}

export default App;
