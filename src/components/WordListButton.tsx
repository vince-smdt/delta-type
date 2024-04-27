import { useEffect, useRef } from "react";
import "./styles/WordListButton.css";

interface Props {
  bigText: string;
  smallText: string;
  id: number;
  selectedId: number;
  wordList: string[];
  onClick: Function;
}

const WordListButton = ({
  bigText,
  smallText,
  id,
  selectedId,
  wordList,
  onClick,
}: Props) => {
  const buttonRef = useRef<HTMLDivElement>(null); // TypingTestTextBox ref

  const handleClick = () => {
    onClick(wordList, id);
  };

  useEffect(() => {
    buttonRef.current?.classList.toggle("selected", id === selectedId);
  }, [id, selectedId]);

  return (
    <div className="word-list-button" onClick={handleClick} ref={buttonRef}>
      <div>{bigText}</div>
      <div>{smallText}</div>
    </div>
  );
};

export default WordListButton;
