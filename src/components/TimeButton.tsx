import "./styles/TimeButton.css";

interface Props {
  time: number;
  timeUnit: string; // "min" or "sec"
  onClick: Function;
}

const TimeButton = ({ time, timeUnit, onClick }: Props) => {
  const handleClick = () => {
    const timeInSeconds = time * (timeUnit === "min" ? 60 : 1);
    onClick(timeInSeconds);
  };

  return (
    <div className="time-button" onClick={handleClick}>
      <div>{time}</div>
      <div>{timeUnit}</div>
    </div>
  );
};

export default TimeButton;
