import { useState, useEffect } from "react";
import "./styles/TypingTestTimer.css";
import customSetInterval from "../customSetInterval";

interface Props {
  duration: number;
  testStarted: boolean;
  startTime: number;
}

const TypingTestTimer = ({ duration, testStarted, startTime }: Props) => {
  let [timeLeftStr, setTimeLeftStr] = useState("0:00");

  const getTimeLeft = () => {
    if (testStarted === false) return duration;

    const elapsedSinceStart = (Date.now() - startTime) / 1000; // In seconds
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

  return <div id="typing-test-timer">{timeLeftStr}</div>;
};

export default TypingTestTimer;
