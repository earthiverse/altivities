<template>
  <div class="bottom">
    <slot></slot>
  </div>
</template>

<style scoped>
.bottom {
  border-top: 1px solid #000000;
  bottom: 0px;
  box-sizing: border-box;
  height: calc(88pt + 25px);
  left: 0;
  padding: 5px;
  position: absolute;
  width: 100%;
}
</style>
