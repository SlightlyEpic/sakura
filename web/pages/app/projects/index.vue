<script setup lang="ts">
import { z } from 'zod';
import { FetchError } from 'ofetch';
import { project } from '~/server/database/schema';

definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard',
});

const toast = useToast();
const { data: projects, error, refresh: refreshProjects } = await useFetch('/api/project');

const createProjectModalOpen = ref(false);

const createProjectSchema = z.object({
    name: z.string().min(1),
    description: z.optional(z.string()),
});

const createProjectState = ref<z.infer<typeof createProjectSchema>>({
    name: '',
    description: '',
});

const createProjectLoading = ref(false);

async function createProject() {
    createProjectLoading.value = true;
    try {
        const projectData = { ...createProjectState.value };
        if(!projectData.description) delete projectData.description;

        await $fetch('/api/project', {
            method: 'POST',
            body: projectData,
        });

        toast.add({
            color: 'green',
            title: 'Project created',
        });
        refreshProjects();
    } catch(_err: unknown) {
        const err = _err as FetchError;

        toast.add({
            color: 'rose',
            title: 'Failed to create project',
            description: err.message,
        });

        console.warn(error);
    } finally {
        createProjectLoading.value = false;
    }
}
</script>

<template>
<div class="w-full h-full flex items-center justify-center">
    <div class="w-full h-full max-w-screen-md flex flex-col items-center justify-center gap-2">
        Whatupppppppp
        <UButton @click="createProjectModalOpen = true">Create project</UButton>
        <UModal v-model="createProjectModalOpen">
            <div class="p-4">
                <UForm 
                    :schema="createProjectSchema" 
                    :state="createProjectState" 
                    class="space-y-4 flex flex-col" 
                    @submit="createProject"
                >
                    <UFormGroup label="Name" name="name">
                        <UInput v-model="createProjectState.name" />
                    </UFormGroup>
                    <UFormGroup label="Description" name="description">
                        <UInput v-model="createProjectState.description" />
                    </UFormGroup>
                    <UButton type="submit" class="self-end" :loading="createProjectLoading">
                        Submit
                    </UButton>
                </UForm>
            </div>
        </UModal>

        <UDivider label="Projects" orientation="horizontal" />

        <div v-if="projects" class="w-full flex flex-col items-center justify-center">
            <div v-for="project of projects" class="w-full bg-gray-900 flex justify-between gap-2 p-4 text-sm border border-gray-800 rounded-md">
                <div class="flex flex-col gap-2">
                    <div>{{ project.name }} ({{ project.humanId }})</div>
                    <div>{{ project.id }}</div>
                </div>
                <div class="flex gap-2">
                    <UButton 
                        :to="`/app/projects/${project.humanId}`" 
                        icon="i-material-symbols-light:rocket-launch" 
                        class="w-12 h-12 justify-center"
                    />
                </div>
            </div>
        </div>
    </div>
</div>
</template>
