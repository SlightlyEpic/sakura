<script setup lang="ts">
import { ToastProvider } from 'reka-ui';
</script>

<template>
    <NuxtLayout>
        <!-- <ToastProvider> -->
        <UApp>
            <NuxtPage />
        </UApp>
        <!-- </ToastProvider> -->
    </NuxtLayout>
</template>

<style lang="css">
@import "tailwindcss";
@import "@nuxt/ui";

html {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background-color: #181414;
}

body {
    width: 100%;
    height: 100%;
    font-family: Arial, Helvetica, sans-serif;
}

#__nuxt {
    width: 100%;
    height: 100%;
}
</style>
