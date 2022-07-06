<template>
  <div class="card">
    <slot>
      <span class="text">{{ text }}</span>
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "StaticCard",
  props: {
    background: String,
    text: String,
  },
});
</script>

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
  justify-content: flex-end;
}

.text {
  padding: 2px;
  text-align: center;
  /* user-select: contain; */
  width: 100%;
}
</style>
