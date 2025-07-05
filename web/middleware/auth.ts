export default defineNuxtRouteMiddleware((to, from) => {
    const session = useUserSession();
    if(!session.user.value) {
        return navigateTo(`/auth/login?to=${to.fullPath}`, { external: true });
    }
})
