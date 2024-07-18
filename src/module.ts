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
  apolloClientConfig?: ApolloClientOptions<any>
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
    setContext: null,
    useGETForQueries: false,
    apolloClientConfig: null,
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.hook('prepare:types', ({ tsConfig }) => {
      tsConfig.compilerOptions = {
        ...tsConfig.compilerOptions,
        strict: false,
        noImplicitAny: false,
      }
    })

    const runtimeConfig = {
      clients: _options.endPoints,
      tokenKey: _options.tokenKey || 'token',
      setContext: _options.setContext || (() => ({})),
      memoryConfig: _options.memoryConfig,
      useGETForQueries: _options.useGETForQueries,
      apolloClientConfig: _options.apolloClientConfig,
    }

    Object.assign(nuxt.options.runtimeConfig, runtimeConfig)

    addTemplate({
      filename: 'apollo.d.ts',
      getContents: () => `
        import type { ClientConfig } from "@nuxtjs/apollo"
        declare module '#apollo' {
          export type ApolloClientKeys = '${Object.keys(_options.endPoints).join("' | '")}'
          export const NuxtApollo: {
            clients: Record<ApolloClientKeys, ClientConfig>
            tokenKey: string
          }
        }
      `,
    })

    addTemplate({
      filename: 'apollo.mjs',
      write: true,
      getContents: () => `
        export const NuxtApollo = {
          clients: ${JSON.stringify(_options.endPoints)},
          tokenKey: ${JSON.stringify(_options.tokenKey)},
          setContext: ${JSON.stringify(_options.setContext)},
          memoryConfig: ${JSON.stringify(_options.memoryConfig)},
          useGETForQueries: ${JSON.stringify(_options.useGETForQueries)},
          apolloClientConfig: ${JSON.stringify(_options.apolloClientConfig)},
        }
      `,
    })

    nuxt.options.alias['#apollo'] = resolve(nuxt.options.buildDir, 'apollo')
    nuxt.options.alias['#graphql'] = `${nuxt.options?.rootDir}/${_options.gqlDir}/generated`

    addCodegenPlugin(_options, nuxt, resolve)
    addPlugin(resolve('./runtime/plugin'))
    addImportsDir(resolve('./runtime/composables'))
    addImportsDir(`${nuxt.options?.rootDir}/${_options?.gqlDir}/generated`)
  },
})
