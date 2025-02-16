import { EditorView } from "@codemirror/view";
import { type Extension } from "@codemirror/state";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// Use Nuxt's default colors from Tailwind
const nuxtTheme = EditorView.theme({
    "&": {
        backgroundColor: "rgb(24, 24, 27)", // Tailwind's `bg-gray-900`
        color: "rgb(229, 231, 235)", // Tailwind's `text-gray-200`
        fontFamily: "Inter, sans-serif",
    },
    ".cm-content": {
        caretColor: "rgb(34, 211, 238)", // `text-cyan-400`
    },
    "&.cm-focused .cm-cursor": {
        borderLeftColor: "rgb(34, 211, 238)", // Cyan cursor
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: "rgba(34, 211, 238, 0.2)", // Cyan selection
    },
    ".cm-gutters": {
        backgroundColor: "rgb(17, 24, 39)", // `bg-gray-800`
        color: "rgb(156, 163, 175)", // `text-gray-400`
        border: "none",
    },
});

// Custom syntax highlighting
const nuxtHighlightStyle = HighlightStyle.define([
    { tag: t.keyword, color: "rgb(249, 115, 22)" }, // Orange keywords
    { tag: t.variableName, color: "rgb(34, 197, 94)" }, // Green variables
    { tag: t.string, color: "rgb(251, 191, 36)" }, // Yellow strings
    { tag: t.comment, color: "rgb(156, 163, 175)", fontStyle: "italic" }, // Gray comments
    { tag: t.function(t.variableName), color: "rgb(59, 130, 246)" }, // Blue function names
]);

export const nuxtCodeMirrorTheme: Extension = [
    nuxtTheme,
    syntaxHighlighting(nuxtHighlightStyle),
];
