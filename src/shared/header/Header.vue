<script setup lang="ts">
const props = defineProps({
    text: {
        type: String,
        default: '',
    },
})
</script>
<template>
    <h2 class="header"> {{ text }} <img src="../assets/icons/dna.svg"></h2>
</template>
<style lang="css" scoped>
.header {
  padding: 10px 0px 10px 15px;
  margin: 0px;
  background-color: rgb(170, 207, 212);
  font-weight: 300;
  color: rgb(5, 76, 85);
}
</style>