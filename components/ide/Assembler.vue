<script setup lang="ts">
import AVRLASS from '~/assets/lib/avrlass';

const props = defineProps<{
    asmSource: string,
}>();

// @ts-expect-error
const avr = AVRLASS as AVRLASS;
const hexOut = ref<string>();
const compileError = ref<string | undefined>();

const includeCache = useIncludeCacheStore();

async function readInclude(filename: string) {
    try {
        if(includeCache.get(filename)) {
            compileError.value = undefined;
            return includeCache.get(filename)!;
        }

        const res = await $fetch<string>(`/includes/${filename}`, {
            responseType: 'text'
        });

        includeCache.set(filename, res);
        compileError.value = undefined;
        return res;
    } catch(_err: unknown) {
        compileError.value = `Invalid include ${filename}`;
        throw _err;
    }
}

async function assemble() {
    console.log('assembling');
    try {
        hexOut.value = await avr.asm_to_hex(props.asmSource ?? '', readInclude);
    } catch(_err: unknown) {}
}

defineExpose({
    assemble
});
</script>

<template>
<div class="w-full h-full flex flex-col gap-2">
    <UButton class="w-max" @click="assemble">Assemble</UButton>
    <div class="whitespace-pre flex flex-col">
        <div>Code: </div>
        <div>{{ asmSource }}</div>
    </div>
    <div v-show="compileError" class="text-rose-500">
        Compile error: {{ compileError }}
    </div>
    <div v-show="!compileError" class="whitespace-pre flex flex-col">
        <div>Assembled Hex: </div>
        <div>{{ hexOut }}</div>
    </div>
</div>
</template>
