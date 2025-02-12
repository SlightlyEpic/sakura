<script setup lang="ts">
definePageMeta({
    middleware: ['auth']
})

const session = useUserSession();
const userJsonString = computed(() => JSON.stringify(session.user.value, null, 2));
</script>

<template>
<div class="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
    <div class="whitespace-pre">
        {{ userJsonString }}
    </div>
    <NuxtLink to="/">
        <UButton>Go Back</UButton>
    </NuxtLink>
</div>
</template>
