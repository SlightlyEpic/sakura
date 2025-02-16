<script setup lang="ts">
import type { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types'
import type { FetchError } from 'ofetch';
import { loginBodySchema } from '~/shared/api-schema/auth';

type Schema = z.output<typeof loginBodySchema>;

const props = defineProps<{
    onLoginRedirect?: string,
}>();

const formState = ref({
    email: 'sample@gmail.com',
    password: 'abcd1234',
});

const passwordVisible = ref(false);
const isLoading = ref(false);

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
    isLoading.value = true;
    try {
        await $fetch('/api/auth/login', {
            method: 'POST',
            body: event.data,
        });

        navigateTo(props.onLoginRedirect ?? '/');
    } catch(_err: unknown) {
        const err = _err as FetchError;
        toast.add({
            title: 'Login failed',
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
            <div class="text-2xl font-bold">Login</div>
            <div class="text-gray-400">Enter your credentials to access your account.</div>
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

        <UForm :state="formState" :schema="loginBodySchema" @submit="onSubmit" class="flex flex-col gap-4">
            <UFormGroup name="email" class="flex flex-col gap-1">
                <template #label>
                    <span class="font-bold">Email</span>
                </template>
                <UInput v-model="formState.email" placeholder="Enter your email" size="md" />
            </UFormGroup>
            <UFormGroup name="password" class="flex flex-col gap-1">
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
                Login
            </UButton>
        </UForm>

        <div class="flex justify-between gap-2">
            <NuxtLink to="/">
                <UButton variant="link">Home</UButton>
            </NuxtLink>
            <NuxtLink to="/auth/signup">
                <UButton variant="link">Switch to Sign Up</UButton>
            </NuxtLink>
        </div>
    </div>
</template>