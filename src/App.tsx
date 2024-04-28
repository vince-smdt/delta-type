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
import _100mostCommonEnglishWords from "./data/100mostCommonEnglishWords";
import _1000mostCommonEnglishWords from "./data/100mostCommonEnglishWords";
import _javascriptKeywords from "./data/javascriptKeywords";
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
    _100mostCommonEnglishWords
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
  const textBoxRef = useRef<HTMLDivElement>(null); // TypingTestTextBox ref

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
      setCookie("selectedTimeId", 2);
      setSelectedTimeButtonId(2);
    } else setSelectedTimeButtonId(cookies.selectedTimeId);

    if (cookies.selectedWordListId === undefined) {
      setCookie("selectedWordListId", 0);
      setSelectedWordListButtonId(0);
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
            <WordListButton
              bigText="100"
              smallText="most common english words"
              id={0}
              selectedId={selectedWordListButtonId}
              wordList={_100mostCommonEnglishWords}
              updateWordListSignal={updateWordListSignal}
              onClick={changeWordList}
            />
            <WordListButton
              bigText="10000"
              smallText="most common english words"
              id={1}
              selectedId={selectedWordListButtonId}
              wordList={_1000mostCommonEnglishWords}
              updateWordListSignal={updateWordListSignal}
              onClick={changeWordList}
            />
            <WordListButton
              bigText="JavaScript"
              smallText="keywords and functions"
              id={2}
              selectedId={selectedWordListButtonId}
              wordList={_javascriptKeywords}
              updateWordListSignal={updateWordListSignal}
              onClick={changeWordList}
            />
          </div>
        )}
        {!testInProgress && !testFinished && (
          <div id="time-buttons">
            <TimeButton
              time={10}
              timeUnit="sec"
              id={0}
              selectedId={selectedTimeButtonId}
              updateTimeSignal={updateTimeSignal}
              onClick={changeTestDuration}
            />
            <TimeButton
              time={30}
              timeUnit="sec"
              id={1}
              selectedId={selectedTimeButtonId}
              updateTimeSignal={updateTimeSignal}
              onClick={changeTestDuration}
            />
            <TimeButton
              time={1}
              timeUnit="min"
              id={2}
              selectedId={selectedTimeButtonId}
              updateTimeSignal={updateTimeSignal}
              onClick={changeTestDuration}
            />
            <TimeButton
              time={3}
              timeUnit="min"
              id={3}
              selectedId={selectedTimeButtonId}
              updateTimeSignal={updateTimeSignal}
              onClick={changeTestDuration}
            />
            <TimeButton
              time={5}
              timeUnit="min"
              id={4}
              selectedId={selectedTimeButtonId}
              updateTimeSignal={updateTimeSignal}
              onClick={changeTestDuration}
            />
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
