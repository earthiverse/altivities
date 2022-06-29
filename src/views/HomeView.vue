<template>
  <div v-for="(value, category) in lists" :key="category">
    <h1>{{ category }}</h1>
    <div v-for="(value2, subCategory) in value" :key="subCategory">
      <h2>{{ subCategory }}</h2>
      <table>
        <tr v-for="unit of value2" :key="unit.name">
          <th class="name-cell">{{ unit.name }}</th>
          <td class="bingo-cell">
            <a
              :href="
                generateURL('bingo', unit.wordlists, unit.ignore, unit.include)
              "
              >Bingo</a
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
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CURATED_WORD_LISTS } from "@/store/wordlist";

function generateURL(
  type: "bingo" | "cards",
  wordlists: string[],
  ignore?: string[],
  include?: string[]
) {
  const inc = include ? `&include=${include.join(",")}` : "";
  const ign = ignore ? `&ignore=${ignore.join(",")}` : "";
  return `${type}?wordlists=${wordlists.join(",")}${inc}${ign}`;
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
.name-cell {
  text-align: left;
  width: 20vw;
}
.bingo-cell,
.cards-cell {
  text-align: center;
  width: 40vw;
}
</style>
