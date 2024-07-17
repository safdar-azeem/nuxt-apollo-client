export default defineNuxtConfig({
  modules: ['../src/module'],
  ssr: true,
  apollo: {
    endPoints: {
      default: 'http://localhost:4000/graphql',
    },
    prefix: 'I',
  },
  pages: true,
  devtools: { enabled: true },
})
