import { defineStore } from "pinia";

export type Languages = "en" | "ja";

export type Word = {
  [T in Exclude<Languages, "ja">]: string | string[];
} & {
  audio?: string;
  image?: string;
  id?: number;
  ja:
    | {
        kanji: string;
        hiragana: string;
      }
    | {
        kanji: string;
        hiragana: string;
      }[];
};

export type WordList = Word[];

const ALTIVITIES_WORD_LISTS = "https://altivities.earthiverse.ca/wordlists";
const CURATED_WORD_LISTS: {
  [T in string]: {
    prefix: string;
    lists: {
      [T in string]: {
        name: string;
        wordList: string;
      };
    };
  };
} = {
  General: {
    prefix: `${ALTIVITIES_WORD_LISTS}/General/`,
    lists: {
      colors: {
        name: "Colors",
        wordList: `colors.json`,
      },
      sports: {
        name: "Sports",
        wordList: `sports.json`,
      },
    },
  },
};

export const useWordListStore = defineStore({
  id: "word_list",
  state: () => ({
    selected: new Array<WordList>(),
    unselected: new Array<WordList>(),
    wordLists: new Array<WordList>(),
    numWords: 0,
  }),
  getters: {
    allWords: (state): WordList => {
      return state.wordLists.flat();
    },
    getCuratedWordLists: () => {
      return CURATED_WORD_LISTS;
    },
    getSelectedWordByIndex: (state) => {
      return (index: number) => {
        let i = 0;
        for (const wordList of state.selected) {
          for (const word of wordList) {
            if (i == index) return word;
            i++;
          }
        }
      };
    },
    getUnselectedWordByIndex: (state) => {
      return (index: number) => {
        let i = 0;
        for (const wordList of state.unselected) {
          for (const word of wordList) {
            if (i == index) return word;
            i++;
          }
        }
      };
    },
  },
  actions: {
    async addWordsFromURLSearchParams(
      wl = "wordlist",
      wls = "wordlists",
      ign = "ignore",
      inc = "include"
    ): Promise<WordList> {
      const params = new URLSearchParams(window.location.search);

      let combined: WordList = [];

      const wordList = params.get(wl);
      if (wordList) {
        // Add the one word list to the menu
        const response = await fetch(wordList);
        const json: WordList = await response.json();
        combined.push(...json);
      }

      const wordLists = params.get(wls);
      if (wordLists) {
        // Combine all word lists
        for (const url of wordLists.split(",")) {
          const response = await fetch(url);
          const json: WordList = await response.json();
          combined.push(...json);
        }
      }

      const ignore = params.get(ign);
      if (ignore) {
        const toIgnore: string[] = ignore.split(",");
        for (let i = 0; i < combined.length; i++) {
          const word = combined[i];
          for (const ignoreWord of toIgnore) {
            if (
              word.en == ignoreWord ||
              (Array.isArray(word.en) && word.en[0] == ignoreWord)
            ) {
              // Remove this word from the word list
              combined.splice(i, 1);
              i -= 1;
              break;
            }
          }
        }
      }

      const include = params.get(inc);
      if (include) {
        const toInclude: string[] = include.split(",");
        const newCombined: WordList = [];
        while (toInclude.length > 0) {
          // Get the word to include
          const includeWord = toInclude.shift() as string;

          // Look for it in our words
          let found = false;
          for (const word of combined) {
            if (
              word.en == includeWord ||
              (Array.isArray(word.en) && word.en[0] == includeWord)
            ) {
              // Add this word
              newCombined.push(word);
              found = true;
              break;
            }

            // Check if it's an alternative word
            if (Array.isArray(word.en)) {
              for (let j = 0; j < word.en.length; j++) {
                const alternativeWord = word.en[j];
                if (alternativeWord !== includeWord) continue;
                // We found the word as an alternative, set it as the main word
                word.en = alternativeWord;
                newCombined.push(word);
                found = true;
                break;
              }
            }
          }

          if (!found) {
            // Add the word we included, even though it isn't in our word list
            newCombined.push({
              en: includeWord,
              ja: {
                hiragana: "???",
                kanji: "???",
              },
            });
          }
        }

        // Use the include words only
        combined = newCombined;
      }

      // Add id numbers to the words
      for (const word of combined) {
        word.id = this.numWords;
        this.numWords++;
      }
      // Add the word list to our master list
      this.wordLists.push(combined);
      // Set all words for this word list as unselected
      this.unselected.push([...combined]);
      // Create an empty array for this word list for future selected words
      this.selected.push([]);

      // Add numbered word lists if they exist, too
      let i = 1;
      let numberedWordList = `${i}_wordlist`;
      let numberedWordLists = `${i}_wordlists`;
      while (params.has(numberedWordList) || params.has(numberedWordLists)) {
        this.addWordsFromURLSearchParams(
          numberedWordList,
          numberedWordLists,
          `${i}_ignore`,
          `${i}_include`
        );
        i += 1;
        numberedWordList = `${i}_wordlist`;
        numberedWordLists = `${i}_wordlists`;
      }

      return this.allWords;
    },
    resetStore() {
      this.selected.splice(0, this.selected.length);
      this.unselected.splice(0, this.unselected.length);
      this.wordLists.splice(0, this.wordLists.length);
      this.numWords = 0;
    },
    selectWord(id: number) {
      for (let i = 0; i < this.unselected.length; i++) {
        const wordList = this.unselected[i];
        for (let j = 0; j < wordList.length; j++) {
          const word = wordList[j];
          if (word.id == id) {
            // We found the word, move it from unselected to selected
            wordList.splice(j, 1);
            this.selected[i].push(word);
            return word;
          }
        }
      }
    },
    unselectWord(id: number) {
      for (let i = 0; i < this.selected.length; i++) {
        const wordlist = this.selected[i];
        for (let j = 0; j < wordlist.length; j++) {
          const word = wordlist[j];
          if (word.id == id) {
            // We found the word, move it from selected to unselected
            wordlist.splice(j, 1);
            this.unselected[i].push(word);
            return word;
          }
        }
      }
    },
  },
});
