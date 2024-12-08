import { createContext, ReactNode, useState, FC, Dispatch, SetStateAction, useEffect } from 'react';
import { generateRandomWordListString } from '../utils/GenerateTest';

interface ThemeContextType {
  typedChars: string,
  errorChars: string,
  untypedChars: string,
  errorAmount: number,
  wordList: string[],
  setTypedChars: Dispatch<SetStateAction<string>>,
  setErrorChars: Dispatch<SetStateAction<string>>,
  setUntypedChars: Dispatch<SetStateAction<string>>,
  setErrorAmount: Dispatch<SetStateAction<number>>,
  setWordList: Dispatch<SetStateAction<string[]>>,
  regenerateTest: Function,
}

export const TypingTestContext = createContext<ThemeContextType>({
  typedChars: "",
  errorChars: "",
  untypedChars: "",
  errorAmount: 0,
  wordList: [],
  setTypedChars: () => null,
  setErrorChars: () => null,
  setUntypedChars: () => null,
  setErrorAmount: () => null,
  setWordList: () => null,
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
      setTypedChars,
      setErrorChars,
      setUntypedChars,
      setErrorAmount,
      setWordList,
      regenerateTest,
    }}>
      {children}
    </TypingTestContext.Provider>
  );
}
