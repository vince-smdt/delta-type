import { useRef, useEffect } from "react";
import TypingTestTextBox from "./components/TypingTestTextBox";
import "./App.css";

function App() {
  const words = ["test", "hello", "world", "testing", "typing"];
  const length = 10;
  const tttbRef = useRef<HTMLDivElement>(null); // TypingTestTextBox ref

  const handleKeyPress = (event: KeyboardEvent) => {
    console.log(event);
    tttbRef.current!.focus();
  };

  useEffect(() => {
    tttbRef.current!.focus();

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });

  return (
    <div id="global-box">
      <TypingTestTextBox ref={tttbRef} words={words} wordsAmount={length} />
    </div>
  );
}

export default App;
