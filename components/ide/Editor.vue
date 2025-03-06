<script setup lang="ts">
import type { EditorState } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'

const editor = ref<HTMLDivElement | null>(null)
const container = ref<HTMLDivElement | null>(null)
const view = ref<EditorView>()
const state = ref<EditorState>()

const code = ref('');

defineExpose({
    code,
});
</script>

<template>
    <div ref="container" class="w-full h-full flex grow font-mono">
        <textarea 
            v-model="code"
            class="w-full h-full focus:outline-none focus:ring-0 px-4 py-2" 
            placeholder="code here"
        />
    </div>
</template>

<style>
.cm-editor {
    width: 100%;
}
</style>
