import { useNuxtApp } from '#app'
import { provideApolloClients } from '@vue/apollo-composable'

export function loadApolloClients() {
  const nuxt = useNuxtApp()
  provideApolloClients(nuxt.$apolloClients as any)
}
