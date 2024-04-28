import { useEffect, useRef } from "react";
import "./styles/WordListButton.css";

interface Props {
  bigText: string;
  smallText: string;
  id: number;
  selectedId: number;
  wordList: string[];
  updateWordListSignal: boolean;
  onClick: Function;
}

const WordListButton = ({
  bigText,
  smallText,
  id,
  selectedId,
  wordList,
  updateWordListSignal,
  onClick,
}: Props) => {
  const buttonRef = useRef<HTMLDivElement>(null); // TypingTestTextBox ref

  const handleClick = (updateCookie: boolean = true) => {
    // "updateCookie" prevents overriding cookie with default value when page refreshed quickly multiple times
    onClick(wordList, id, updateCookie);
  };

  useEffect(() => {
    buttonRef.current?.classList.toggle("selected", id === selectedId);
  }, [id, selectedId]);

  useEffect(() => {
    buttonRef.current?.classList.toggle("selected", id === selectedId);
    if (id === selectedId) handleClick(false);
  }, [updateWordListSignal]);

  return (
    <div
      className="word-list-button"
      onClick={() => handleClick()}
      ref={buttonRef}
    >
      <div>{bigText}</div>
      <div>{smallText}</div>
    </div>
  );
};

export default WordListButton;
