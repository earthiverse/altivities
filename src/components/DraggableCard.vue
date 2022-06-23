<template>
  <div class="card">
    <span class="material-symbols-outlined handle">drag_handle</span>
    <slot>
      <span class="text">{{ text }}</span>
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DraggableCard",
  props: {
    background: String,
    text: String,
  },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,300,1,0");
</style>

<style scoped>
.card {
  align-items: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  box-sizing: border-box;
  padding: 2px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
}

.handle {
  user-select: none;
}

.text {
  background-color: rgba(255, 255, 255, 0.5);
  padding: 2px;
  text-align: center;
  width: 100%;
}
</style>
