import { useState, useRef, useEffect, useContext, useMemo } from "react";
import { useCookies } from "react-cookie";
import useTimer from "./hooks/useTimer";
import Footer from "./components/Footer";
import Header from "./components/Header";
import RestartButton from "./components/RestartButton";
import TimeButton from "./components/TimeButton";
import TypingTestStats from "./components/TypingTestStats";
import TypingTestTextBox from "./components/TypingTestTextBox";
import TypingTestTimer from "./components/TypingTestTimer";
import WordListButton from "./components/WordListButton";
import {
  wordListOptions,
  timeOptions,
  DEFAULT_WORD_LIST_OPTION_ID,
  DEFAULT_TIME_OPTION_ID
} from "./TestOptions";
import { TypingTestContext } from './contexts/TypingTestContext';
import "./App.css";

function App() {
  let [updateStatsSignal, setUpdateStatsSignal] = useState(false);
  let [selectedTimeButtonId, setSelectedTimeButtonId] = useState(DEFAULT_TIME_OPTION_ID);
  let [selectedWordListButtonId, setSelectedWordListButtonId] = useState(DEFAULT_WORD_LIST_OPTION_ID);

  let [cookies, setCookie] = useCookies();

  const appBoxRef = useRef<HTMLDivElement>(null);
  const textBoxRef = useRef<HTMLInputElement>(null); // TypingTestTextBox ref

  const {
    typedChars,
    testState,
    totalCharsTyped,
    errorAmount,
    setWordList,
    setTestState,
    regenerateTest
  } = useContext(TypingTestContext);

  const stopTest = () => {
    setUpdateStatsSignal(!updateStatsSignal);
    setTestState("finished");
  };

  const {
    startTime,
    startTimer,
    restartTimer,
    setTimerDurationInSeconds,
    getTimeLeftString
  } = useTimer(stopTest);

  const wpm = useMemo(() => {
    const AVERAGE_CHARS_TYPED_PER_SECOND = 6;
    const FIRST_KEY_PRESS_WPM_ADJUSTMENT = 1 / (60*5);
    let testMinutesElapsed = (Date.now() - startTime) / 60000;
    if (testMinutesElapsed === 0) testMinutesElapsed += FIRST_KEY_PRESS_WPM_ADJUSTMENT;
    return Math.round(typedChars.length / (AVERAGE_CHARS_TYPED_PER_SECOND * testMinutesElapsed));
  }, [typedChars, updateStatsSignal])

  const accuracy = useMemo(() => {
    const totalKeypresses = typedChars.length + errorAmount;
    return totalKeypresses === 0
      ? 0
      : Math.round((typedChars.length / totalKeypresses) * 100);
  }, [typedChars, errorAmount, updateStatsSignal]);

  const handleKeyPress = (event: KeyboardEvent) => {
    textBoxRef.current?.focus();
    if (event.key === " ") event.preventDefault();
  };

  const startTest = () => {
    setTestState("inProgress");
    startTimer();
  };

  const restartTest = () => {
    regenerateTest();
    restartTimer();
    setTestState("ready");
    textBoxRef.current?.focus();
  };

  const toggleDarkMode = () => {
    let darkMode = appBoxRef.current?.classList.toggle("dark-mode");
    setCookie("darkMode", darkMode);
  };

  const setDarkMode = (darkMode: boolean) => {
    appBoxRef.current?.classList.toggle("dark-mode", darkMode);
    setCookie("darkMode", darkMode);
  };

  const handleSelectedWordListButtonId = (id: number) => {
    setSelectedWordListButtonId(id);
    // If clicking on the same button repeatedly, test will regenerate once.
    // If clicking on a different word list button, test will regenerate twice (once here, and another time in the useEffect that captures the selectedWordListButtonId state).
    // We allow this for code simplicity sake (since we still want the test to regenerate when clicking on the same button). It doesn't seem to cause any performance issues.
    regenerateTest();
    textBoxRef.current?.focus();
  }

  const handleSelectedTimeButtonId = (id: number) => {
    setSelectedTimeButtonId(id);
    textBoxRef.current?.focus();
  }

  useEffect(() => {
    // Auto-focus typing test text box
    textBoxRef.current?.focus();

    // Read/Set cookie values
    if (cookies.selectedTimeId === undefined) {
      setCookie("selectedTimeId", DEFAULT_TIME_OPTION_ID);
      setSelectedTimeButtonId(DEFAULT_TIME_OPTION_ID);
    } else setSelectedTimeButtonId(cookies.selectedTimeId);

    if (cookies.selectedWordListId === undefined) {
      setCookie("selectedWordListId", DEFAULT_WORD_LIST_OPTION_ID);
      setSelectedWordListButtonId(DEFAULT_WORD_LIST_OPTION_ID);
    } else setSelectedWordListButtonId(cookies.selectedWordListId);

    if (cookies.darkMode === undefined) {
      setCookie("darkMode", false);
      setDarkMode(false);
    } else setDarkMode(cookies.darkMode);

    // Every key press auto-focuses on the text box
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    const wordListOption = wordListOptions[selectedWordListButtonId];
    regenerateTest();
    setWordList(wordListOption.wordList);
    setCookie("selectedWordListId", selectedWordListButtonId);
  }, [selectedWordListButtonId]);

  useEffect(() => {
    const timeOption = timeOptions[selectedTimeButtonId];
    setTimerDurationInSeconds(timeOption.time * (timeOption.timeUnit === "min" ? 60 : 1));
    setCookie("selectedTimeId", selectedTimeButtonId);
  }, [selectedTimeButtonId]);

  useEffect(() => {
    // Auto-focus typing test text box
    textBoxRef.current?.focus();
  }, [testState]);

  useEffect(() => {
    if (testState === "ready" && totalCharsTyped > 0) startTest();
  }, [totalCharsTyped]);

  return (
    <div ref={appBoxRef}>
      <Header onClickDarkMode={toggleDarkMode} />
      <div id="global-box">
        {testState === "ready" && (
          <>
            <div id="word-list-buttons">
              {Object.entries(wordListOptions).map(([id, option]) => (
                <WordListButton
                  key={id}
                  id={Number(id)}
                  bigText={option.name}
                  smallText={option.description}
                  selectedId={selectedWordListButtonId}
                  onClick={() => handleSelectedWordListButtonId(Number(id))}
                />
              ))}
            </div>
            <div id="time-buttons">
              {Object.entries(timeOptions).map(([id, option]) => (
                <TimeButton
                  key={id}
                  id={Number(id)}
                  time={option.time}
                  timeUnit={option.timeUnit}
                  selectedId={selectedTimeButtonId}
                  onClick={() => handleSelectedTimeButtonId(Number(id))}
                />
              ))}
            </div>
          </>
        )}
        {(testState === "inProgress" || testState === "finished") && (
          <TypingTestStats
            wpm={wpm}
            charsTyped={totalCharsTyped}
            accuracy={accuracy}
            testFinished={(testState === "finished")}
          />
        )}
        {testState !== "finished" && (
          <TypingTestTimer
            timeLeftString={getTimeLeftString()}
          />
        )}
        <TypingTestTextBox
          ref={textBoxRef}
          hidden={(testState === "finished")}
        />
        <RestartButton onClick={restartTest} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
