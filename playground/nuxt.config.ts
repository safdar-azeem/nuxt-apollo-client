export default defineNuxtConfig({
  modules: ['../src/module'],
  ssr: true,
  apollo: {
    endPoints: {
      default: 'http://localhost:4041/graphql',
    },
    prefix: 'I',
  },
  devtools: { enabled: true },
})
