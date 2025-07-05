<script setup lang="ts">
const isOpen = ref(false);

const wordWrap = defineModel<boolean>('word-wrap', { default: false });
const indentSize = defineModel<number>('indent-size', { default: 4 });

const tabItems = [{
    label: 'General',
    icon: 'material-symbols:settings-outline-rounded'
}, {
    label: 'Theme',
    icon: 'proicons:dark-theme'
}]
</script>

<template>
<div class="flex items-center justify-end h-12 px-2 gap-2">
    <UButton color="white" label="Editor Options" @click="isOpen = true" />

    <UModal
        v-model="isOpen"
        :ui="{
            width: 'sm:max-w-screen-md',
            height: 'h-96'
        }"
    >
        <div class="w-full h-full flex p-2 gap-2">
            <UTabs
                :items="tabItems"
                orientation="vertical"
                :unmount="true"
                class="flex w-full"
                :ui="{
                    wrapper: 'w-full flex gap-2',
                    container: '!mt-0',
                    list: {
                        width: 'max-w-48',
                        tab: {
                            height: 'h-12'
                        }
                    }
                }"
            >
                <template #item="{ item }">
                    <div
                        v-if="item.label === 'General'"
                        class="w-full h-full flex flex-col gap-2 p-2"
                    >
                        <div class="flex justify-between items-center">
                            <div class="text-2xl font-bold">General Settings</div>
                            <UButton icon="material-symbols:close" variant="ghost" @click="isOpen = false" />
                        </div>
                        <UDivider class="mb-2" />
                        <div 
                            class="flex justify-between items-center rounded-md hover:bg-white/10 p-1 cursor-pointer"
                            @click="wordWrap = !wordWrap"
                        >
                            <div 
                                class="flex items-center gap-2 select-none transition-colors duration-100"
                                :class="{
                                    'text-gray-500': !wordWrap
                                }"
                            >
                                <UIcon name="ri:text-wrap" />
                                <div>Word Wrap</div>
                            </div>
                            <UToggle v-model="wordWrap" class="pointer-events-none" />
                        </div>
                        <div 
                            class="flex justify-between items-center rounded-md p-1"
                        >
                            <div class="flex items-center gap-2 select-none transition-colors duration-100">
                                <UIcon name="bi:indent" />
                                <div>Indent size</div>
                            </div>
                            <UInput type="number" v-model="indentSize" min="1" max="8" />
                        </div>
                    </div>

                    <div
                        v-else-if="item.label === 'Theme'"
                        class="w-full h-full flex flex-col gap-2 p-2"
                    >
                        <div class="flex justify-between items-center">
                            <div class="text-2xl font-bold">Theme Settings</div>
                            <UButton icon="material-symbols:close" variant="ghost" @click="isOpen = false" />
                        </div>
                        <UDivider class="mb-2" />
                    </div>
                </template>
            </UTabs>
        </div>
    </UModal>
</div>
</template>