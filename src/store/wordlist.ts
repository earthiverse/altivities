import { defineStore } from "pinia";

export type Languages = "en" | "ja";

export type Word = {
  [T in Exclude<Languages, "ja">]: string | string[];
} & {
  audio?: string;
  id?: number;
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

export const useWordListStore = defineStore("wordlist", {
  state: () => ({
    slots: new Map<string, { list: WordList }>(),
    numCards: 0,
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
        for (const word of words) {
          word.id = this.numCards / 1;
          this.numCards += 1;
        }
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

      return this.addWordLists({
        wordLists: wordLists,
        ignore: ignore,
        include: include,
      });
    },
    reset() {
      const unselected = this.getSlotByName("unselected");

      // Move all cards from slots to undefined
      for (const [slotName, list] of this.slots) {
        if (slotName == "unselected") continue;
        if (list.list.length == 0) continue; // No cards
        const cards = list.list.splice(0, list.list.length);
        unselected.list.push(...cards);
      }

      // Return to original order
      unselected.list.sort((a, b) => {
        if (a.id === undefined || b.id === undefined) return 0;
        return a.id - b.id;
      });
    },
  },
});
