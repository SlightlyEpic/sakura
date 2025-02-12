<script setup lang="ts">
import { viewAuthOnly } from '~/shared/abilities';

const session = useUserSession();
</script>

<template>
<div class="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
    <Bouncer :ability="viewAuthOnly" :args="[session.user]">
        <template #can>
            <a href="/auth/logout">
                <UButton>Logout</UButton>
            </a>
            <NuxtLink to="/me">
                <UButton>View session</UButton>
            </NuxtLink>
        </template>

        <template #cannot>
            <a href="/auth/github">
                <UButton>GitHub login</UButton>
            </a>
            <a href="/auth/google">
                <UButton>Google login</UButton>
            </a>
            <NuxtLink to="/me">
                <UButton>View session</UButton>
            </NuxtLink>
        </template>
    </Bouncer>
</div>
</template>
