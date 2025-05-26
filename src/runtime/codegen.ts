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
      watch: [`${nuxt.options?.rootDir}/${_options?.gqlDir}`],
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
 import * as allGraphqlDocuments from '#graphql'

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
  loading: boolean
  timestamp: number
  result?: T
  subscribers: Map<
    number,
    {
      setResult: (data: T) => void
      setLoading: (loading: boolean) => void
      propsSnapshot: any
      isActive: boolean
    }
  >
  manualRefetchTriggered?: boolean
  routeSnapshot?: string
  isCacheOnly?: boolean
  lastActiveTimestamp?: number
}

const queryCache = new Map<string, QueryCacheEntry<any>>()
const pendingQueries = new Map<string, AbortController>()
const DEFAULT_REFETCH_TIMEOUT = 11000

// Add a periodic cache cleaner for inactive queries
if (process.client) {
  // Run every minute to clean up inactive queries
  const CLEANUP_INTERVAL = 60000;
  const MAX_INACTIVE_TIME = 300000; // 5 minutes of inactivity
  
  setInterval(() => {
    const now = Date.now();
    
    queryCache.forEach((entry, key) => {
      // Skip cache-only queries
      if (entry.isCacheOnly) return;
      
      // Check if query has any active subscribers
      let hasActiveSubscribers = false;
      entry.subscribers.forEach(sub => {
        if (sub.isActive) hasActiveSubscribers = true;
      });
      
      // If no active subscribers and last active time was too long ago, clean up
      if (!hasActiveSubscribers && 
          entry.lastActiveTimestamp && 
          now - entry.lastActiveTimestamp > MAX_INACTIVE_TIME) {
        // Cancel any in-flight requests
        const controller = pendingQueries.get(key);
        if (controller) {
          controller.abort();
          pendingQueries.delete(key);
        }
        
        // Only remove if not manually refetching
        if (!entry.manualRefetchTriggered) {
          queryCache.delete(key);
        }
      }
    });
  }, CLEANUP_INTERVAL);
}

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

  const route = useRoute()
  const globalRefetchOnUpdate = NuxtApollo?.refetchOnUpdate
  const queryRefetchOnUpdate =
    options?.refetchOnUpdate !== undefined ? options.refetchOnUpdate : globalRefetchOnUpdate

  // Skip caching if refetchOnUpdate is false
  if (!queryRefetchOnUpdate) {
    return apolloUseQuery<TResult, TVariables>(document, variables, options);
  }

  // Create a reactive copy of variables to watch
  const reactiveVariables = reactive(typeof variables === 'function' ? variables() : variables)

  const instance = getCurrentInstance()
  const instanceId = instance?.uid ?? Math.random()

  const getQueryKey = () => {
    const operationName = document?.definitions?.[0]?.name?.value || 'Unnamed'
    const rawVariables = unwrapVariables(reactiveVariables)

    return JSON.stringify({
      key: operationName,
      variables: rawVariables,
    })
  }

  const isCacheOnly =
    options?.nextFetchPolicy === 'cache-only' || options?.fetchPolicy === 'cache-only'

  let currentQueryKey = getQueryKey()

  // Use lazy query to have more control over execution
  let query = useLazyQuery<TResult, TVariables>(document, reactiveVariables, options)

  // Initialize or get cache entry
  if (!queryCache.has(currentQueryKey)) {
    queryCache.set(currentQueryKey, {
      loading: false,
      timestamp: 0,
      subscribers: new Map(),
      manualRefetchTriggered: false,
      routeSnapshot: JSON.stringify(route.fullPath),
      isCacheOnly,
      lastActiveTimestamp: Date.now() // Initialize with current timestamp
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
    return options?.refetchTimeout || NuxtApollo?.refetchTimeout || DEFAULT_REFETCH_TIMEOUT
  }

  // Cancel any in-flight request for this query
  const cancelInFlightRequests = () => {
    const controller = pendingQueries.get(currentQueryKey)
    if (controller) {
      controller.abort()
      pendingQueries.delete(currentQueryKey)
    }
  }

  // Check if query is currently active (visible on page)
  const isQueryActive = () => {
    // If this subscriber is active, the query is active
    if (cacheEntry.subscribers.has(instanceId) && 
        cacheEntry.subscribers.get(instanceId)?.isActive) {
      return true;
    }
    
    // If any subscriber is active, the query is active
    for (const sub of cacheEntry.subscribers.values()) {
      if (sub.isActive) return true;
    }
    
    return false;
  }
  
  // Update the last active timestamp for this query
  const updateActiveTimestamp = () => {
    if (isQueryActive()) {
      cacheEntry.lastActiveTimestamp = Date.now();
    }
  }
  
  // Helper to perform refetch with debounce
  const performRefetch = async (newVariables?: any) => {
    const now = Date.now()
    const timeoutValue = getRefetchTimeout()
    
    // Update active timestamp
    updateActiveTimestamp()

    // Return cached result if we're within debounce window
    if (now - cacheEntry.timestamp < timeoutValue && cacheEntry.result) {
      query.result.value = cacheEntry.result
      query.loading.value = false
      return Promise.resolve({ data: cacheEntry.result })
    }
    
    // If query isn't active and this isn't a manual refetch, don't refetch
    if (!cacheEntry.manualRefetchTriggered && !isQueryActive()) {
      // Just use the cached result if available
      if (cacheEntry.result) {
        query.result.value = cacheEntry.result
        query.loading.value = false
        return Promise.resolve({ data: cacheEntry.result })
      }
    }


    // Create new abort controller for this request
    const controller = new AbortController()
    pendingQueries.set(currentQueryKey, controller)

    // Set loading state but only if this is the initial load
    const isInitialLoad = !cacheEntry.result
    if (isInitialLoad) {
      cacheEntry.loading = true
      query.loading.value = true
      
      // Notify all subscribers about loading state (but only for initial load)
      cacheEntry.subscribers.forEach(subscriber => {
        subscriber.setLoading(true)
      })
    }

    cacheEntry.timestamp = now

    // Create the fetch promise
    const fetchPromise = query.refetch(newVariables || unwrapVariables(reactiveVariables))

    try {
      const result = await fetchPromise
      
      // Only process result if this request wasn't aborted
      if (!controller.signal.aborted) {
        if (result?.data) {
          cacheEntry.result = result.data
          
          // Update all subscribers with new data
          cacheEntry.subscribers.forEach(subscriber => {
            subscriber.setResult(result.data)
            subscriber.setLoading(false)
          })
        }

        pendingQueries.delete(currentQueryKey)
        return result
      }
    } catch (error) {
      // Only handle error if not aborted
      if (!controller.signal.aborted) {
        console.error("Query error:", error)
        pendingQueries.delete(currentQueryKey)
      }
      throw error
    } finally {
      cacheEntry.loading = false
      query.loading.value = false
    }
  }

  // Wrap the original refetch function to track manual refetches
  const originalRefetch = query.refetch
  query.refetch = async (...args) => {
    cacheEntry.manualRefetchTriggered = true
    cacheEntry.timestamp = Date.now() // Reset timestamp on manual refetch
    
    // Cancel any ongoing requests first
    cancelInFlightRequests()

    try {
      const result = await originalRefetch?.(...args)
      if (result?.data) {
        cacheEntry.result = result.data
        query.result.value = result.data
        
        // Update all subscribers
        cacheEntry.subscribers.forEach(subscriber => {
          subscriber.setResult(result.data)
        })
      }
      return result
    } catch (error) {
      throw error
    } finally {
      cacheEntry.manualRefetchTriggered = false
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
    isActive: true
  }

  // Track visibility changes for this component
  const updateVisibility = (isVisible = true) => {
    const sub = cacheEntry.subscribers.get(instanceId);
    if (sub) {
      sub.isActive = isVisible;
      if (isVisible) {
        updateActiveTimestamp();
      }
    }
  }
  
  // Use Vue's lifecycle hooks for visibility
  onMounted(() => {
    // Add this instance as a subscriber
    cacheEntry.subscribers.set(instanceId, subscriber)
    updateVisibility(true);
    
    // If we already have a result, use it
    if (cacheEntry.result) {
      query.result.value = cacheEntry.result
      query.loading.value = false
    }

    // For cache-only queries, if we have a result, don't fetch again
    if (isCacheOnly && cacheEntry.result) return

    // Initial fetch if needed
    const now = Date.now()
    const shouldFetch = !cacheEntry.result || 
                        (now - cacheEntry.timestamp > getRefetchTimeout() && !cacheEntry.isCacheOnly);
                        
    if (shouldFetch) {
      performRefetch()
    }
  })
  

      // Watch for reactive variable changes
  watch(
    () => {
      // This will track all reactive dependencies
      return toRaw(reactiveVariables)
    },
    (newVars) => {
      if (queryRefetchOnUpdate === false || cacheEntry.manualRefetchTriggered) return
      
      // Update active timestamp since variables are changing on an active component
      updateActiveTimestamp()
      
      const newVariables = unwrapVariables(newVars)
      const newQueryKey = getQueryKey()
      
      // If the variables changed significantly, need to create a new query
      if (newQueryKey !== currentQueryKey) {
        // Variables changed significantly, need to create new query
        
        // Clean up old cache entry if this is the only subscriber
        if (cacheEntry.subscribers.size === 1) {
          queryCache.delete(currentQueryKey)
        } else {
          // Just remove this instance from subscribers
          cacheEntry.subscribers.delete(instanceId)
        }
        
        // Update current query key
        currentQueryKey = newQueryKey

        // Create new cache entry if needed
        if (!queryCache.has(currentQueryKey)) {
          queryCache.set(currentQueryKey, {
            loading: false,
            timestamp: 0,
            subscribers: new Map(),
            manualRefetchTriggered: false,
            routeSnapshot: JSON.stringify(route.fullPath),
            isCacheOnly,
            lastActiveTimestamp: Date.now()
          })
        }

        cacheEntry = queryCache.get(currentQueryKey)!
        cacheEntry.subscribers.set(instanceId, subscriber)

        // Always perform refetch with new variables, regardless of active state
        performRefetch(newVariables)
      } else {
        // Variables changed but not enough to warrant new query
        const now = Date.now()
        if (!isCacheOnly && now - cacheEntry.timestamp > getRefetchTimeout() && isQueryActive()) {
          performRefetch(newVariables)
        }
      }
    },
    { deep: true }
  )

  // Watch for route changes
  watch(
    () => route.fullPath,
    () => {
      if (isCacheOnly) return
      if (queryRefetchOnUpdate === false || cacheEntry.manualRefetchTriggered) return

      // Update active timestamp as this is a route change with this component active
      updateActiveTimestamp()
      
      const now = Date.now()
      if (now - cacheEntry.timestamp > getRefetchTimeout()) {
        if (hasRouteChanged() && isQueryActive()) {
          performRefetch()
        }
      }
    }
  )

  // Handle result updates to propagate to other subscribers
  watch(query.result, (newData) => {
    if (newData) {
      cacheEntry.result = newData
      
      // Only update other subscribers
      cacheEntry.subscribers.forEach((sub, subId) => {
        if (subId !== instanceId) {
          sub.setResult(newData)
        }
      })
    }
  })

  // Component update hook
  onUpdated(() => {
    if (isCacheOnly) return
    if (queryRefetchOnUpdate === false || cacheEntry.manualRefetchTriggered) return

    const subscriber = cacheEntry.subscribers.get(instanceId)
    if (!subscriber) return
    
    // Mark as active since component is updating
    subscriber.isActive = true
    updateActiveTimestamp()

    const now = Date.now()
    if (havePropsChanged(subscriber.propsSnapshot) && 
        now - cacheEntry.timestamp > getRefetchTimeout() && 
        isQueryActive()) {
      subscriber.propsSnapshot = getPropsSnapshot()
      performRefetch()
    }
  })

  // Clean up on unmount
  onUnmounted(() => {
    // Mark this subscriber as inactive first
    updateVisibility(false);
    
    // If this is a cache-only query, just mark it as inactive but keep in subscribers
    if (isCacheOnly) {
      const sub = cacheEntry.subscribers.get(instanceId);
      if (sub) {
        sub.isActive = false;
      }
    } else {
      // For regular queries, remove from subscribers
      cacheEntry.subscribers.delete(instanceId)
      
      // Remove cache entry if this was the last subscriber and not cache-only
      if (cacheEntry.subscribers.size === 0 && !isCacheOnly) {
        queryCache.delete(currentQueryKey)
        cancelInFlightRequests()
      }
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

  // Always keep loading as false after initial fetch
  const loadingState = ref(false)
  
  async function fetchOrRefetch(newVariables?: TVariables) {
      loadingState.value = lazyQuery.result?.value ? false : true
    
    try {      
      if (!lazyQuery.result?.value) {
        await lazyQuery?.load(document)
        return lazyQuery.refetch(newVariables || variables)
      } else { 
        return lazyQuery.refetch(newVariables || variables)
      }
    } finally {
      loadingState.value = false
    }
  }

  return {
    ...lazyQuery,
    start: fetchOrRefetch,
    load: fetchOrRefetch,
    refetch: fetchOrRefetch,
    loading: loadingState,
  }
}


export function useMultiQuery(
  queries: string[],
  variables: Record<string, any> = {},
  options: UseQueryOptions<any> = {}
) {
  const results = queries.map((key) => {
    const query = allGraphqlDocuments[key]
    if (!query || typeof query !== 'function') {
      return { key, result: null, loading: null, error: null, refetch: null }
    }

    const { result, loading, error, refetch } = query(variables, options)
    return { key, result, loading, error, refetch }
  })

  const data = computed(() => {
    return results.reduce((acc, { key, result }) => {
      const rawValue = result.value
      if (rawValue && typeof rawValue === 'object') {
        const keys = Object.keys(rawValue)
        if (keys.length === 1) {
          acc[key] = rawValue[keys[0]]
        } else {
          acc[key] = rawValue
        }
      } else {
        acc[key] = rawValue
      }
      return acc
    }, {} as Record<string, any>)
  })

  const loading = computed(() => results.some((r) => r.loading?.value))
  
  const error = computed(() => {
    return results.reduce((acc, { key, error }) => {
      acc[key] = error?.value ?? null
      return acc
    }, {} as Record<string, any>)
  })

  const refetch = async (
    variables: Record<string, any> = {},
    queryKeys?: string[]
  ) => {
    const keysToRefetch = queryKeys && queryKeys.length > 0
      ? queryKeys
      : results.map((r) => r.key)

    await Promise.all(
      results
        .filter((r) => keysToRefetch.includes(r.key) && typeof r.refetch === 'function')
        .map((r) => r.refetch!(variables))
    )
  }

  return {
    result: data,
    loading,
    error,
    refetch,
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
