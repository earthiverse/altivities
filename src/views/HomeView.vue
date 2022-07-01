<template>
  <div v-for="(value, category) in lists" :key="category">
    <h1>{{ category }}</h1>
    <div v-for="(value2, subCategory) in value" :key="subCategory">
      <h2>{{ subCategory }}</h2>
      <table>
        <tr v-for="unit of value2" :key="unit.name">
          <th class="name-cell">{{ unit.name }}</th>
          <td class="bingo-cell">
            <span v-if="(unit?.num_cards ?? 0) < 4"> - </span>
            <span v-else>
              <a
                :href="
                  generateURL(
                    'bingo',
                    unit.wordlists,
                    unit.ignore,
                    unit.include,
                    '&rows=2&cols=2'
                  )
                "
              >
                Bingo (2x2)
              </a>
            </span>
            <span v-if="(unit?.num_cards ?? 0) >= 9">
              <a
                :href="
                  generateURL(
                    'bingo',
                    unit.wordlists,
                    unit.ignore,
                    unit.include,
                    '&rows=3&cols=3'
                  )
                "
              >
                <br />
                Bingo (3x3)
              </a>
            </span>
            <span v-if="(unit?.num_cards ?? 0) >= 16">
              <a
                :href="
                  generateURL(
                    'bingo',
                    unit.wordlists,
                    unit.ignore,
                    unit.include,
                    '&rows=4&cols=4'
                  )
                "
              >
                <br />
                Bingo (4x4)
              </a>
            </span>
            <span v-if="(unit?.num_cards ?? 0) >= 25">
              <a
                :href="
                  generateURL(
                    'bingo',
                    unit.wordlists,
                    unit.ignore,
                    unit.include,
                    '&rows=5&cols=5'
                  )
                "
              >
                <br />
                Bingo (5x5)
              </a>
            </span>
          </td>
          <td class="cards-cell">
            <a
              :href="
                generateURL('cards', unit.wordlists, unit.ignore, unit.include)
              "
              >Cards</a
            >
          </td>
          <td class="memory-cell">
            <a
              :href="
                generateURL('memory', unit.wordlists, unit.ignore, unit.include)
              "
              >Memory</a
            >
          </td>
          <td class="cards-cell">
            <a
              :href="
                generateURL('cards', unit.wordlists, unit.ignore, unit.include)
              "
              >Cards</a
            >
          </td>
          <td class="slides-cell">
            <a
              :href="
                generateURL('slides', unit.wordlists, unit.ignore, unit.include)
              "
              >Slides</a
            >
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CURATED_WORD_LISTS } from "@/store/wordlist";

function generateURL(
  type: "bingo" | "cards" | "memory" | "slides",
  wordlists: string[],
  ignore?: string[],
  include?: string[],
  extra?: string
) {
  const inc = include ? `&include=${include.join(",")}` : "";
  const ign = ignore ? `&ignore=${ignore.join(",")}` : "";
  const ext = extra ?? "";
  return `${type}?wordlists=${wordlists.join(",")}${inc}${ign}${ext}`;
}

export default defineComponent({
  name: "HomeView",
  methods: {
    generateURL: generateURL,
  },
  data() {
    return {
      lists: CURATED_WORD_LISTS,
    };
  },
});
</script>

<style scoped>
table th {
  text-align: left;
  width: 25vw;
}
table td {
  text-align: center;
  width: calc(75vw / 5);
}

table {
  border: 1px solid #000;
  border-collapse: collapse;
}

table td,
table th {
  border-bottom: 1px solid #000;
  padding: 5px;
}
</style>
