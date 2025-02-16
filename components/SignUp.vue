<script setup lang="ts">
import type { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types'
import type { FetchError } from 'ofetch';
import { signupBodySchema } from '~/shared/api-schema/auth';

type Schema = z.output<typeof signupBodySchema>;

const props = defineProps<{
    onSignUpRedirect?: string,
}>();

const formState = ref({
    name: undefined,
    email: undefined,
    password: undefined,
});

const passwordVisible = ref(false);
const isLoading = ref(false);

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true;
    try {
        await $fetch('/api/auth/signup', {
            method: 'POST',
            body: event.data,
        });

        navigateTo(props.onSignUpRedirect ?? '/');
    } catch(_err: unknown) {
        const err = _err as FetchError;
        toast.add({
            title: 'Sign Up failed',
            description: err.statusMessage,
            color: 'error',
            duration: 3000,
        });
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="w-96 flex flex-col gap-4 p-2 rounded-md">
        <Icon name="heroicons:user-circle" size="2rem" />
        <div class="flex flex-col gap-2">
            <div class="text-2xl font-bold">Sign Up</div>
            <div class="text-gray-400">Enter your credentials to create your account.</div>
        </div>
        <div class="flex flex-col gap-2">
            <a href="/auth/github">
                <UButton class="w-full flex items-center justify-center gap-2" variant="soft" size="md">
                    <Icon name="icon-park-outline:github" size="20" /> GitHub
                </UButton>
            </a>
            <a href="/auth/google">
                <UButton class="w-full flex items-center justify-center gap-2" variant="soft" size="md">
                    <Icon name="icon-park-outline:google" size="20" /> Google
                </UButton>
            </a>
        </div>

        <USeparator label="or" />

        <!-- Likely a bug in NuxtUI v3 -->
        <UForm :state="formState" :schema="signupBodySchema" @submit="onSubmit as any" class="flex flex-col gap-4">
            <UFormField name="name" class="flex flex-col gap-1">
                <template #label>
                    <span class="font-bold">Username</span>
                </template>
                <UInput v-model="formState.name" placeholder="Enter your username" size="md" class="w-full" />
            </UFormField>
            <UFormField name="email" class="flex flex-col gap-1">
                <template #label>
                    <span class="font-bold">Email</span>
                </template>
                <UInput v-model="formState.email" placeholder="Enter your email" size="md" class="w-full" />
            </UFormField>
            <UFormField  name="password" class="flex flex-col gap-1">
                <template #label>
                    <span class="font-bold">Password</span>
                </template>
                <UInput 
                    v-model="formState.password" 
                    :type="passwordVisible ? 'text' : 'password'" 
                    placeholder="Enter your password" 
                    size="md"
                    class="w-full"
                >
                    <template #trailing>
                        <UButton :padded="false" variant="link" color="neutral" @click="passwordVisible = !passwordVisible">
                            <UIcon v-if="passwordVisible" name="heroicons:eye-slash-16-solid" class="cursor-pointer z-10" size="20" />
                            <UIcon v-else name="heroicons:eye-16-solid" class="cursor-pointer z-10" size="20" />
                        </UButton>
                    </template>
                </UInput>
            </UFormField>

            <UButton 
                type="submit" variant="soft" size="md"
                class="font-bold flex items-center justify-center" 
                :loading="isLoading"
            >
                Sign Up
            </UButton>
        </UForm>

        <div class="flex justify-between gap-2">
            <NuxtLink to="/">
                <UButton variant="link">Home</UButton>
            </NuxtLink>
            <NuxtLink to="/auth/login">
                <UButton variant="link">Switch to Login</UButton>
            </NuxtLink>
        </div>
    </div>
</template>