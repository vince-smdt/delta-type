import { createContext, ReactNode, useState, FC, Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { generateRandomWordListString } from '../utils/GenerateTest';

type TestState = "ready" | "inProgress" | "finished"

interface ThemeContextType {
  typedChars: string,
  errorChars: string,
  untypedChars: string,
  errorAmount: number,
  wordList: string[],
  testState: TestState,
  totalCharsTyped: number,
  setTypedChars: Dispatch<SetStateAction<string>>,
  setErrorChars: Dispatch<SetStateAction<string>>,
  setUntypedChars: Dispatch<SetStateAction<string>>,
  setErrorAmount: Dispatch<SetStateAction<number>>,
  setWordList: Dispatch<SetStateAction<string[]>>,
  setTestState: Dispatch<SetStateAction<TestState>>,
  regenerateTest: Function,
}

export const TypingTestContext = createContext<ThemeContextType>({
  typedChars: "",
  errorChars: "",
  untypedChars: "",
  errorAmount: 0,
  wordList: [],
  testState: "ready",
  totalCharsTyped: 0,
  setTypedChars: () => null,
  setErrorChars: () => null,
  setUntypedChars: () => null,
  setErrorAmount: () => null,
  setWordList: () => null,
  setTestState: () => null,
  regenerateTest: () => null,
});

interface Props {
  children: ReactNode,
}

export const TypingTestProvider: FC<Props> = ({ children }) => {
  let [wordList, setWordList] = useState<string[]>([]);
  let [typedChars, setTypedChars] = useState("");
  let [errorChars, setErrorChars] = useState("");
  let [untypedChars, setUntypedChars] = useState("");
  let [errorAmount, setErrorAmount] = useState(0);
  let [testState, setTestState] = useState<TestState>("ready");

  const totalCharsTyped = useMemo(() => {
    return typedChars.length + errorChars.length;
  }, [typedChars, errorChars]);

  const regenerateTest = () => {
    setUntypedChars(generateRandomWordListString(wordList));
    setTypedChars("");
    setErrorChars("");
    setErrorAmount(0);
  }

  useEffect(() => {
    regenerateTest();
  }, [wordList])

  return (
    <TypingTestContext.Provider value={{
      typedChars,
      errorChars,
      untypedChars,
      errorAmount,
      wordList,
      testState,
      totalCharsTyped,
      setTypedChars,
      setErrorChars,
      setUntypedChars,
      setErrorAmount,
      setWordList,
      setTestState,
      regenerateTest,
    }}>
      {children}
    </TypingTestContext.Provider>
  );
}
