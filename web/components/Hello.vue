<script setup lang="ts">
import { authClient } from '~/lib/auth-client';
</script>

<template>
<div class="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
    <div class="flex flex-col gap-2 justify-center">
        <UButton @click="authClient.signOut()" class="justify-center">Logout</UButton>
        <NuxtLink to="/me">
            <UButton>View session</UButton>
        </NuxtLink>
        <NuxtLink to="/auth/login">
            <UButton class="w-full justify-center">Login</UButton>
        </NuxtLink>
    </div>
</div>
</template>
