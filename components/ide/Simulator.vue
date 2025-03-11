<script setup lang="ts">
import { 
    avrInstruction, AVRIOPort, CPU, 
    PinState, 
    portBConfig, portCConfig, portDConfig,
} from 'avr8js';
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui';

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
    <SplitterGroup direction="vertical">
        <SplitterPanel :default-size="75">
            <div class="w-full h-full flex flex-col gap-2 p-2">
                <div class="flex gap-2">
                    <UButton @click="() => cpu && avrInstruction(cpu)" class="w-max">Tick</UButton>
                    <!-- <UButton @click="prec" class="w-max">Tick</UButton> -->
                    <UButton @click="refresh" class="w-max">Refresh</UButton>
                </div>

                <div>
                    PC: {{ cpu?.pc }}
                </div>

                <div class="grid grid-cols-3 gap-2">
                    <div 
                        v-for="[i, portName] in ([[0, 'A'], [1, 'B'], [2, 'C']] as const)" 
                        :key="i" 
                        class="border p-2"
                    >
                        <div>
                            Port {{ portName }}:
                            <span class="font-mono">
                                {{ 
                                    [7, 6, 5, 4, 3, 2, 1, 0]
                                    .map(v => ports[i]?.pinState(v) === PinState.Low ? '0' : '1')
                                    .join('')
                                }}
                            </span>
                        </div>
                    </div>
                </div>
                <span>Simulator</span>
            </div>
        </SplitterPanel>
        <SplitterResizeHandle :as-child="true">
            <UDivider class="h-0" orientation="horizontal">
                <UIcon name="clarity:drag-handle-line" class="w-5 h-5 rotate-90" />
            </UDivider>
        </SplitterResizeHandle>
        <SplitterPanel :default-size="25">
            <IdeSimulatorRegisterView :cpu="cpu" />
        </SplitterPanel>
    </SplitterGroup>
</template>