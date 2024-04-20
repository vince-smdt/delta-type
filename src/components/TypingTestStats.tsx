import "./styles/TypingTestStats.css";

interface Props {
  wpm: number;
  charsTyped: number;
  accuracy: number;
}

const TypingTestStats = ({ wpm, charsTyped, accuracy }: Props) => {
  return (
    <div id="typing-test-stats">
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