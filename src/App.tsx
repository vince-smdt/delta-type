import TypingTestTextBox from "./components/TypingTestTextBox";
import "./App.css";

function App() {
  const words = ["test", "hello", "world", "testing", "typing"];
  const length = 10;

  return (
    <div id="global-box">
      <TypingTestTextBox words={words} wordsAmount={length} />
    </div>
  );
}

export default App;
