export default defineNuxtConfig({
  modules: ['../src/module'],
  ssr: true,

  apollo: {
    endPoints: {
      default: 'http://localhost:4009/graphql',
    },
    prefix: 'I',
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-08-22',
})
