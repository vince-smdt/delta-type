const MAX_WORDS_PER_TEST = 10000;

export const generateRandomWordListString = (words: string[]) => {
  if (words.length === 0) return "";

  let wordListString = "";
  for (let i = 0; i < MAX_WORDS_PER_TEST; i++) {
    const randomWordIndex = Math.floor(Math.random() * words.length);
    wordListString += words[randomWordIndex] + " ";
  }
  return wordListString.trim();
};
