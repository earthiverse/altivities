import { defineStore } from "pinia";
import { v4 } from "uuid";

export type Languages = "en" | "ja";

export type Word = {
  [T in Exclude<Languages, "ja">]: string | string[];
} & {
  audio?: string;
  id?: string;
  image?: string;
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

export const useWordListStore = defineStore("wordlist", {
  state: () => ({
    slots: new Map<string, { list: WordList }>(),
  }),
  getters: {
    getSlotByName: (state) => {
      return (name: string) => {
        let slot = state.slots.get(name);

        // Create the slot if we don't have it
        if (slot == undefined) {
          slot = { list: [] as WordList };
          state.slots.set(name, slot);
        }

        return slot;
      };
    },
  },
  actions: {
    async addWordLists(options: {
      wordLists: string[];
      ignore?: string[];
      include?: string[];
    }) {
      if (options.wordLists.length == 0) return; // No word lists

      let newWords: WordList = [];

      for (const wordList of options.wordLists) {
        const response = await fetch(wordList);
        const words = (await response.json()) as WordList;

        // Give each word a unique ID
        for (const word of words) word.id = v4();
        newWords.push(...words);
      }

      if (options.ignore?.length) {
        const ignoreSet = new Set(options.ignore);

        // Only include words that aren't ignored
        newWords = newWords.filter((word) => {
          if (Array.isArray(word.en)) {
            return !word.en.some((en) => ignoreSet.has(en));
          }
          return !ignoreSet.has(word.en);
        });
      }

      if (options.include?.length) {
        const includeSet = new Set(options.include);

        // Only include words defined in include
        newWords = newWords.filter((word) => {
          if (Array.isArray(word.en)) {
            // If we find the word, we want to set it as the only option
            for (const en of word.en) {
              if (includeSet.has(en)) {
                word.en = en;
                return true;
              }
            }
          } else {
            return includeSet.has(word.en);
          }
        });
      }

      // Add the words to the unselected list
      const unselected = this.slots.get("unselected");
      if (!unselected) {
        this.slots.set("unselected", { list: newWords });
      } else {
        unselected.list.push(...newWords);
      }
    },
    async addWordListsFromURL() {
      const params = new URLSearchParams(window.location.search);

      const wordLists: string[] = [];
      if (params.has("wordlist")) {
        const get = params.get("wordlist");
        if (get) wordLists.push(get);
      }
      if (params.has("wordlists")) {
        const get = params.get("wordlists")?.split(",");
        if (get) wordLists.push(...get);
      }

      const ignore: string[] = [];
      if (params.has("ignore")) {
        const get = params.get("ignore")?.split(",");
        if (get) ignore.push(...get);
      }

      const include: string[] = [];
      if (params.has("include")) {
        const get = params.get("include")?.split(",");
        if (get) include.push(...get);
      }

      console.log("yes?");
      console.log(wordLists);
      console.log(ignore);
      console.log(include);

      return this.addWordLists({
        wordLists: wordLists,
        ignore: ignore,
        include: include,
      });
    },
    // /**
    //  * Moves the card from `unselected` to
    //  * @param index The index of the card in `unselected`.
    //  */
    // moveCardToSlot(index: number, slotName: string, slotIndex = 0) {
    //   // Get the card
    //   const card = this.unselected[index];
    //   if (!card) throw `We don't have a card in index ${index}`;

    //   // Get the slot
    //   const slot = this.getSlotByName(slotName);

    //   // TODO: Move card to slot index
    //   // TODO: Move all cards after slot.numWords back to the end of unselected
    // },
    reset() {
      // TODO: Move all cards from the slots back to unselected
      // TODO: Delete all slots
    },
  },
});
