<script setup lang="ts">
const props = defineProps({
    text: {
        type: String,
        default: '',
    },
})
</script>

<template>
    <button>{{ text }}</button>
</template>

<style scoped>

</style>