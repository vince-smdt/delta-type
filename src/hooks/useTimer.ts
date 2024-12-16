import { useState, useEffect, useRef } from 'react';
import useSetInterval from './useSetInterval';

const TIMER_UPDATE_RATE_MS = 100;

const useTimer = (onFinish: Function) => {
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [tick, setTick] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const startTimer = (): void => {
    setStartTime(Date.now());
    setStarted(true);
    console.log("START");
  }

  const restartTimer = (): void => {
    setFinished(false);
    setStarted(false);
  }

  const setTimerDurationInSeconds = (duration: number): void => {
    setDuration(duration);
  }

  const getTimeLeftString = (): string => {
    let timeLeft;

    if (!started) {
      timeLeft = duration;
    } else {
      const elapsedSinceStart = (Date.now() - startTime) / 1000;
      timeLeft = Math.max(duration - elapsedSinceStart, 0);
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = Math.floor(timeLeft % 60);

    return minutes.toString() + ":" + seconds.toString().padStart(2, "0")
  }

  const checkIfTimerFinished = (): void => {
    console.log(finished, started);
    console.log(Date.now() / 1000, (startTime + (duration * 1000)) / 1000)
    if (finished || !started) return;

    if (Date.now() > startTime + (duration * 1000)) {
      console.log("FINISHED");
      setFinished(true);
      setStarted(false);
      if (onFinish) onFinish();
    }
  }

  useSetInterval(() => {
    checkIfTimerFinished();
    setTick(tick + 1);
  }, TIMER_UPDATE_RATE_MS);

  return { startTime, duration, startTimer, restartTimer, setTimerDurationInSeconds, getTimeLeftString };
}

export default useTimer;
