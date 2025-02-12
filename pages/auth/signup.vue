<script setup lang="ts">
definePageMeta({
    middleware: ['unauth']
});
</script>

<template>
<div class="w-full h-full flex items-center justify-center">
    <SignUp />
</div>
</template>
