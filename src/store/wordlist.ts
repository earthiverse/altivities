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

export const useWordListStore = defineStore("wordlist", {
  state: () => ({
    slots: new Map<string, WordList>(),
    unselected: [] as WordList,
  }),
  getters: {
    getSlotByName: (state) => {
      return (name: string) => {
        let slot = state.slots.get(name);

        // Create the slot if we don't have it
        if (slot == undefined) {
          slot = [] as WordList;
          state.slots.set(name, slot);
        }

        return slot;
      };
    },
  },
  actions: {
    addWord(word: Word) {
      if (!word) return; // No word given
      this.unselected.push(word);
    },
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

      if (options.ignore) {
        const ignoreSet = new Set(options.ignore);

        // Only include words that aren't ignored
        newWords = newWords.filter((word) => {
          if (Array.isArray(word.en)) {
            return !word.en.some((en) => ignoreSet.has(en));
          }
          return !ignoreSet.has(word.en);
        });
      }

      if (options.include) {
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

      this.unselected.push(...newWords);
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
