<script setup lang="ts">
import type { IdeEditor } from '#components';
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui';

const props = defineProps<{
    projectHumanId: string,
}>();

const editor = useTemplateRef('editor-ref');
const assembler = useTemplateRef('assembler-ref');
const simulator = useTemplateRef('simulator-ref');

const tabItems = [
    { label: 'Simulator' },
    { label: 'Assembler' },
];
</script>

<template>
    <div class="flex h-full w-full">
        <IdeSidebar />
        <ClientOnly>
            <template #fallback>
                <div class="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
                    <div>Loading</div>
                    <UProgress animation="carousel" class="w-full max-w-36" />
                </div>
            </template>

            <SplitterGroup direction="horizontal">
                <SplitterPanel>
                    <IdeEditor ref="editor-ref" :project-human-id="props.projectHumanId" />
                </SplitterPanel>
                <SplitterResizeHandle :as-child="true">
                    <UDivider class="w-0" orientation="vertical" icon="i-clarity-drag-handle-line" />
                </SplitterResizeHandle>
                <SplitterPanel>
                    <UTabs
                        :items="tabItems" 
                        class="flex flex-col h-full"
                        :ui="{
                            container: 'h-full *:h-full',
                            list: {
                                base: 'm-2'
                            }
                        }"
                    >
                        <template #item="{ item }">
                            <IdeSimulator
                                ref="simulator-ref" 
                                v-if="item.label === 'Simulator'"
                                :prog-data="assembler?.binOut"
                            />
                            <IdeAssemblerRemote 
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

<style>
[role=tablist] {
    width: auto;
}
</style>