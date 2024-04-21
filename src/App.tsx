import { useState, useRef, useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import RestartButton from "./components/RestartButton";
import TimeButton from "./components/TimeButton";
import TypingTestStats from "./components/TypingTestStats";
import TypingTestTextBox from "./components/TypingTestTextBox";
import TypingTestTimer from "./components/TypingTestTimer";
import _100mostCommonEnglishWords from "./data/100mostCommonEnglishWords";
import _1000mostCommonEnglishWords from "./data/100mostCommonEnglishWords";
import "./App.css";

function App() {
  let [testDuration, setTestDuration] = useState(60);
  let [testStartTime, setTestStartTime] = useState(Date.now());
  let [testInProgress, setTestInProgress] = useState(false);
  let [testFinished, setTestFinished] = useState(false);
  let [testWPM, setTestWPM] = useState(0);
  let [testCharsTyped, setTestCharsTyped] = useState(0);
  let [testAccuracy, setTestAccuracy] = useState(0);

  const words = _1000mostCommonEnglishWords;
  const length = 10000;
  const textBoxRef = useRef<HTMLDivElement>(null); // TypingTestTextBox ref

  const handleKeyPress = (event: KeyboardEvent) => {
    textBoxRef.current?.focus();

    if (event.key === " ") {
      event.preventDefault();
    }
  };

  const handleTypingTestKeyPress = (charsTyped: number, accuracy: number) => {
    if (testInProgress === false) startTest();
    let testMinutesElapsed = (Date.now() - testStartTime) / 60000;
    let wpm = Math.round(charsTyped / (6 * testMinutesElapsed));
    setTestWPM(wpm);
    setTestCharsTyped(charsTyped);
    setTestAccuracy(accuracy);
  };

  const changeTestDuration = (durationInSeconds: number) => {
    setTestDuration(durationInSeconds);

    // Auto-focus typing test text box
    textBoxRef.current?.focus();
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

    // Auto-focus typing test text box
    textBoxRef.current?.focus();
  };

  useEffect(() => {
    // Auto-focus typing test text box
    textBoxRef.current?.focus();

    // Every key press auto-focuses on the text box
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div>
      <Header />
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
            testFinished={testFinished}
          />
        )}
        {!testFinished && (
          <TypingTestTimer
            duration={testDuration}
            testStarted={testInProgress}
            startTime={testStartTime}
            onFinish={stopTest}
          />
        )}
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
      <Footer />
    </div>
  );
}

export default App;
