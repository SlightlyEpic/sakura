// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  pages: true,
  modules: [
    '@nuxt/icon',
    '@nuxt/ui',
    '@pinia/nuxt',
    'nuxt-codemirror',
  ],
  runtimeConfig: {
    public: {
      compileServiceOrigin: process.env.COMPILE_SERVICE_ORIGIN,
      ywebsocketServerEndpoint: process.env.YWEBSOCKET_SERVER_ENDPOINT,
    }
  }
})