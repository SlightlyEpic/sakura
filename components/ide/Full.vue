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
                    <UTabs :items="[{ label: 'simulator' }, { label: 'assembler' }]">
                        <template #simulator="{ item }">
                            <IdeSimulator />
                        </template>
                        <template #assembler="{ item }">
                            <IdeAssembler />
                        </template>
                    </UTabs>
                </SplitterPanel>
            </SplitterGroup>
        </ClientOnly>
    </div>
</template>