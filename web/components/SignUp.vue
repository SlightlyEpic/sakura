<script setup lang="ts">
import type { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types'
import type { FetchError } from 'ofetch';
import { signupBodySchema } from '~/shared/api-schema/auth';
import { authClient } from '~/lib/auth-client';

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
        const { data, error } = await authClient.signUp.email({
            name: event.data.name,
            email: event.data.email,
            password: event.data.password,
        });

        if(error) {
            toast.add({
                title: 'Sign Up failed',
                description: error.message ?? error.statusText,
                color: 'red',
            });
        } else {
            toast.add({
                title: 'Sign Up successful',
                color: 'green',
            });
        }
    } catch(_err: unknown) {
        const err = _err as FetchError;
        toast.add({
            title: 'Sign Up failed',
            description: err.statusMessage,
            color: 'red',
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

        <UDivider label="or" />

        <!-- Likely a bug in NuxtUI v3 -->
        <UForm :state="formState" :schema="signupBodySchema" @submit="onSubmit as any" class="flex flex-col gap-4">
            <UFormGroup name="name" class="flex flex-col gap-1">
                <template #label>
                    <span class="font-bold">Username</span>
                </template>
                <UInput v-model="formState.name" placeholder="Enter your username" size="md" />
            </UFormGroup>
            <UFormGroup name="email" class="flex flex-col gap-1">
                <template #label>
                    <span class="font-bold">Email</span>
                </template>
                <UInput v-model="formState.email" placeholder="Enter your email" size="md" />
            </UFormGroup>
            <UFormGroup  name="password" class="flex flex-col gap-1">
                <template #label>
                    <span class="font-bold">Password</span>
                </template>
                <UInput 
                    v-model="formState.password" 
                    :type="passwordVisible ? 'text' : 'password'" 
                    placeholder="Enter your password" 
                    size="md"
                >
                    <template #trailing>
                        <UButton :padded="false" variant="link" color="gray" @click="passwordVisible = !passwordVisible">
                            <UIcon v-if="passwordVisible" name="heroicons:eye-slash-16-solid" class="cursor-pointer z-10" size="20" />
                            <UIcon v-else name="heroicons:eye-16-solid" class="cursor-pointer z-10" size="20" />
                        </UButton>
                    </template>
                </UInput>
            </UFormGroup>

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