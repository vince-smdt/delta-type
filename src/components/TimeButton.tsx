import { useEffect, useRef } from "react";
import "./styles/TimeButton.css";

interface Props {
  time: number;
  timeUnit: string; // "min" or "sec"
  id: number;
  selectedId: number;
  updateTimeSignal: boolean;
  onClick: Function;
}

const TimeButton = ({
  time,
  timeUnit,
  id,
  selectedId,
  updateTimeSignal,
  onClick,
}: Props) => {
  const buttonRef = useRef<HTMLDivElement>(null); // TypingTestTextBox ref

  const handleClick = () => {
    const timeInSeconds = time * (timeUnit === "min" ? 60 : 1);
    onClick(timeInSeconds, id);
  };

  useEffect(() => {
    buttonRef.current?.classList.toggle("selected", id === selectedId);
  }, [id, selectedId]);

  useEffect(() => {
    buttonRef.current?.classList.toggle("selected", id === selectedId);
    if (id === selectedId) handleClick();
  }, [updateTimeSignal]);

  return (
    <div className="time-button" onClick={handleClick} ref={buttonRef}>
      <div>{time}</div>
      <div>{timeUnit}</div>
    </div>
  );
};

export default TimeButton;
