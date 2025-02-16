<script setup lang="ts">
definePageMeta({
    // middleware: ['auth'],
    layout: 'ide',
});

const route = useRoute();
const projectHid = route.params.projectHid as string;
</script>

<template>
<IdeFull />
</template>
