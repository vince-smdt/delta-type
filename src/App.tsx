import { useState, useRef, useEffect } from "react";
import { useCookies } from "react-cookie";
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
import "./App.css";

function App() {
  // Test info & states
  let [testDuration, setTestDuration] = useState(60);
  let [testStartTime, setTestStartTime] = useState(Date.now());
  let [testInProgress, setTestInProgress] = useState(false);
  let [testFinished, setTestFinished] = useState(false);
  let [testWPM, setTestWPM] = useState(0);
  let [testCharsTyped, setTestCharsTyped] = useState(0);
  let [testAccuracy, setTestAccuracy] = useState(0);
  let [selectedWordList, setSelectedWordList] = useState(
    wordListOptions[DEFAULT_WORD_LIST_OPTION_ID].wordList
  );

  // Signals
  let [updateStatsSignal, setUpdateStatsSignal] = useState(false);
  let [regenerateTestSignal, setRegenerateTestSignal] = useState(false);
  let [updateTimeSignal, setUpdateTimeSignal] = useState(false);
  let [updateWordListSignal, setUpdateWordListSignal] = useState(false);

  // Selected options
  let [selectedTimeButtonId, setSelectedTimeButtonId] = useState(2);
  let [selectedWordListButtonId, setSelectedWordListButtonId] = useState(0);

  // Cookies
  let [cookies, setCookie] = useCookies();

  const length = 10000;
  const appBoxRef = useRef<HTMLDivElement>(null);
  const textBoxRef = useRef<HTMLInputElement>(null); // TypingTestTextBox ref

  const updateStats = (charsTyped: number, accuracy: number) => {
    let testMinutesElapsed = (Date.now() - testStartTime) / 60000;
    let wpm = Math.round(charsTyped / (6 * testMinutesElapsed));
    setTestWPM(wpm);
    setTestCharsTyped(charsTyped);
    setTestAccuracy(accuracy);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    textBoxRef.current?.focus();

    if (event.key === " ") {
      event.preventDefault();
    }
  };

  const handleTypingTestKeyPress = (
    charsTyped: number,
    accuracy: number,
    startTestCondition: boolean
  ) => {
    if (!testInProgress && startTestCondition) startTest();
    updateStats(charsTyped, accuracy);
  };

  const changeTestDuration = (
    durationInSeconds: number,
    buttonId: number,
    updateCookie: boolean
  ) => {
    setTestDuration(durationInSeconds);
    setSelectedTimeButtonId(buttonId);

    if (updateCookie) setCookie("selectedTimeId", buttonId);

    // Auto-focus typing test text box
    textBoxRef.current?.focus();
  };

  const changeWordList = (
    wordList: string[],
    buttonId: number,
    updateCookie: boolean
  ) => {
    setSelectedWordListButtonId(buttonId);
    setSelectedWordList(wordList);
    setRegenerateTestSignal(!regenerateTestSignal);

    if (updateCookie) setCookie("selectedWordListId", buttonId);

    // Auto-focus typing test text box
    textBoxRef.current?.focus();
  };

  const startTest = () => {
    setTestInProgress(true);
    setTestStartTime(Date.now());
  };

  const stopTest = () => {
    setUpdateStatsSignal(!updateStatsSignal);
    setTestInProgress(false);
    setTestFinished(true);
  };

  const restartTest = () => {
    setRegenerateTestSignal(!regenerateTestSignal);
    setTestInProgress(false);
    setTestFinished(false);

    // Auto-focus typing test text box
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

    // Send signals to update time and word list from cookies
    setUpdateTimeSignal(!updateTimeSignal);
    setUpdateWordListSignal(!updateWordListSignal);

    // Every key press auto-focuses on the text box
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    // Auto-focus typing test text box
    textBoxRef.current?.focus();
  }, [testFinished]);

  return (
    <div ref={appBoxRef}>
      <Header onClickDarkMode={toggleDarkMode} />
      <div id="global-box">
        {!testInProgress && !testFinished && (
          <div id="word-list-buttons">
            {Object.entries(wordListOptions).map(([id, option]) => (
              <WordListButton
                id={Number(id)}
                bigText={option.name}
                smallText={option.description}
                selectedId={selectedWordListButtonId}
                wordList={option.wordList}
                updateWordListSignal={updateWordListSignal}
                onClick={changeWordList}
              />
            ))}
          </div>
        )}
        {!testInProgress && !testFinished && (
          <div id="time-buttons">
            {Object.entries(timeOptions).map(([id, option]) => (
              <TimeButton
                id={Number(id)}
                time={option.time}
                timeUnit={option.timeUnit}
                selectedId={selectedTimeButtonId}
                updateTimeSignal={updateTimeSignal}
                onClick={changeTestDuration}
              />
            ))}
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
        <TypingTestTextBox
          ref={textBoxRef}
          words={selectedWordList}
          wordsAmount={length}
          updateStatsSignal={updateStatsSignal}
          regenerateTestSignal={regenerateTestSignal}
          hidden={testFinished}
          onKeyPress={handleTypingTestKeyPress}
        />
        <RestartButton onClick={restartTest} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
