import { name, version } from '../package.json'
import { addCodegenPlugin } from './runtime/codegen'
import type { ApolloUploadConfig, SetGraphqlContext } from './runtime/graphql.config'
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
  pluginConfig?: Partial<PluginConfig>
  enableWatcher?: boolean
  useGETForQueries?: boolean
  setContext?: SetGraphqlContext
  memoryConfig?: Partial<InMemoryCacheConfig>
  apolloClientConfig?: Partial<ApolloClientOptions<any>>
  apolloUploadConfig?: Partial<ApolloUploadConfig>
  refetchOnUpdate?: boolean
  refetchTimeout?: number
  allowOffline?: boolean
}

let isDone = false

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
    pluginConfig: {},
    plugins: [],
    tokenKey: 'token',
    gqlDir: 'graphql',
    runOnBuild: false,
    memoryConfig: null,
    enableWatcher: true,
    setContext: null,
    useGETForQueries: false,
    apolloClientConfig: null,
    allowOffline: false,
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    if (isDone) {
      nuxt.options.alias['#apollo'] = resolve(nuxt.options.buildDir, 'apollo')
      nuxt.options.alias['#graphql'] = `${nuxt.options?.rootDir}/${_options.gqlDir}/generated`
      return
    }

    nuxt.hook('prepare:types', ({ tsConfig }) => {
      tsConfig.compilerOptions = {
        ...tsConfig.compilerOptions,
        strict: false,
        noImplicitAny: false,
      }
    })

    addTemplate({
      filename: 'apollo.d.ts',
      getContents: () => `
        import type { ClientConfig } from "@nuxtjs/apollo"
        declare module '#apollo' {
          export type ApolloClientKeys = '${Object.keys(_options.endPoints).join("' | '")}'
          export const NuxtApollo: {
            clients: Record<ApolloClientKeys, ClientConfig>
            tokenKey: string
            setContext: (operationName: string, variables: any) => Record<string, any>
            gqlDir: string
            prefix: string
            config: Record<string, any>
            plugins: string[]
            runOnBuild: boolean
            enableWatcher: boolean
            memoryConfig: Record<string, any>
            useGETForQueries: boolean
            refetchOnUpdate: boolean
            refetchTimeout: number
            allowOffline: boolean
            apolloClientConfig: Record<string, any>
            apolloUploadConfig: Record<string, any>
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
          setContext:${_options.setContext},
          memoryConfig: ${JSON.stringify(_options.memoryConfig)},
          useGETForQueries: ${JSON.stringify(_options.useGETForQueries)},
          apolloClientConfig: ${JSON.stringify(_options.apolloClientConfig)},
          gqlDir: ${JSON.stringify(_options.gqlDir)},
          prefix: ${JSON.stringify(_options.prefix)},
          config: ${JSON.stringify(_options.pluginConfig)},
          plugins: ${JSON.stringify(_options.plugins)},
          runOnBuild: ${_options.runOnBuild},
          enableWatcher: ${_options.enableWatcher},
          refetchOnUpdate: ${_options?.refetchOnUpdate},
          refetchTimeout: ${_options?.refetchTimeout},
          allowOffline: ${_options?.allowOffline},
          apolloUploadConfig: ${_options.apolloUploadConfig},
        }
      `,
    })

    nuxt.options.alias['#apollo'] = resolve(nuxt.options.buildDir, 'apollo')
    nuxt.options.alias['#graphql'] = `${nuxt.options?.rootDir}/${_options.gqlDir}/generated`

    addPlugin(resolve('./runtime/plugin'))
    addCodegenPlugin(_options, nuxt, resolve)

    isDone = true

    addImportsDir(`${nuxt.options?.rootDir}/${_options?.gqlDir}/generated`)
    addImportsDir(resolve('./runtime/composables'))
  },
})
