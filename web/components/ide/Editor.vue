<script setup lang="ts">
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { yCollab } from 'y-codemirror.next';
import { authClient } from '~/lib/auth-client';
import { userIdToColor } from '~/shared/utils/misc';
import { IdeEditorWithYjs } from '#components';
import type { Extension } from '@codemirror/state';

const props = defineProps<{
    projectHumanId: string,
}>();

const session = authClient.useSession();
const runtimeConfig = useRuntimeConfig();

const container = useTemplateRef<HTMLDivElement>('container');

// yjs
const userColor = computed(() => userIdToColor(session.value.data?.user.id ?? ''));
const ydoc = shallowRef<Y.Doc>();
const provider = shallowRef<WebsocketProvider>();
const ytext = shallowRef<Y.Text>();
const undoManager = shallowRef<Y.UndoManager>();
const yCollabExtension = shallowRef<Extension>();

const code = computed(() => ytext.value ? ytext.value.toString() : '');

// CodeMirror can only be mounted after this
const readyToMountCodeMirror = ref(false);

const { data: project, status: projectStatus } = useFetch(() => `/api/project/hid/${props.projectHumanId}`);

watch([project, projectStatus], async () => {
    if(readyToMountCodeMirror.value === false && projectStatus.value === 'success' && project.value && !provider.value) {
        const { token: authToken } = await $fetch<{ token: string }>('/api/auth/token');
        console.log('token:', authToken);
        ydoc.value = new Y.Doc();
        provider.value = new WebsocketProvider(
            runtimeConfig.public.ywebsocketServerEndpoint,
            project.value.id.toString(),
            ydoc.value,
            { params: { yauth: authToken } }
        );
        ytext.value = ydoc.value.getText();
        undoManager.value = new Y.UndoManager(ytext.value);
        provider.value.awareness.setLocalStateField('user', {
            name: session.value.data!.user.name,
            color: userColor.value,
            colorLight: '#ffffff'
        });
        yCollabExtension.value = yCollab(ytext.value, provider.value.awareness, { undoManager: undoManager.value });

        readyToMountCodeMirror.value = true;
    }
});

defineExpose({
    code,
})
</script>

<template>
    <div ref="container" class="w-full h-full flex flex-col grow font-mono">
        <div v-if="!readyToMountCodeMirror" class="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
            <div>Loading</div>
            <UProgress animation="carousel" class="w-full max-w-36" />
        </div>
        <IdeEditorWithYjs v-else 
            :project-id="project!.id" 
            :yCollabExtension="yCollabExtension!"
            :docText="ytext!"
        />
    </div>
</template>

<style>
.cm-editor {
    width: 100%;
    height: 100%;
}
</style>
