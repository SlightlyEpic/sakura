<script setup lang="ts">
import { viewAuthOnly } from '~/shared/abilities';

const session = useUserSession();
</script>

<template>
<div class="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
    <Bouncer :ability="viewAuthOnly" :args="[session.user]">
        <template #can>
            <div class="flex flex-col gap-2">
                <a href="/auth/logout">
                    <UButton>Logout</UButton>
                </a>
                <NuxtLink to="/me">
                    <UButton>View session</UButton>
                </NuxtLink>
            </div>
        </template>

        <template #cannot>
            <div class="flex flex-col gap-2">
                <a href="/auth/github">
                    <UButton>GitHub login</UButton>
                </a>
                <a href="/auth/google">
                    <UButton>Google login</UButton>
                </a>
                <NuxtLink to="/me">
                    <UButton>View session</UButton>
                </NuxtLink>
            </div>
        </template>
    </Bouncer>
</div>
</template>
