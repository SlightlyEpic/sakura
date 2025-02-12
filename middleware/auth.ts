export default defineNuxtRouteMiddleware((to, from) => {
    const session = useUserSession();
    console.log('session: ', session);
    if(!session.user.value) {
        return navigateTo(`/auth/login?to=${to.fullPath}`, { external: true });
    }
})
