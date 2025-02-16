<script setup lang="ts">
// import {Extension, EditorState} from "@codemirror/state"
import {javascript} from "@codemirror/lang-javascript"
import {EditorView, basicSetup} from "codemirror"
import { EditorState } from "@codemirror/state"
import {
    // EditorView, keymap, highlightSpecialChars, drawSelection,
    keymap, highlightSpecialChars, drawSelection,
    highlightActiveLine, dropCursor, rectangularSelection,
    crosshairCursor, lineNumbers, highlightActiveLineGutter
} from "@codemirror/view"
import {
    defaultHighlightStyle, syntaxHighlighting, indentOnInput,
    bracketMatching, foldGutter, foldKeymap
} from "@codemirror/language"
import {
    defaultKeymap, history, historyKeymap
} from "@codemirror/commands"
import {
    searchKeymap, highlightSelectionMatches
} from "@codemirror/search"
import {
    autocompletion, completionKeymap, closeBrackets,
    closeBracketsKeymap
} from "@codemirror/autocomplete"
import { lintKeymap } from "@codemirror/lint"
import { nuxtCodeMirrorTheme } from '~/assets/editor/theme'

let view: EditorView | undefined;
const container = ref<HTMLDivElement | null>(null);

onMounted(() => {
    view = new EditorView({
        doc: "Start document",
        parent: container.value!,
        extensions: [
            basicSetup,
            javascript({ typescript: true }),
            nuxtCodeMirrorTheme,
        ]
    });
    return;

    view = new EditorView({
        doc: "Start document",
        parent: container.value!,
        extensions: [
            // A line number gutter
            lineNumbers(),
            // A gutter with code folding markers
            foldGutter(),
            // Replace non-printable characters with placeholders
            highlightSpecialChars(),
            // The undo history
            history(),
            // Replace native cursor/selection with our own
            drawSelection(),
            // Show a drop cursor when dragging over the editor
            dropCursor(),
            // Allow multiple cursors/selections
            EditorState.allowMultipleSelections.of(true),
            // Re-indent lines when typing specific input
            indentOnInput(),
            // Highlight syntax with a default style
            syntaxHighlighting(defaultHighlightStyle),
            // Highlight matching brackets near cursor
            bracketMatching(),
            // Automatically close brackets
            closeBrackets(),
            // Load the autocompletion system
            autocompletion(),
            // Allow alt-drag to select rectangular regions
            rectangularSelection(),
            // Change the cursor to a crosshair when holding alt
            crosshairCursor(),
            // Style the current line specially
            highlightActiveLine(),
            // Style the gutter for current line specially
            highlightActiveLineGutter(),
            // Highlight text that matches the selected text
            highlightSelectionMatches(),
            keymap.of([
                // Closed-brackets aware backspace
                ...closeBracketsKeymap,
                // A large set of basic bindings
                ...defaultKeymap,
                // Search-related keys
                ...searchKeymap,
                // Redo/undo keys
                ...historyKeymap,
                // Code folding bindings
                ...foldKeymap,
                // Autocompletion keys
                ...completionKeymap,
                // Keys related to the linter system
                ...lintKeymap
            ])
        ]
    })
});
</script>

<template>
    <div ref="container" class="w-full h-full flex grow">

    </div>
</template>

<style>
.cm-editor {
    width: 100%;
}
</style>
