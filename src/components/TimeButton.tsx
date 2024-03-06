import "./styles/TimeButton.css";

interface Props {
  time: number;
  timeUnit: string;
}

const TimeButton = ({ time, timeUnit }: Props) => {
  return (
    <div className="time-button">
      <div>{time}</div>
      <div>{timeUnit}</div>
    </div>
  );
};

export default TimeButton;
