<script setup lang="ts">
import type { IdeEditor } from '#components';
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui';

const editor = useTemplateRef('editor-ref');
</script>

<template>
    <div class="flex h-full w-full">
        <IdeSidebar />
        <ClientOnly>
            <SplitterGroup direction="horizontal">
                <SplitterPanel>
                    <IdeEditor ref="editor-ref" />
                </SplitterPanel>
                <SplitterResizeHandle :as-child="true">
                    <UDivider orientation="vertical" icon="i-clarity-drag-handle-line" />
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
                            <IdeAssembler :asm-source="editor?.code ?? ''" v-else-if="item.label === 'Assembler'" />
                        </template>
                    </UTabs>
                </SplitterPanel>
            </SplitterGroup>
        </ClientOnly>
    </div>
</template>