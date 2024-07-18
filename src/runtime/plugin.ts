import { NuxtApollo } from '#apollo'
import { defineNuxtPlugin } from '#app'
import { graphqlConfig } from './graphql.config'
import { ApolloClients } from '@vue/apollo-composable'

export default defineNuxtPlugin((nuxtApp) => {
  const clients = graphqlConfig({
    endPoints: NuxtApollo.clients || {},
    tokenKey: NuxtApollo.tokenKey || 'token',
    setContext: NuxtApollo?.setContext,
  })

  nuxtApp.vueApp.provide(ApolloClients, clients)

  if (process.server) {
    nuxtApp.payload.apollo = {}
    nuxtApp.hook('app:rendered', () => {
      for (const [key, client] of Object.entries(clients)) {
        nuxtApp.payload.apollo[key] = client.extract()
      }
    })
  }

  if (process.client) {
    const apolloState = NuxtApollo.clients || {}
    for (const [key, state] of Object.entries(apolloState)) {
      clients[key].restore(state)
    }
  }

  return {
    provide: {
      apolloClients: clients,
    },
  }
})
