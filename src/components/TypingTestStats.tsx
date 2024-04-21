import { useEffect, useRef } from "react";
import "./styles/TypingTestStats.css";

interface Props {
  wpm: number;
  charsTyped: number;
  accuracy: number;
  testFinished: boolean;
}

const TypingTestStats = ({
  wpm,
  charsTyped,
  accuracy,
  testFinished,
}: Props) => {
  const wpmStatValue = useRef<HTMLDivElement>(null);
  const wpmStatName = useRef<HTMLDivElement>(null);
  const charsStatValue = useRef<HTMLDivElement>(null);
  const charsStatName = useRef<HTMLDivElement>(null);
  const accStatValue = useRef<HTMLDivElement>(null);
  const accStatName = useRef<HTMLDivElement>(null);

  useEffect(() => {
    wpmStatValue.current?.classList.toggle("bigger-stats", testFinished);
    wpmStatName.current?.classList.toggle("bigger-stats", testFinished);
    charsStatValue.current?.classList.toggle("bigger-stats", testFinished);
    charsStatName.current?.classList.toggle("bigger-stats", testFinished);
    accStatValue.current?.classList.toggle("bigger-stats", testFinished);
    accStatName.current?.classList.toggle("bigger-stats", testFinished);
  }, [testFinished]);

  return (
    <div id="typing-test-stats">
      <div className="stat-container">
        <div className="stat-value" ref={wpmStatValue}>
          {wpm}
        </div>
        <div className="stat-name" ref={wpmStatName}>
          WPM
        </div>
      </div>
      <div className="stat-container">
        <div className="stat-value" ref={charsStatValue}>
          {charsTyped}
        </div>
        <div className="stat-name" ref={charsStatName}>
          chars typed
        </div>
      </div>
      <div className="stat-container">
        <div className="stat-value" ref={accStatValue}>
          {accuracy}%
        </div>
        <div className="stat-name" ref={accStatName}>
          accuracy
        </div>
      </div>
    </div>
  );
};

export default TypingTestStats;
