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

export type CuratedWordLists = {
  /** Category */
  [T in string]: {
    /** Subcategory */
    [T in string]: {
      name: string;
      wordlists: string[];
      ignore?: string[];
      include?: string[];
      num_cards?: number;
      notes?: string;
    }[];
  };
};

export const ALTIVITIES_BASE_URL =
  "https://altivities.earthiverse.ca/wordlists";

/**
 * NOTE: If you change this, you can run `tools/get_counts` to verify it and make it pretty
 */
export const CURATED_WORD_LISTS: CuratedWordLists = {
  General: {
    Events: [
      {
        name: "Christmas & Winter",
        num_cards: 16,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/winter.json",
        ],
      },
      {
        name: "Halloween",
        num_cards: 20,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/halloween.json",
        ],
      },
      {
        name: "Valentine's Day",
        num_cards: 10,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/valentines.json",
        ],
      },
    ],
    General: [
      {
        name: "Alphabet",
        num_cards: 26,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/alphabet.json",
        ],
      },
      {
        name: "Animals",
        num_cards: 10,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/animals.json",
        ],
      },
      {
        name: "Colors",
        num_cards: 11,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/colors.json",
        ],
      },
      {
        name: "Countries",
        num_cards: 26,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/countries.json",
        ],
      },
      {
        name: "Months",
        num_cards: 12,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/months.json",
        ],
      },
      {
        name: "Numbers 1-20",
        num_cards: 20,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/numbers.json",
        ],
      },
      {
        name: "Occupations",
        num_cards: 22,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/JuniorSunshine6/lesson10.json",
        ],
      },
      {
        name: "Ordinals 1st to 31st",
        num_cards: 31,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/ordinals.json",
        ],
      },
      {
        name: "Prefectures",
        num_cards: 47,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/Hepburn/prefectures.json",
        ],
      },
      {
        name: "Sports",
        num_cards: 14,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/sports.json",
        ],
      },
      {
        name: "Stationery",
        num_cards: 16,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/General/stationery.json",
        ],
      },
    ],
  },
  "Let's Try 1": {
    "Unit 3": [
      {
        name: "All",
        num_cards: 23,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit3_cards.json",
        ],
      },
      {
        ignore: ["strawberry", "apple", "tomato"],
        name: "Numbers 1-20",
        num_cards: 20,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit3_cards.json",
        ],
      },
      {
        include: ["strawberry", "apple", "tomato"],
        name: "Fruits + 'tomato'",
        num_cards: 3,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit3_cards.json",
        ],
      },
    ],
    "Unit 4": [
      {
        name: "All",
        num_cards: 23,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json",
        ],
      },
      {
        include: [
          "red",
          "yellow",
          "blue",
          "green",
          "purple",
          "orange",
          "pink",
          "brown",
          "white",
          "black",
        ],
        name: "Colors",
        num_cards: 10,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json",
        ],
      },
      {
        include: ["baseball", "dodgeball", "soccer", "basketball", "swimming"],
        name: "Sports",
        num_cards: 5,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json",
        ],
      },
      {
        include: [
          "ice cream",
          "pudding",
          "milk",
          "orange juice",
          "onion",
          "green pepper",
          "cucumber",
          "carrot",
        ],
        name: "Food & Drinks",
        num_cards: 8,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json",
        ],
      },
    ],
    "Unit 5": [
      {
        name: "All",
        num_cards: 21,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
        ],
      },
      {
        include: [
          "hamburger",
          "pizza",
          "spaghetti",
          "sushi",
          "steak",
          "salad",
          "cake",
          "egg",
          "jam",
          "noodle",
          "rice ball",
        ],
        name: "Food",
        num_cards: 11,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
        ],
      },
      {
        include: [
          "ice cream",
          "pudding",
          "hamburger",
          "pizza",
          "spaghetti",
          "sushi",
          "steak",
          "salad",
          "cake",
          "egg",
          "jam",
          "noodle",
          "rice ball",
        ],
        name: "Food (+ Unit 4 Food)",
        num_cards: 13,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json",
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
        ],
      },
      {
        include: [
          "grapes",
          "orange",
          "pineapple",
          "peach",
          "melon",
          "banana",
          "kiwi fruit",
          "lemon",
        ],
        name: "Fruits",
        num_cards: 8,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
        ],
      },
      {
        include: [
          "strawberry",
          "apple",
          "grapes",
          "orange",
          "pineapple",
          "peach",
          "melon",
          "banana",
          "kiwi fruit",
          "lemon",
        ],
        name: "Fruits (+ Unit 3 Fruits)",
        num_cards: 10,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit3_cards.json",
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
        ],
      },
      {
        include: ["table tennis", "volleyball"],
        name: "Sports",
        num_cards: 2,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
        ],
      },
      {
        include: [
          "baseball",
          "dodgeball",
          "soccer",
          "basketball",
          "swimming",
          "table tennis",
          "volleyball",
        ],
        name: "Sports (+ Unit 4 Sports)",
        num_cards: 7,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit4_cards.json",
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
        ],
      },
    ],
    "Unit 6": [
      {
        name: "Uppercase Alphabet",
        num_cards: 26,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit6_cards.json",
        ],
      },
    ],
    "Unit 7": [
      {
        name: "Colored Shapes",
        notes:
          "The original cards don't have English, they only have the picture.",
        num_cards: 28,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit7_cards.json",
        ],
      },
    ],
    "Unit 8": [
      {
        name: "Animals (+ 'tree)",
        num_cards: 6,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit8_cards.json",
        ],
      },
    ],
    "Unit 9": [
      {
        name: "All",
        num_cards: 28,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit9_cards.json",
        ],
      },
      {
        include: [
          "mouse",
          "cow",
          "tiger",
          "rabbit",
          "dragon",
          "snake",
          "horse",
          "sheep",
          "monkey",
          "chicken",
          "dog",
          "wild boar",
        ],
        name: "Animals",
        num_cards: 12,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit9_cards.json",
        ],
      },
      {
        include: [
          "cat",
          "panda",
          "bear",
          "spider",
          "elephant",
          "mouse",
          "cow",
          "tiger",
          "rabbit",
          "dragon",
          "snake",
          "horse",
          "sheep",
          "monkey",
          "chicken",
          "dog",
          "wild boar",
        ],
        name: "Animals (+ Unit 8 Animals)",
        num_cards: 17,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit8_cards.json",
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit9_cards.json",
        ],
      },
      {
        include: [
          "head",
          "shoulders",
          "knees",
          "toes",
          "ears",
          "eyes",
          "mouth",
          "nose",
        ],
        name: "Body Parts",
        num_cards: 8,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit9_cards.json",
        ],
      },
      {
        include: [
          "long",
          "short",
          "big",
          "small",
          "scary",
          "furry",
          "round",
          "shiny",
        ],
        name: "Adjectives",
        num_cards: 8,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit9_cards.json",
        ],
      },
    ],
  },
  "Let's Try 2": {
    "Unit 2": [
      {
        name: "All",
        num_cards: 16,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit2_cards.json",
        ],
      },
      {
        include: ["sunny", "cloudy", "rainy", "snowy", "hot", "cold"],
        name: "Weather",
        num_cards: 6,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit2_cards.json",
        ],
      },
      {
        include: ["shorts", "shirt", "pants", "jacket", "boots", "cap"],
        name: "Clothing",
        num_cards: 6,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit2_cards.json",
        ],
      },
      {
        include: ["play tag", "play cards", "play dodgeball", "make a snowman"],
        name: "Activities",
        num_cards: 4,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit2_cards.json",
        ],
      },
    ],
    "Unit 3": [
      {
        name: "Weekdays",
        num_cards: 7,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit3_cards.json",
        ],
      },
    ],
    "Unit 4": [
      {
        name: "All",
        num_cards: 15,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit4_cards.json",
        ],
      },
      {
        ignore: [
          "6 o'clock",
          "12 o'clock",
          "3 o'clock",
          "8 o'clock",
          "10 o'clock",
        ],
        name: "~ time",
        num_cards: 10,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit4_cards.json",
        ],
      },
      {
        include: [
          "6 o'clock",
          "12 o'clock",
          "3 o'clock",
          "8 o'clock",
          "10 o'clock",
        ],
        name: "~ o'clock",
        notes:
          "The original cards don't have English, they only have the picture.",
        num_cards: 5,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit4_cards.json",
        ],
      },
    ],
    "Unit 5": [
      {
        name: "Stationery",
        num_cards: 12,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit5_cards.json",
        ],
      },
    ],
    "Unit 6": [
      {
        name: "All",
        num_cards: 63,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit6_cards.json",
        ],
      },
      {
        include: [
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          "k",
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z",
        ],
        name: "Lowercase Alphabet",
        num_cards: 26,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit6_cards.json",
        ],
      },
      {
        name: "Uppercase Alphabet",
        num_cards: 26,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit6_cards.json",
        ],
      },
      {
        ignore: [
          "bus stop",
          "up",
          "down",
          "taxi",
          "telephone",
          "station",
          "news",
          "juice",
          "school",
          "ice cream",
          "flowers",
        ],
        name: "Lowercase & Uppercase Alphabet",
        num_cards: 52,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit6_cards.json",
        ],
      },
      {
        include: [
          "bus stop",
          "up",
          "down",
          "taxi",
          "telephone",
          "station",
          "news",
          "juice",
          "school",
          "ice cream",
          "flowers",
        ],
        name: "Words",
        num_cards: 11,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit6_cards.json",
        ],
      },
    ],
    "Unit 7": [
      {
        name: "All",
        num_cards: 19,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit7_cards.json",
        ],
      },
      {
        include: [
          "onion",
          "mushroom",
          "potato",
          "tomato",
          "cabbage",
          "corn",
          "carrot",
          "cucumber",
          "green pepper",
        ],
        name: "Vegetables",
        num_cards: 9,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit7_cards.json",
        ],
      },
      {
        include: [
          "onion",
          "mushroom",
          "potato",
          "tomato",
          "cabbage",
          "corn",
          "carrot",
          "cucumber",
          "green pepper",
          "sausage",
        ],
        name: "Vegetables (+ 'sausage')",
        num_cards: 10,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit7_cards.json",
        ],
      },
      {
        include: [
          "melon",
          "peach",
          "banana",
          "apple",
          "pineapple",
          "orange",
          "strawberry",
          "cherry",
          "kiwi fruit",
        ],
        name: "Fruits",
        num_cards: 9,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit7_cards.json",
        ],
      },
      {
        include: [
          "grapes",
          "lemon",
          "melon",
          "peach",
          "banana",
          "apple",
          "pineapple",
          "orange",
          "strawberry",
          "cherry",
          "kiwi fruit",
        ],
        name: "Fruits (+ Let's Try 1 Fruits)",
        num_cards: 11,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry1/unit5_cards.json",
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit7_cards.json",
        ],
      },
    ],
    "Unit 8": [
      {
        name: "School Rooms & Places",
        num_cards: 14,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit8_cards.json",
        ],
      },
    ],
    "Unit 9": [
      {
        name: "Daily Routine",
        num_cards: 10,
        wordlists: [
          "https://altivities.earthiverse.ca/wordlists/LetsTry2/unit9_cards.json",
        ],
      },
    ],
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
    curatedWordLists: () => {
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
    words: (state): WordList => {
      return state.wordLists.flat();
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
              newCombined.push({ ...word });
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
                newCombined.push({ ...word });
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

      return this.words;
    },
    resetStore(resetWordLists = false) {
      if (resetWordLists) {
        // Remove all words and word lists
        this.wordLists.splice(0, this.wordLists.length);
        this.selected.splice(0, this.selected.length);
        this.unselected.splice(0, this.unselected.length);
        this.numWords = 0;
      } else {
        for (let i = 0; i < this.wordLists.length; i++) {
          // Reset selected and unselected word lists based on our current words
          const wordList = this.wordLists[i];
          this.selected[i].splice(0, this.selected[i].length);
          this.unselected[i].splice(0, this.unselected[i].length);
          for (const word of wordList) {
            this.unselected[i].push(word);
          }
        }
      }
    },
    selectWord(id: number): Word | undefined {
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
    unselectWord(id: number): Word | undefined {
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
