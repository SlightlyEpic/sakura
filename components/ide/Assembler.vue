<script setup lang="ts">
import AVRLASS from '~/assets/lib/avrlass';

const props = defineProps<{
    asmSource: string,
}>();

const avr = new AVRLASS();
const hexOut = ref<string>();

function assemble() {
    hexOut.value = avr.asm_to_hex(props.asmSource ?? '', _ => '');
}

defineExpose({
    assemble
});
</script>

<template>
<div class="w-full h-full flex flex-col">
    <div>Assembled Hex:</div>
</div>
</template>
