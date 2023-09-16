import TypingTestTextBox from "./components/TypingTestTextBox";

function App() {
  const words = ["test", "hello", "world", "testing", "typing"];
  const length = 100;

  return (
    <div>
      <TypingTestTextBox words={words} wordsAmount={length} />
    </div>
  );
}

export default App;
