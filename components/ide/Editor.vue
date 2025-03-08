<script setup lang="ts">
import { EditorView, type ViewUpdate } from '@codemirror/view';
import { Compartment, type Extension } from '@codemirror/state';
import type { CodeMirrorRef, Statistics } from '~/types/nuxt-codemirror';
import sampleCode from '~/assets/misc/sample-code.S?raw';

const container = useTemplateRef<HTMLDivElement>('container');
const codemirror = useTemplateRef<CodeMirrorRef>('codemirror');

const wordWrap = ref(false);
const code = ref(sampleCode);

const lineWrapComp = new Compartment();
const extensions: Extension[] = [
    lineWrapComp.of(wordWrap.value ? EditorView.lineWrapping : []),
];
    
watch(wordWrap, () => {
    if(!codemirror.value) return;
    if(!codemirror.value.view) return;
    codemirror.value.view.dispatch({
        effects: lineWrapComp.reconfigure(wordWrap.value ? EditorView.lineWrapping : []),
    });
})

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
    <div ref="container" class="w-full h-full flex flex-col grow font-mono">
        <div class="flex items-center justify-end h-8 px-2 gap-2">
            <div class="flex items-center gap-2">
                Word Wrap
                <UToggle v-model="wordWrap" />
            </div>
        </div>
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
