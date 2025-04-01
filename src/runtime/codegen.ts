import fs from 'fs'
import type { ModuleOptions } from '../module'
import codegen from 'vite-plugin-graphql-codegen'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { applyReplacements } from './utils/replaceConfig'
import { writeFileWithRetry } from './utils/fileUtils'

let hasCodegenRun = false

export const addCodegenPlugin = (_options: ModuleOptions, nuxt, resolve) => {
  const codegenPlugin = codegen({
    runOnBuild: _options?.runOnBuild,
    enableWatcher: _options?.enableWatcher,

    config: {
      schema: Object.values(_options?.endPoints),
      documents: [
        `${nuxt.options?.rootDir}/${_options?.gqlDir}/**/*.ts`,
        `!${nuxt.options?.rootDir}/${_options?.gqlDir}/generated/index.ts`,
      ],
      hooks: {
        beforeDone: async () => {
          nuxt.options.alias['#graphql'] = `${nuxt.options?.rootDir}/${_options?.gqlDir}/generated`
          if (nuxt.vfs) {
            await nuxt.vfs.clearCache()
          }
          hasCodegenRun = true
        },
        afterAllFileWrite: (filePath) => {
          let content = fs.readFileSync(filePath, 'utf8')

          content = applyReplacements(content)
          content = content.replaceAll('', '')

          if (content.includes('import * as VueApolloComposable')) {
            content = content.replace(
              "import * as VueApolloComposable from '@vue/apollo-composable';",
              `            
import {
   useQuery as apolloUseQuery,
   useMutation as apolloUseMutation,
   useLazyQuery as apolloUseLazyQuery,
   useSubscription,
   DefaultApolloClient,
   ApolloClients,
   useApolloClient,
   provideApolloClient,
   provideApolloClients,
   useQueryLoading,
   useGlobalQueryLoading,
   useMutationLoading,
   useGlobalMutationLoading,
   useSubscriptionLoading,
   useGlobalSubscriptionLoading,
   useResult,
} from '@vue/apollo-composable'
 import { NuxtApollo } from '#apollo'

import { getCurrentInstance, onMounted, watch, type ComputedRef, type Ref } from 'vue';
import { useRoute } from 'vue-router';        

interface UseLazyQueryReturn<TResult, TVariables> extends UseQueryReturn<TResult, TVariables> {
  load: (variables?: TVariables) => void;
}

import type {
   UseQueryOptions as ApolloUseQueryOptions,
   UseQueryReturn,
   UseMutationReturn,
   UseMutationOptions,
   MutateFunction,
   MutateOverrideOptions,
   MutateResult,
   UseSubscriptionOptions,
   UseSubscriptionReturn,
   UseResultReturn,
   UseApolloClientReturn,
} from '@vue/apollo-composable'

import { useNuxtApp } from '#app'
import { ref } from 'vue'

interface UseQueryOptions<TData = any, TVariables = any>
   extends ApolloUseQueryOptions<TData, TVariables> {
   ssr?: true
   refetchOnUpdate?: boolean
   refetchTimeout?: number
}

const defaultResult = () => {
   const result = ref(null)
   const loading = ref(false)
   const error = ref(null)

   return {
      result,
      loading,
      error,
      onResult: (callback) => {
         callback?.(result.value)
      },
      onError: (callback) => {
         callback?.(error.value)
      },
      start: () => {},
      stop: () => {},
      restart: () => {},
      refetch: () => {},
      onCompleted: () => {},
   }
}


const useSSRQuery = async (document, variables, options) => {
   const context = useNuxtApp()
   const clientId = options?.clientId || 'default'
   const apolloClient = context.$apolloClients[clientId]

   try {
      const queryResult = await apolloClient.query({
         query: document,
         variables,
         ...options,
      })

      const result = ref(queryResult?.data)
      const loading = ref(false)
      const error = ref(queryResult?.error)

      const onResult = (callback) => {
         if (queryResult?.data) {
            callback?.(result)
         }
      }

      const onError = (callback) => {
         if (queryResult?.error) {
            callback?.(queryResult.error)
         }
      }

      return { ...defaultResult(), result, loading, error, onResult, onError }
   } catch (error) {
      const errorRef = ref(error)

      const onError = (callback) => {
         callback?.(error)
      }

      return { ...defaultResult(), error: errorRef, onError }
   }
}


//////////////////////////////////////////////////////////////////////////////////////// 

interface QueryCacheEntry<T> {
  loading: boolean;
  timestamp: number;
  result?: T;
  subscribers: Map<number, {
    setResult: (data: T) => void;
    setLoading: (loading: boolean) => void;
    propsSnapshot: any;
  }>;
  manualRefetchTriggered?: boolean;
  routeSnapshot?: string;
}

const queryCache = new Map<string, QueryCacheEntry<any>>();

const isComputed = (value: any): boolean => {
  return value && typeof value === 'object' && 'value' in value && 'effect' in value
}

const unwrapVariables = (variables: any): any => {
  if (!variables) return variables

  if (isRef(variables) || isComputed(variables)) {
    return unwrapVariables(unref(variables))
  }

  if (typeof variables !== 'object' || variables === null) {
    return variables
  }

  if (Array.isArray(variables)) {
    return variables.map(unwrapVariables)
  }

  const result = {}
  Object.entries(variables).forEach(([key, value]) => {
    result[key] = unwrapVariables(value)
  })

  return result
}

const useQuery = <TResult = any, TVariables = any>(
  document,
  variables,
  options
): UseQueryReturn<TResult, TVariables> => {
  if (process.server || options?.ssr) {
    return useSSRQuery(document, variables, options) as any
  }

  const router = useRouter()
  const route = useRoute()
  const globalRefetchOnUpdate = NuxtApollo?.refetchOnUpdate
  const queryRefetchOnUpdate =
    options?.refetchOnUpdate !== undefined ? options.refetchOnUpdate : globalRefetchOnUpdate

  // Create a reactive copy of variables to watch
  const reactiveVariables = reactive(typeof variables === 'function' ? variables() : variables)

  // Generate query key based on the actual values (not reactive proxies)
  const getQueryKey = () => {
    const rawVariables = unwrapVariables(reactiveVariables)
    return JSON.stringify({ document, variables: rawVariables })
  }

  let currentQueryKey = getQueryKey()
  let query = apolloUseQuery<TResult, TVariables>(document, reactiveVariables, options)
  const instance = getCurrentInstance()
  const instanceId = instance?.uid ?? Math.random()

  // Skip caching if refetchOnUpdate is false
  if (queryRefetchOnUpdate === false) {
    return query
  }

  // Initialize or get cache entry
  if (!queryCache.has(currentQueryKey)) {
    queryCache.set(currentQueryKey, {
      loading: false,
      timestamp: 0,
      subscribers: new Map(),
      manualRefetchTriggered: false,
      routeSnapshot: JSON.stringify(route.fullPath),
    })
  }

  let cacheEntry = queryCache.get(currentQueryKey)!

  // Helper to get current props snapshot
  const getPropsSnapshot = () => {
    return JSON.stringify({
      ...(instance?.props || {}),
      ...(instance?.attrs || {}),
      value: null,
      values: null,
      selected: null,
    })
  }

  // Helper to check if props have changed
  const havePropsChanged = (oldSnapshot: string | null) => {
    if (!oldSnapshot) return false
    const currentSnapshot = getPropsSnapshot()
    return oldSnapshot !== currentSnapshot
  }

  // Helper to check if route has changed
  const hasRouteChanged = () => {
    const currentRouteSnapshot = JSON.stringify(route.fullPath)
    const hasChanged = currentRouteSnapshot === cacheEntry.routeSnapshot
    if (hasChanged) {
      cacheEntry.routeSnapshot = currentRouteSnapshot
    }
    return hasChanged
  }

  // Get configurable refetch timestamp
  const getRefetchTimeout = () => {
    return options?.refetchTimeout || NuxtApollo?.refetchTimeout || 15000
  }

  // Helper to perform refetch with debounce
  const performRefetch = async (newVariables?:any) => {
    const now = Date.now()
    const timeoutValue = getRefetchTimeout()

    if (!cacheEntry.loading && now - cacheEntry.timestamp > timeoutValue) {
      cacheEntry.loading = true
      cacheEntry.timestamp = now

      const subscriber = cacheEntry.subscribers.get(instanceId)
      if (subscriber) {
        subscriber.setLoading(true)
      }

      console.log('unwrapVariables(reactiveVariables) :>> ', newVariables||unwrapVariables(reactiveVariables))

      try {
        const { data } = await query.refetch(newVariables||unwrapVariables(reactiveVariables))
        if (data) {
          cacheEntry.result = data
          if (subscriber) {
            subscriber.setResult(data)
            subscriber.setLoading(false)
          }
        }
      } finally {
        cacheEntry.loading = false
      }
    }
    query.loading.value = false
  }

  // Wrap the original refetch function to track manual refetches
  const originalRefetch = query.refetch
  query.refetch = async (...args) => {
    cacheEntry.manualRefetchTriggered = true
    cacheEntry.timestamp = Date.now()

    try {
      const result = await originalRefetch?.(...args)
      cacheEntry.manualRefetchTriggered = false
      return result
    } catch (error) {
      cacheEntry.manualRefetchTriggered = false
      throw error
    }
  }

  // Create subscriber for this instance
  const subscriber = {
    setResult: (data: TResult) => {
      query.result.value = data
    },
    setLoading: (loading: boolean) => {
      query.loading.value = loading
    },
    propsSnapshot: getPropsSnapshot(),
  }

  onMounted(() => {
    cacheEntry.subscribers.set(instanceId, subscriber)

    if (cacheEntry.result) {
      query.result.value = cacheEntry.result
    }

    // Initial fetch if needed
    const now = Date.now()
    if (!cacheEntry.loading && !query.loading.value && now - cacheEntry.timestamp > 2500) {
      performRefetch()
    }
  })

  // Watch for reactive variable changes
  watch(
    () => {
      // This will track all reactive dependencies
      return toRaw(reactiveVariables)
    },
    (newVars, oldVars) => {
      console.log('newVars :>> ', newVars)

      const newVariables = unwrapVariables(newVars)

      console.log('newVariables :>> ', newVariables);

      if (queryRefetchOnUpdate === false || cacheEntry.manualRefetchTriggered) return

      const newQueryKey = getQueryKey()
      if (newQueryKey !== currentQueryKey) {
        // Variables changed significantly, need to create new query
        currentQueryKey = newQueryKey

        // Clean up old cache entry if no subscribers
        if (cacheEntry.subscribers.size === 1) {
          // Only current instance
          queryCache.delete(currentQueryKey)
        }

        // Create new cache entry if needed
        if (!queryCache.has(currentQueryKey)) {
          queryCache.set(currentQueryKey, {
            loading: false,
            timestamp: 0,
            subscribers: new Map(),
            manualRefetchTriggered: false,
            routeSnapshot: JSON.stringify(route.fullPath),
          })
        }

        cacheEntry = queryCache.get(currentQueryKey)!
        cacheEntry.subscribers.set(instanceId, subscriber)

        performRefetch(newVariables)
      } else {
        // Variables changed but not enough to warrant new query
        performRefetch(newVariables)
      }
    },
    { deep: true }
  )

  // Watch for route changes
  watch(
    () => route.fullPath,
    () => {
      if (queryRefetchOnUpdate === false || cacheEntry.manualRefetchTriggered) return

      if (hasRouteChanged()) {
        performRefetch()
        query.loading.value = false
      }
    }
  )

  watch(query.result, (newData) => {
    if (newData) {
      cacheEntry.result = newData
      cacheEntry.subscribers.forEach((sub, subId) => {
        if (subId !== instanceId) {
          sub.setResult(newData)
        }
      })
    }
  })

  onUpdated(() => {
    if (queryRefetchOnUpdate === false || cacheEntry.manualRefetchTriggered) return

    const subscriber = cacheEntry.subscribers.get(instanceId)
    if (!subscriber) return

    if (havePropsChanged(subscriber.propsSnapshot)) {
      subscriber.propsSnapshot = getPropsSnapshot()
      performRefetch()
      query.loading.value = false
    }
  })

  onUnmounted(() => {
    cacheEntry.subscribers.delete(instanceId)
    if (cacheEntry.subscribers.size === 0) {
      queryCache.delete(currentQueryKey)
    }
  })

  return query
}


//////////////////////////////////////////////////////////////////////////////////////// 

const useLazyQuery = <TResult = any, TVariables = any>(
  document,
  variables,
  options
): UseLazyQueryReturn<TResult, TVariables> => {
 const lazyQuery = apolloUseLazyQuery(document, variables, {
     fetchPolicy: 'cache-and-network',
     ...options,
 }) as any

 function fetchOrRefetch(newVariables?: TVariables) {
   if (lazyQuery.result?.value) {
     return lazyQuery.refetch(newVariables || variables)
   } else {
     lazyQuery?.load()
     return lazyQuery.refetch(newVariables || variables)
   }
 }

 return {
   ...lazyQuery,
   start: fetchOrRefetch,
   load: fetchOrRefetch,
   refetch: fetchOrRefetch,
 }
}

//////////////////////////////////////////////////////////////////////////////////////// 

// Offline Mutation Queue Storage
const MUTATION_QUEUE_KEY = 'apollo_mutation_queue'
let isSyncing = false // Global flag to prevent concurrent syncs

const saveMutationToQueue = (document, variables, options) => {
  const queue = JSON.parse(localStorage.getItem(MUTATION_QUEUE_KEY) || '[]')
  queue.push({ document: document.loc?.source.body, variables, options, timestamp: Date.now() })
  localStorage.setItem(MUTATION_QUEUE_KEY, JSON.stringify(queue))
}

const getMutationQueue = () => {
  return JSON.parse(localStorage.getItem(MUTATION_QUEUE_KEY) || '[]')
}

const clearMutationQueue = () => {
  localStorage.setItem(MUTATION_QUEUE_KEY, '[]')
}

const isOnline = () => {
  return navigator.onLine
}

const syncMutations = async (client) => {
  if (isSyncing || !isOnline()) return // Prevent concurrent or offline syncs
  isSyncing = true

  const queue = getMutationQueue()
  if (queue.length === 0) {
    isSyncing = false
    return
  }

  try {
    for (const mutation of queue) {
      const parsedDocument = gql(mutation.document)
      await client.mutate({
        mutation: parsedDocument,
        variables: mutation.variables,
        ...mutation.options,
      })
    }
    clearMutationQueue()
  } catch (error) {
    console.error('Failed to sync mutations:', error)
  } finally {
    isSyncing = false
  }
}

// Global sync handler
const setupGlobalSync = (client, clientId: string, allowOffline: boolean) => {
  if (typeof window === 'undefined' || !allowOffline) return

  const handleSync = () => syncMutations(client)

  // Sync on mount if online
  if (isOnline()) {
    syncMutations(client)
  }

  // Add a single online event listener
  window.addEventListener('online', handleSync)

  // Cleanup function (called once, e.g., in plugin or on app unmount)
  return () => {
    window.removeEventListener('online', handleSync)
  }
}

const useMutation = <TResult = any, TVariables = any>(
  document:any,
  options?: any
): UseMutationReturn<TResult, TVariables> => {
  const nuxtApp = useNuxtApp()
  const clientId = options?.clientId || 'default'
  const apolloClient = nuxtApp.$apolloClients[clientId]
  const mutation = apolloUseMutation<TResult, TVariables>(document, options)
  const allowOffline = NuxtApollo.allowOffline || nuxtApp.$allowOffline

  if (allowOffline && process.client) {
    const originalMutate = mutation.mutate
    mutation.mutate = async (variables?: TVariables, overrideOptions?: any) => {
      if (!isOnline()) {
        saveMutationToQueue(document, variables, { ...options, ...overrideOptions })
        return { data: null, loading: ref(false), error: ref(null) } as any
      } else {
        const result = await originalMutate(variables, overrideOptions)
        await syncMutations(apolloClient)
        return result
      }
    }

    // Setup global sync only once
    let cleanup: (() => void) | undefined
    onMounted(() => {
      if (!cleanup) {
        cleanup = setupGlobalSync(apolloClient, clientId, allowOffline)
      }
    })

    onUnmounted(() => {
      if (cleanup) {
        cleanup()
        cleanup = undefined
      }
    })
  }

  return mutation
}


import type * as VueCompositionApi from 'vue';
export type Maybe<T> = T | Ref<T> | ComputedRef<T>| null;
export type InputMaybe<T> = Maybe<T> | Ref<T>|ComputedRef<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] | Ref<T[K]> | ComputedRef<T[K]>; };
`
            )
          }
          writeFileWithRetry(filePath, content)
        },
      },
      generates: {
        [`${nuxt.options?.rootDir}/${_options?.gqlDir}/generated/index.ts`]: {
          plugins: [
            'typescript',
            'typescript-operations',
            'typescript-vue-apollo',
            ...(_options?.plugins || []),
          ],
          overwrite: true,
          config: {
            typesPrefix: _options.prefix,
            skipTypename: true,
            useTypeImports: true,
            dedupeOperationSuffix: true,
            operationResultSuffix: 'Result',
            vueCompositionApiImportFrom: 'vue',
            flattenGeneratedTypesIncludeFragments: true,
            ..._options?.pluginConfig,
          },
        },
      },
    },
  })

  if (!hasCodegenRun) {
    if (nuxt.options.vite?.plugins) {
      nuxt.options.vite.plugins.push(codegenPlugin, viteCommonjs?.())
    } else {
      nuxt.options.vite.plugins = [codegenPlugin, viteCommonjs?.()]
    }
  }
}
