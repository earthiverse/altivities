import { defineStore } from "pinia";

export type PluralWord = {
  id?: number;
  singular: {
    en: string;
    image?: string;
  };
  plural: {
    en: string;
    image?: string;
  };
};

export type PluralWordList = PluralWord[];

const ALTIVITIES_PLURAL_WORD_LISTS =
  "https://altivities.earthiverse.ca/wordlists/Plurals";
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
    prefix: `${ALTIVITIES_PLURAL_WORD_LISTS}/`,
    lists: {
      fruits: {
        name: "Fruits",
        wordList: `fruits.json`,
      },
    },
  },
};

export const usePluralWordListStore = defineStore({
  id: "word_list",
  state: () => ({
    wordLists: new Array<PluralWordList>(),
    numWords: 0,
  }),
  getters: {
    curatedWordLists: () => {
      return CURATED_WORD_LISTS;
    },
    getWordByIndex: (state) => {
      return (index: number) => {
        let i = 0;
        for (const wordList of state.wordLists) {
          for (const word of wordList) {
            if (i == index) return word;
            i++;
          }
        }
      };
    },
    words: (state): PluralWordList => {
      return state.wordLists.flat();
    },
  },
  actions: {
    async addWordsFromURLSearchParams(
      wl = "wordlist",
      wls = "wordlists",
      ign = "ignore",
      inc = "include"
    ): Promise<PluralWordList> {
      const params = new URLSearchParams(window.location.search);

      let combined: PluralWordList = [];

      const wordList = params.get(wl);
      if (wordList) {
        // Add the one word list to the menu
        const response = await fetch(wordList);
        const json: PluralWordList = await response.json();
        combined.push(...json);
      }

      const wordLists = params.get(wls);
      if (wordLists) {
        // Combine all word lists
        for (const url of wordLists.split(",")) {
          const response = await fetch(url);
          const json: PluralWordList = await response.json();
          combined.push(...json);
        }
      }

      const ignore = params.get(ign);
      if (ignore) {
        const toIgnore: string[] = ignore.split(",");
        for (let i = 0; i < combined.length; i++) {
          const word = combined[i];
          for (const ignoreWord of toIgnore) {
            if (word.singular.en == ignoreWord) {
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
        const newCombined: PluralWordList = [];
        while (toInclude.length > 0) {
          // Get the word to include
          const includeWord = toInclude.shift() as string;

          // Look for it in our words
          for (const word of combined) {
            if (word.singular.en == includeWord) {
              // Add this word
              newCombined.push(word);
              break;
            }
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

      return this.words;
    },
    resetStore() {
      this.wordLists.splice(0, this.wordLists.length);
      this.numWords = 0;
    },
  },
});
