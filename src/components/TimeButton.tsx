import { useEffect, useRef } from "react";
import "./styles/TimeButton.css";

interface Props {
  time: number;
  timeUnit: string; // "min" or "sec"
  id: number;
  selectedId: number;
  onClick: Function;
}

const TimeButton = ({
  time,
  timeUnit,
  id,
  selectedId,
  onClick,
}: Props) => {
  const buttonRef = useRef<HTMLDivElement>(null); // TypingTestTextBox ref

  useEffect(() => {
    buttonRef.current?.classList.toggle("selected", id === selectedId);
  }, [id, selectedId]);

  return (
    <div className="time-button" onClick={() => onClick()} ref={buttonRef}>
      <div>{time}</div>
      <div>{timeUnit}</div>
    </div>
  );
};

export default TimeButton;
