<template>
  <div class="bottom">
    <slot />
  </div>
</template>

<style scoped>
.bottom {
  border-top: 1px solid #000000;
  bottom: 10px;
  box-sizing: border-box;
  height: 88pt;
  left: 0;
  padding: 5px;
  position: absolute;
  width: 100%;
}
</style>
