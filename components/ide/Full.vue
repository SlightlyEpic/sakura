<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui';
</script>

<template>
    <div class="flex h-full w-full">
        <IdeSidebar />
        <ClientOnly>
            <SplitterGroup direction="horizontal">
                <SplitterPanel>
                    <IdeEditor />
                </SplitterPanel>
                <SplitterResizeHandle :as-child="true">
                    <USeparator orientation="vertical" icon="i-clarity-drag-handle-line" />
                </SplitterResizeHandle>
                <SplitterPanel>
                    <UTabs
                        :items="[{ label: 'Simulator' }, { label: 'Assembler' }]" 
                        class="h-full p-2"
                        :ui="{
                            container: 'h-full *:h-full',
                        }"
                    >
                        <template #item="{ item }">
                            <IdeSimulator v-if="item.label === 'Simulator'" />
                            <IdeAssembler asm-source="" v-else-if="item.label === 'Assembler'" />
                        </template>
                    </UTabs>
                </SplitterPanel>
            </SplitterGroup>
        </ClientOnly>
    </div>
</template>