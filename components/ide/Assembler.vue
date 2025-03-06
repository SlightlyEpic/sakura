<script setup lang="ts">
import AVRLASS from '~/assets/lib/avrlass';
import m328pdef from '~/assets/includes/m328pdef.inc?raw';

const props = defineProps<{
    asmSource: string,
}>();

// @ts-expect-error
const avr = AVRLASS as AVRLASS;
const hexOut = ref<string>();

function readInclude(filename: string) {
    return '';
}

function assemble() {
    console.log('assembling');
    const withIncludes = m328pdef + '\n' + (props.asmSource ?? '');
    hexOut.value = avr.asm_to_hex(withIncludes, readInclude);
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
    <div class="whitespace-pre flex flex-col">
        <div>Assembled Hex: </div>
        <div>{{ hexOut }}</div>
    </div>
</div>
</template>
