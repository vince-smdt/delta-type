import "./styles/TypingTestTimer.css";

interface Props {
  timeLeftString: string;
}

const TypingTestTimer = ({timeLeftString}: Props) => {
  return <div id="typing-test-timer">{timeLeftString}</div>;
};

export default TypingTestTimer;
