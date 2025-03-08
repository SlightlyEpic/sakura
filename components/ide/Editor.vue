<script setup lang="ts">
import type { ViewUpdate } from '@codemirror/view';
import type { LanguageSupport } from '@codemirror/language';
import type { CodeMirrorRef, Statistics } from '~/types/nuxt-codemirror';
import sampleCode from '~/assets/misc/sample-code.S?raw';

const container = useTemplateRef<HTMLDivElement>('container');
const codemirror = useTemplateRef<CodeMirrorRef>('codemirror');

const extensions: LanguageSupport[] = [];

const code = ref(sampleCode);

const handleChange = (value: string, viewUpdate: ViewUpdate) => {
    // console.log('Value changed:', value);
    // console.log('View updated:', viewUpdate);
};

const handleStatistics = (stats: Statistics) => {
    // console.log('Editor statistics:', stats);
};

const handleUpdate = (viewUpdate: ViewUpdate) => {
    // console.log('Editor updated:', viewUpdate);
};

defineExpose({
    code,
});
</script>

<template>
    <div ref="container" class="w-full h-full flex grow font-mono">
        <NuxtCodeMirror
            ref="codemirror"
            v-model="code"
            :extensions="extensions"
            theme="dark"
            placeholder="Enter your code here..."
            :auto-focus="true"
            :editable="true"
            :basic-setup="true"
            :indent-with-tab="true"
            @on-change="(handleChange)"
            @statistics="(handleStatistics)"
            @on-update="(handleUpdate)"
            class="w-full h-full"
        />
    </div>
</template>

<style>
.cm-editor {
    width: 100%;
    height: 100%;
}
</style>
