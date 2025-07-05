export default defineNuxtRouteMiddleware((to, from) => {
    const session = useUserSession();
    const redirectTo = to.query.to as (string | string[] | undefined);
    if(session.user.value) {
        if(Array.isArray(redirectTo)) return navigateTo(redirectTo[0] ?? '/', { external: true })
        else return navigateTo(redirectTo ?? '/', { external: true });
    }
})
