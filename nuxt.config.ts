// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  pages: true,
  css: ['~/assets/css/main.css'],
  modules: [
    'nuxt-auth-utils',
    'nuxt-authorization',
    '@nuxt/ui',
    '@nuxt/icon',
    '@pinia/nuxt',
  ],
})