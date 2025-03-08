// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  pages: true,
  modules: [
    'nuxt-auth-utils',
    'nuxt-authorization',
    '@nuxt/icon',
    '@nuxt/ui',
    '@pinia/nuxt',
    'nuxt-codemirror',
  ],
})