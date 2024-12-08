import _100mostCommonEnglishWords from "./data/100mostCommonEnglishWords";
import _1000mostCommonEnglishWords from "./data/100mostCommonEnglishWords";
import _javascriptKeywords from "./data/javascriptKeywords";

type WordListOption = {
  name: string,
  description: string,
  wordList: string[],
};

type TimeOption = {
  time: number,
  timeUnit: string,
};

export const wordListOptions: Record<number, WordListOption> = {
  0: {
    name: "100",
    description: "most common english words",
    wordList: _100mostCommonEnglishWords
  },
  1: {
    name: "10000",
    description: "most common english words",
    wordList: _1000mostCommonEnglishWords
  },
  2: {
    name: "JavaScript",
    description: "keywords and functions",
    wordList: _javascriptKeywords
  },
};

export const timeOptions: Record<number, TimeOption> = {
  0: {
    time: 10,
    timeUnit: "sec",
  },
  1: {
    time: 30,
    timeUnit: "sec",
  },
  2: {
    time: 1,
    timeUnit: "min",
  },
  3: {
    time: 3,
    timeUnit: "min",
  },
  4: {
    time: 5,
    timeUnit: "min",
  },
};

export const DEFAULT_WORD_LIST_OPTION_ID = 0;
export const DEFAULT_TIME_OPTION_ID = 2;
