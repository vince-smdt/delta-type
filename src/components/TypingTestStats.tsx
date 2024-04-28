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
  const typingTestStatsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    typingTestStatsRef.current?.classList.toggle("bigger-stats", testFinished);
  }, [testFinished]);

  return (
    <div id="typing-test-stats" ref={typingTestStatsRef}>
      <div className="stat-container">
        <div className="stat-value">{wpm}</div>
        <div className="stat-name">WPM</div>
      </div>
      <div className="stat-container">
        <div className="stat-value">{charsTyped}</div>
        <div className="stat-name">chars typed</div>
      </div>
      <div className="stat-container">
        <div className="stat-value">{accuracy}%</div>
        <div className="stat-name">accuracy</div>
      </div>
    </div>
  );
};

export default TypingTestStats;
