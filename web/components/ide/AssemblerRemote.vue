<script setup lang="ts">
import { parse as parseIntelHex } from '~/assets/lib/intel-hex';

const props = defineProps<{
    asmSource: string,
}>();

const runtimeConfig = useRuntimeConfig();

const hexOut = ref<string>();
const binOut = ref<Uint8Array | undefined>();
const compileError = ref<string | undefined>();

async function assemble() {
    try {
        const compileEndpoint = runtimeConfig.public.compileServiceOrigin + '/compile';
        type CompileResponseBody = {
            $schema: string,
            hex: string,
            message: string,
        }
        const resp = await $fetch<CompileResponseBody>(compileEndpoint, {
            method: 'POST',
            body: JSON.stringify({
                objectName: 'blink.asm',
            })
        });
        const { data: newBin } = parseIntelHex(resp.hex);

        hexOut.value = resp.hex;
        binOut.value = newBin;
    } catch(_err: unknown) {
        compileError.value = `${_err}`;
        console.error(_err);
    }
}

defineExpose({
    assemble,
    hexOut,
    binOut,
});
</script>

<template>
<div class="w-full h-full flex flex-col gap-2 p-2">
    <UButton class="w-max" @click="assemble">Assemble</UButton>
    <div v-show="compileError" class="text-rose-500">
        Compile error: {{ compileError }}
    </div>
    <div v-show="!compileError" class="whitespace-pre flex flex-col">
        <div>Assembled Hex: </div>
        <div>{{ hexOut }}</div>
    </div>
    <div v-show="!compileError" class="flex flex-col">
        <div>Binary output: </div>
        <div>{{ binOut?.join(' ') }}</div>
    </div>
</div>
</template>
