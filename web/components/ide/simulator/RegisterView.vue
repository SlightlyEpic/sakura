<script setup lang="ts">
import type { CPU } from 'avr8js';
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui';
import { leftPad, range } from '~/shared/utils/misc';

const props = defineProps<{
    cpu: CPU | undefined,
}>();

const numberBase = ref<'Binary' | 'Decimal' | 'Hex'>('Binary')
const numberBaseOptions = ['Binary', 'Decimal', 'Hex'];

const registers = new Array(32).fill(0).map((_, i) => computed(() => {
    if(!props.cpu) {
        switch(numberBase.value) {
            case 'Binary': return '0b00000000';
            case 'Decimal': return '0';
            case 'Hex': return '0x00';
        }
    }

    let regValue = props.cpu.data[i];
    switch(numberBase.value) {
        case 'Binary': return '0b' + leftPad(regValue.toString(2), 8, '0');
        case 'Decimal': return regValue;
        case 'Hex': return '0x' + leftPad(regValue.toString(2), 2, '0');
    }
}))

const bigRegisters = [0, 1, 2].map(i => computed(() => {
    if(!props.cpu) {
        switch(numberBase.value) {
            case 'Binary': return '0b0000000000000000';
            case 'Decimal': return '0';
            case 'Hex': return '0x0000';
        }
    }

    const regValue = props.cpu.dataView.getUint16(26 + 2 * i, true);
    switch(numberBase.value) {
        case 'Binary': return '0b' + leftPad(regValue.toString(2), 16, '0');
        case 'Decimal': return regValue;
        case 'Hex': return '0x' + leftPad(regValue.toString(2), 4, '0');
    }
}))
</script>

<template>
<div class="@container flex flex-col w-full h-full p-2 gap-2 justify-between">
    <div class="flex flex-col gap-2 font-mono h-full max-h-full overflow-y-scroll">
        <CollapsibleRoot class="group">
            <CollapsibleTrigger :as-child="true">
                <UButton variant="ghost" class="w-full group-data-[state=open]:bg-primary-950">
                    <div>R0 - R15</div>
                    <template #leading>
                        <UIcon 
                            name="mdi:chevron-down" size="24"
                            class="transition-transform duration-300 rotate-0 group-data-[state=open]:rotate-180"
                        />
                    </template>
                </UButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div class="grid dyn-grid-cols gap-2">
                    <div v-for="i in range(0, 16)" :key="i" class="p-2">
                        <div>
                            Reg <span class="whitespace-pre">{{ leftPad(`${i}`, 2) }}</span>:
                            <span>
                                {{ registers[i] }}
                            </span>
                        </div>
                    </div>
                </div>
            </CollapsibleContent>
        </CollapsibleRoot>

        <CollapsibleRoot class="group">
            <CollapsibleTrigger :as-child="true">
                <UButton variant="ghost" class="w-full group-data-[state=open]:bg-primary-950">
                    <div>R16 - R31</div>
                    <template #leading>
                        <UIcon 
                            name="mdi:chevron-down" size="24"
                            class="transition-transform duration-300 rotate-0 group-data-[state=open]:rotate-180"
                        />
                    </template>
                </UButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div class="grid dyn-grid-cols gap-2">
                    <div v-for="i in range(16, 32)" :key="i" class="p-2">
                        <div>
                            Reg <span class="whitespace-pre">{{ leftPad(`${i}`, 2) }}</span>:
                            <span>
                                {{ registers[i] }}
                            </span>
                        </div>
                    </div>
                </div>
            </CollapsibleContent>
        </CollapsibleRoot>

        <CollapsibleRoot class="group">
            <CollapsibleTrigger :as-child="true">
                <UButton variant="ghost" class="w-full group-data-[state=open]:bg-primary-950">
                    <div>Rx Ry Rz</div>
                    <template #leading>
                        <UIcon 
                            name="mdi:chevron-down" size="24"
                            class="transition-transform duration-300 rotate-0 group-data-[state=open]:rotate-180"
                        />
                    </template>
                </UButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div class="grid @sm:grid-cols-2 @lg:grid-cols-3 gap-2">
                    <div 
                        v-for="[i, regName] in ([[0, 'X'], [1, 'Y'], [2, 'Z']] as const)" 
                        :key="i" 
                        class="p-2"
                    >
                        <div>
                            Reg {{ regName }}:
                            <span class="font-mono">
                                {{ bigRegisters[i] }}
                            </span>
                        </div>
                    </div>
                </div>
            </CollapsibleContent>
        </CollapsibleRoot>

        
    </div>
    <div class="flex justify-end gap-2 shrink-0">
        <USelect
            v-model="numberBase"
            :options="numberBaseOptions"
            class="w-fit"
        />
    </div>
</div>
</template>

<style scoped>
.dyn-grid-cols {
    @apply @xs:grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3
}
</style>