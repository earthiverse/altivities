<template>
  <Draggable
    :animation="animation"
    v-model="slot.list"
    class="slot"
    :id="name"
    :easing="easing"
    handle=".handle"
    group="cards"
    item-key="id"
    @add="swapItems"
  >
    <template #item="{ element }">
      <DraggableCard
        :style="{
          backgroundImage:
            element.image == undefined ? '' : `url(${element.image})`,
        }"
        :text="Array.isArray(element.en) ? element.en[0] : element.en"
      />
    </template>
  </Draggable>
</template>

<script lang="ts">
import { useWordListStore } from "@/store/wordlist";
import { v4 } from "uuid";
import { defineComponent } from "vue";
import Draggable from "vuedraggable";
import DraggableCard from "./DraggableCard.vue";

const wordListStore = useWordListStore();

function swapItems(a: {
  from: HTMLDivElement;
  to: HTMLDivElement;
  newIndex: number;
  oldIndex: number;
}) {
  const from = wordListStore.getSlotByName(a.from.id).list;
  const to = wordListStore.getSlotByName(a.to.id).list;

  if (to.length > 1) {
    // Take the word that was here before
    const word = to.splice(a.newIndex ? 0 : 1, 1)[0];

    // And swap it back where the new card came from
    from.splice(a.oldIndex, 0, word);
  }
}

export default defineComponent({
  components: {
    Draggable,
    DraggableCard,
  },
  name: "CardSlot",
  methods: {
    swapItems: swapItems,
  },
  props: {
    animation: String,
    easing: String,
    name: String,
  },
  data() {
    const slot = wordListStore.getSlotByName(this.name ?? v4());
    return {
      slot: slot,
    };
  },
});
</script>

<style scoped>
.slot {
  overflow: hidden;
}
</style>
