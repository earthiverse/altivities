<template>
  <QRButton :class="['top-button-1', 'left-button-1']" />
  <TopArea>
    <CardSlot
      animation="200"
      easing="cubic-bezier(0.33, 1, 0.68, 1)"
      :handle="true"
      name="large-card"
    ></CardSlot>
  </TopArea>
  <BottomArea>
    <Draggable
      animation="200"
      v-model="unselected.list"
      easing="cubic-bezier(0.33, 1, 0.68, 1)"
      handle=".handle"
      group="cards"
      id="unselected"
      item-key="id"
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
  </BottomArea>
</template>

<script lang="ts">
import Draggable from "vuedraggable";
import { defineComponent } from "vue";
import { useWordListStore } from "@/store/wordlist";
import BottomArea from "@/components/BottomArea.vue";
import TopArea from "@/components/TopArea.vue";
import QRButton from "@/components/QRButton.vue";
import CardSlot from "@/components/CardSlot.vue";
import DraggableCard from "@/components/DraggableCard.vue";

const wordListStore = useWordListStore();
wordListStore.addWordListsFromURL().catch((e) => console.error(e));

export default defineComponent({
  name: "HomeView",
  components: {
    BottomArea,
    TopArea,
    QRButton,
    Draggable,
    DraggableCard,
    CardSlot,
  },
  data() {
    return {
      store: wordListStore,
      unselected: wordListStore.getSlotByName("unselected"),
    };
  },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,300,1,0");
@import url("https://fonts.googleapis.com/css2?family=Lexend:wght@400&display=swap");
@import url("@/assets/card.css");

body,
html,
#app {
  overflow: hidden;
}

.bottom .card {
  border: 1px solid #000;
  border-radius: 5px;
  box-sizing: border-box;
  font-family: "Lexend", sans-serif;
  height: 88pt;
  min-width: 88pt;
  text-shadow: #fff 2px 0px 0px, #fff 1.75517px 0.958851px 0px,
    #fff 1.0806px 1.68294px 0px, #fff 0.141474px 1.99499px 0px,
    #fff -0.832294px 1.81859px 0px, #fff -1.60229px 1.19694px 0px,
    #fff -1.97999px 0.28224px 0px, #fff -1.87291px -0.701566px 0px,
    #fff -1.30729px -1.51361px 0px, #fff -0.421592px -1.95506px 0px,
    #fff 0.567324px -1.91785px 0px, #fff 1.41734px -1.41108px 0px,
    #fff 1.92034px -0.558831px 0px;
  width: 88pt;
}

#large-card .card {
  font-family: "Lexend", sans-serif;
  height: 100%;
  text-shadow: #fff 6px 0px 0px, #fff 5.91686px 0.995377px 0px,
    #fff 5.66974px 1.96317px 0px, #fff 5.2655px 2.87655px 0px,
    #fff 4.71532px 3.71022px 0px, #fff 4.03447px 4.44106px 0px,
    #fff 3.24181px 5.04883px 0px, #fff 2.35931px 5.51667px 0px,
    #fff 1.41143px 5.83163px 0px, #fff 0.424423px 5.98497px 0px,
    #fff -0.574341px 5.97245px 0px, #fff -1.55719px 5.79441px 0px,
    #fff -2.49688px 5.45579px 0px, #fff -3.36738px 4.96596px 0px,
    #fff -4.14455px 4.33852px 0px, #fff -4.80686px 3.59083px 0px,
    #fff -5.33596px 2.74364px 0px, #fff -5.71718px 1.8204px 0px,
    #fff -5.93995px 0.84672px 0px, #fff -5.99811px -0.150428px 0px,
    #fff -5.89004px -1.14341px 0px, #fff -5.61874px -2.1047px 0px,
    #fff -5.19172px -3.00766px 0px, #fff -4.62082px -3.82727px 0px,
    #fff -3.92186px -4.54082px 0px, #fff -3.11421px -5.12852px 0px,
    #fff -2.22026px -5.57409px 0px, #fff -1.26477px -5.86518px 0px,
    #fff -0.274238px -5.99373px 0px, #fff 0.723898px -5.95617px 0px,
    #fff 1.70197px -5.75355px 0px, #fff 2.63288px -5.39147px 0px,
    #fff 3.49082px -4.87998px 0px, #fff 4.25202px -4.23324px 0px,
    #fff 4.89538px -3.46919px 0px, #fff 5.40307px -2.60899px 0px,
    #fff 5.76102px -1.67649px 0px, #fff 5.95932px -0.697531px 0px;
  width: 100%;
}

#large-card .card,
#large-card .card .handle {
  font-size: min(10vw, 10vh);
}

#large-card {
  aspect-ratio: 1 / 1;
  background-color: #fff;
  border: 2px dashed #000;
  border-radius: 10px;
  height: min(100%, 100vw);
}

::-webkit-scrollbar {
  height: 10px;
  width: 10px;
}

::-webkit-scrollbar-track {
  background: white;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}

.top-button-1 {
  position: absolute;
  top: 5px;
  z-index: 100;
}

.left-button-1 {
  position: absolute;
  left: 5px;
  z-index: 100;
}
</style>
