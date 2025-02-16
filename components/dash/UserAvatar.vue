<script setup lang="ts">
const session = useUserSession();

const items = [
    [{
        label: session.user.value?.email ?? '',
        slot: 'account',
        disabled: true
    }], [{
        label: 'Settings',
        icon: 'i-heroicons-cog-6-tooth',
        to: '/app/settings',
        external: true,     // temporary
    }, {
        label: 'Discord',
        icon: 'i-ri-discord-fill',
        to: 'https://discord.gg/programming',
        external: true,
        target: '_blank',
    }], [{
        label: 'Logout',
        icon: 'i-heroicons-arrow-left-on-rectangle',
        to: '/auth/logout',
        external: true,
    }]
]
</script>

<template>
    <UDropdown :items="items" v-if="session.user.value" class="*:w-full *:h-full *:text-center *:content-center">
        <UAvatar :alt="session.user.value.name" class="select-none hover:ring-2 cursor-pointer" size="md" />

        <template #account="{ item }">
            <div class="text-left">
                <p>
                    Signed in as
                </p>
                <p class="truncate font-medium text-gray-900 dark:text-white">
                    {{ item.label }}
                </p>
            </div>
        </template>

        <template #item="{ item }">
            <span class="truncate">{{ item.label }}</span>

            <UIcon v-if="item.icon" :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
        </template>
    </UDropdown>
    <NuxtLink v-else to="/auth/login">
        <UButton variant="outline">Login</UButton>
    </NuxtLink>
</template>
