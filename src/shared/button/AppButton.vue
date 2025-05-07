<script setup lang="ts">
const props = defineProps({
    text: {
        type: String,
        default: '',
    },
})
</script>

<template>
    <button><slot></slot>{{ text }}</button>
</template>

<style scoped>

</style>