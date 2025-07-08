<script setup lang="ts">
import { authClient } from '~/lib/auth-client';
const session = authClient.useSession()
</script>

<template>
<div class="w-full h-full flex items-center justify-center">
    <div class="flex items-center justify-center whitespace-pre">
    {{ JSON.stringify(session, null, 4) }}
    </div>
</div>
</template>
