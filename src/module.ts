import { name, version } from '../package.json'
import { addCodegenPlugin } from './runtime/codegen'
import type { SetGraphqlContext } from './runtime/graphql.config'
import type { ApolloClientOptions, InMemoryCacheConfig } from '@apollo/client'
import { addImportsDir, addPlugin, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'

interface Clients {
  [key: string]: string
  default: string
}

type PluginConfig<T = any> = {
  [key: string]: T
}

export interface ModuleOptions {
  prefix?: string
  gqlDir?: string
  endPoints: Clients
  tokenKey?: string
  plugins?: string[]
  runOnBuild?: boolean
  config?: PluginConfig
  enableWatcher?: boolean
  useGETForQueries?: boolean
  setContext?: SetGraphqlContext
  memoryConfig?: InMemoryCacheConfig
  apolloClientConfig?: ApolloClientOptions<any> | null
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'apollo',
  },
  defaults: {
    endPoints: {
      default: 'http://localhost:4000/graphql',
    },

    prefix: 'I',
    config: {},
    plugins: [],
    tokenKey: 'token',
    gqlDir: 'graphql',
    runOnBuild: false,
    memoryConfig: null,
    enableWatcher: true,
    setContext: () => ({}),
    useGETForQueries: false,
    apolloClientConfig: null,
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.runtimeConfig['endPoints'] = _options?.endPoints
    nuxt.options.runtimeConfig['tokenKey'] = _options?.tokenKey
    nuxt.options.runtimeConfig['setContext'] = _options?.setContext
    nuxt.options.runtimeConfig['memoryConfig'] = _options?.memoryConfig
    nuxt.options.runtimeConfig['useGETForQueries'] = _options?.useGETForQueries
    nuxt.options.runtimeConfig['apolloClientConfig'] = _options?.apolloClientConfig

    addTemplate({
      filename: 'apollo.d.ts',
      getContents: () =>
        [
          'import type { ClientConfig } from "@nuxtjs/apollo"',
          "declare module '#apollo' {",
          `  export type ApolloClientKeys = '${Object.keys(_options.endPoints).join("' | '")}'`,
          '  export const NuxtApollo: {',
          '    clients: Record<ApolloClientKeys, ClientConfig>',
          '    tokenKey: string',
          '  }',
          '}',
        ].join('\n'),
    })

    addTemplate({
      filename: 'apollo.mjs',
      write: true,
      getContents: () =>
        [
          'export const NuxtApollo = {',
          ` clients: ${JSON.stringify(_options?.endPoints)},`,
          ` tokenKey: ${JSON.stringify(_options?.tokenKey)},`,
          ` setContext: ${JSON.stringify(_options?.setContext)},`,
          ` memoryConfig: ${JSON.stringify(_options?.memoryConfig)},`,
          ` useGETForQueries: ${JSON.stringify(_options?.useGETForQueries)},`,
          ` apolloClientConfig: ${JSON.stringify(_options?.apolloClientConfig)},`,
          '}',
        ].join('\n'),
    })

    nuxt.options.alias['#apollo'] = resolve(nuxt.options.buildDir, 'apollo')

    addCodegenPlugin(_options, nuxt, resolve)

    nuxt.options.alias['#graphql'] = resolve('./runtime/composables')

    addPlugin(resolve('./runtime/plugin'))
    addImportsDir(resolve('./runtime/composables'))
  },
})
