<template>
  <div class="button">
    <span class="material-symbols-outlined">
      <slot></slot>
    </span>
  </div>
</template>

<style>
.button {
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 5px;
  box-sizing: border-box;
  cursor: pointer;
  height: 44pt;
  user-select: none;
  width: 44pt;
}

.button span {
  font-size: 44pt;
  line-height: calc(44pt - 2px);
}
</style>
