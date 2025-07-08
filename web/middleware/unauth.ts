import { authClient } from '~/lib/auth-client';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { data: session } = await authClient.useSession(useFetch);
    if (session.value) {
        const redirectTo = to.query.to as (string | string[] | undefined);
        return Array.isArray(redirectTo)
            ? navigateTo(redirectTo[0] ?? '/', { external: true })
            : navigateTo(redirectTo ?? '/', { external: true });
    }
})
