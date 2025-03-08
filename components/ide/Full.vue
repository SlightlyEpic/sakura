<script setup lang="ts">
import type { IdeEditor } from '#components';
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui';

const editor = useTemplateRef('editor-ref');
const assembler = useTemplateRef('assembler-ref');
const simulator = useTemplateRef('simulator-ref');
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
                    <UDivider class="w-0" orientation="vertical" icon="i-clarity-drag-handle-line" />
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
                            <IdeSimulator
                                ref="simulator-ref" 
                                v-if="item.label === 'Simulator'"
                                :prog-data="assembler?.binOut"
                            />
                            <IdeAssembler 
                                ref="assembler-ref"
                                v-else-if="item.label === 'Assembler'"
                                :asm-source="editor?.code ?? ''"
                            />
                        </template>
                    </UTabs>
                </SplitterPanel>
            </SplitterGroup>
        </ClientOnly>
    </div>
</template>