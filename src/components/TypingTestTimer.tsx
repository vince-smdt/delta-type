import { useState, useEffect } from "react";
import "./styles/TypingTestTimer.css";

enum TimerState {
  READY,
  IN_PROGRESS,
  FINISHED,
}

const TypingTestTimer = () => {
  let [timeLeftStr, setTimeLeftStr] = useState("0:59");
  let [timerStartTime, setTimerStartTime] = useState(Date.now());
  let [timerDuration, setTimerDuration] = useState(60); // Seconds
  let [timerState, setTimerState] = useState(TimerState.IN_PROGRESS);

  const getTimeLeft = () => {
    if (timerState === TimerState.READY) return timerDuration;
    if (timerState === TimerState.FINISHED) return 0;

    const elapsedSinceStart = (Date.now() - timerStartTime) / 1000; // In seconds
    return Math.max(timerDuration - elapsedSinceStart, 0);
  };

  const reset = (duration: number) => {
    setTimerState(TimerState.READY);
    setTimerDuration(duration);
  };

  const start = () => {
    setTimerStartTime(Date.now());
    setTimerState(TimerState.IN_PROGRESS);
  };

  const pause = () => {
    setTimerState(TimerState.READY);
    setTimerDuration(getTimeLeft());
  };

  const getState = () => {
    return timerState;
  };

  useEffect(() => {
    const updateTimerInterval = setInterval(() => {
      const timeLeft = getTimeLeft();
      const minutes = Math.floor(timeLeft / 60);
      const seconds = Math.floor(timeLeft % 60);

      if (timeLeft === 0) setTimerState(TimerState.FINISHED);

      setTimeLeftStr(
        minutes.toString() + ":" + seconds.toString().padStart(2, "0")
      );
    }, 10);

    return () => {
      clearInterval(updateTimerInterval);
    };
  }, []);

  return <div id="typing-test-timer">{timeLeftStr}</div>;
};

export default TypingTestTimer;
