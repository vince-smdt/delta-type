import { useState, useEffect } from "react";
import "./styles/TypingTestTimer.css";
import customSetInterval from "../customSetInterval";

interface Props {
  duration: number;
  testStarted: boolean;
}

const TypingTestTimer = ({ duration, testStarted }: Props) => {
  let [timeLeftStr, setTimeLeftStr] = useState("0:00");
  let [timerStartTime, setTimerStartTime] = useState(Date.now());
  let [timerStarted, setTimerStarted] = useState(false);

  const getTimeLeft = () => {
    if (testStarted === false) return duration;

    const elapsedSinceStart = (Date.now() - timerStartTime) / 1000; // In seconds
    return Math.max(duration - elapsedSinceStart, 0);
  };

  // Update timer display
  customSetInterval(() => {
    const timeLeft = getTimeLeft();
    const minutes = Math.floor(timeLeft / 60);
    const seconds = Math.floor(timeLeft % 60);

    setTimeLeftStr(
      minutes.toString() + ":" + seconds.toString().padStart(2, "0")
    );
  }, 10);

  useEffect(() => {
    if (timerStarted === false && testStarted === true) {
      setTimerStarted(true);
      setTimerStartTime(Date.now());
    }
  }, [duration, testStarted]);

  return <div id="typing-test-timer">{timeLeftStr}</div>;
};

export default TypingTestTimer;
