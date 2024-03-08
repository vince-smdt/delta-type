import { forwardRef } from "react";
import "./styles/TypingTestStats.css";

const TypingTestStats = forwardRef<HTMLDivElement, unknown>((_, ref) => {
  return (
    <div ref={ref} id="typing-test-stats">
      <div className="stat-container">
        <div className="stat-value">68</div>
        <div className="stat-name">WPM</div>
      </div>
      <div className="stat-container">
        <div className="stat-value">340</div>
        <div className="stat-name">chars typed</div>
      </div>
      <div className="stat-container">
        <div className="stat-value">98%</div>
        <div className="stat-name">accuracy</div>
      </div>
    </div>
  );
});

export default TypingTestStats;
