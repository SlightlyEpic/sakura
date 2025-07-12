<script setup lang="ts">
import { EditorView, type ViewUpdate } from '@codemirror/view';
import { Compartment, type Extension } from '@codemirror/state';
import { indentUnit } from '@codemirror/language';
import type { CodeMirrorRef, Statistics } from '~/types/nuxt-codemirror';
import sampleCode from '~/assets/misc/sample-code.asm?raw';

const container = useTemplateRef<HTMLDivElement>('container');
const codemirror = useTemplateRef<CodeMirrorRef>('codemirror');

const code = ref(sampleCode);

// Editor settings
const wordWrap = ref(false);
const indentSize = ref(4);

// Extensions
const lineWrapComp = new Compartment();
const indentSizeComp = new Compartment();

const extensions: Extension[] = [
    lineWrapComp.of(wordWrap.value ? EditorView.lineWrapping : []),
    indentSizeComp.of(indentUnit.of(' '.repeat(indentSize.value))),
];

// Reconfigure extensions when refs change
watch(wordWrap, () => {
    if(!codemirror.value) return;
    if(!codemirror.value.view) return;
    codemirror.value.view.dispatch({
        effects: lineWrapComp.reconfigure(wordWrap.value ? EditorView.lineWrapping : []),
    });
});

watch(indentSize, () => {
    if(!codemirror.value) return;
    if(!codemirror.value.view) return;
    codemirror.value.view.dispatch({
        effects: indentSizeComp.reconfigure(indentUnit.of(' '.repeat(indentSize.value))),
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
        <IdeEditorSettings
            v-model:word-wrap="wordWrap"
            v-model:indent-size="indentSize"
        />
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
