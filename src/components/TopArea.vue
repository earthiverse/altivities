<template>
  <div class="top">
    <slot></slot>
  </div>
</template>

<style scoped>
.top {
  align-items: center;
  background-color: #eee;
  display: flex;
  height: calc(100% - 88pt - 25px - 10px);
  justify-content: center;
  left: 0;
  padding: 5px;
  position: absolute;
  top: 0;
  width: calc(100% - 10px);
}
</style>
