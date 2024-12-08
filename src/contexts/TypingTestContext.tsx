import { createContext, ReactNode, useState, FC, Dispatch, SetStateAction, useEffect } from 'react';
import { generateRandomWordListString } from '../utils/GenerateTest';

interface ThemeContextType {
  typedChars: string,
  errorChars: string,
  untypedChars: string,
  errorAmount: number,
  regenerateTest: Function,
  setTypedChars: Dispatch<SetStateAction<string>>,
  setErrorChars: Dispatch<SetStateAction<string>>,
  setUntypedChars: Dispatch<SetStateAction<string>>,
  setErrorAmount: Dispatch<SetStateAction<number>>,
}

export const TypingTestContext = createContext<ThemeContextType>({
  typedChars: "",
  errorChars: "",
  untypedChars: "",
  errorAmount: 0,
  setTypedChars: () => null,
  setErrorChars: () => null,
  setUntypedChars: () => null,
  setErrorAmount: () => null,
  regenerateTest: () => null,
});

interface Props {
  wordList: string[],
  children: ReactNode,
}

export const TypingTestProvider: FC<Props> = ({ wordList, children }) => {
  let [typedChars, setTypedChars] = useState("");
  let [errorChars, setErrorChars] = useState("");
  let [untypedChars, setUntypedChars] = useState(generateRandomWordListString(wordList));
  let [errorAmount, setErrorAmount] = useState(0);

  const regenerateTest = () => {
    setUntypedChars(generateRandomWordListString(wordList));
  }

  useEffect(() => {
    console.log("INFO:", typedChars, errorChars, untypedChars, errorAmount, setTypedChars, setErrorChars, setUntypedChars, setErrorAmount);
  }, [])

  return (
    <TypingTestContext.Provider value={{
      typedChars,
      errorChars,
      untypedChars,
      errorAmount,
      setTypedChars,
      setErrorChars,
      setUntypedChars,
      setErrorAmount,
      regenerateTest,
    }}>
      {children}
    </TypingTestContext.Provider>
  );
}
