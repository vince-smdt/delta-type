import { useEffect, useRef } from "react";
import "./styles/WordListButton.css";

interface Props {
  bigText: string;
  smallText: string;
  id: number;
  selectedId: number;
  onClick: Function;
}

const WordListButton = ({
  bigText,
  smallText,
  id,
  selectedId,
  onClick,
}: Props) => {
  const buttonRef = useRef<HTMLDivElement>(null); // TypingTestTextBox ref

  useEffect(() => {
    buttonRef.current?.classList.toggle("selected", id === selectedId);
  }, [id, selectedId]);

  return (
    <div
      className="word-list-button"
      onClick={() => onClick()}
      ref={buttonRef}
    >
      <div>{bigText}</div>
      <div>{smallText}</div>
    </div>
  );
};

export default WordListButton;
