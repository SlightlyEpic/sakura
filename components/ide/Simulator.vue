<script setup lang="ts">
import { 
    avrInstruction, AVRIOPort, CPU, 
    PinState, 
    portBConfig, portCConfig, portDConfig,
} from 'avr8js';

const props = defineProps<{
    progData: Uint8Array | undefined,
}>();

let cpu = ref<CPU | undefined>();
let ports = ref(new Array<AVRIOPort | undefined>(3).fill(undefined));

function refresh() {
    if(!props.progData) return;

    cpu.value = new CPU(new Uint16Array(props.progData.buffer));

    ports.value[0] = new AVRIOPort(cpu.value, portBConfig);
    ports.value[1] = new AVRIOPort(cpu.value, portCConfig);
    ports.value[2] = new AVRIOPort(cpu.value, portDConfig);
}

function* range(a: number, b: number, step = 1) {
    for(let i = a; i < b; i += step) yield i;
}

// function process() {
//     for(let i = 0; i < 50000; i++) {
//         if(cpu.value) avrInstruction(cpu.value);
//     }
// }

// function prec() {
//     setTimeout(() => {
//         process();
//         prec();
//     }, 0);
// }

defineExpose({
    refresh
});
</script>

<template>
<div class="w-full h-full flex flex-col gap-2">
    <div class="flex gap-2">
        <UButton @click="() => cpu && avrInstruction(cpu)" class="w-max">Tick</UButton>
        <!-- <UButton @click="prec" class="w-max">Tick</UButton> -->
        <UButton @click="refresh" class="w-max">Refresh</UButton>
    </div>

    <div>
        PC: {{ cpu?.pc }}
    </div>

    <div class="grid grid-cols-3 gap-2">
        <div v-for="[i, portName] in ([[0, 'A'], [1, 'B'], [2, 'C']] as const)" :key="i" class="border p-2">
            <div>
                Port {{ portName }}:
                <span class="font-mono">
                    {{ [7, 6, 5, 4, 3, 2, 1, 0].map(v => ports[i]?.pinState(v) === PinState.Low ? '0' : '1').join('') }}
                </span>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-3 gap-2">
        <div v-for="i in range(0, 32)" :key="i" class="border p-2">
            <div>
                Reg {{ i }}:
                <span class="font-mono">
                    {{ cpu ? `${cpu.data[i]}` : '-' }}
                </span>
            </div>
        </div>
    </div>

    <div class="flex gap-2">
        <div class="border p-2">
            <div>
                Reg X:
                <span class="font-mono">
                    {{ cpu?.dataView.getUint16(26, true) }}
                </span>
            </div>
        </div>
        <div class="border p-2">
            <div>
                Reg Y:
                <span class="font-mono">
                    {{ cpu?.dataView.getUint16(28, true) }}
                </span>
            </div>
        </div>
        <div class="border p-2">
            <div>
                Reg Z:
                <span class="font-mono">
                    {{ cpu?.dataView.getUint16(30, true) }}
                </span>
            </div>
        </div>
    </div>
    <span>Simulator</span>
</div>
</template>