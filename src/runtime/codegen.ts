import fs from 'fs'
import type { ModuleOptions } from '../module'
import codegen from 'vite-plugin-graphql-codegen'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

let hasCodegenRun = false

const writeFileWithRetry = (filePath, content, retries = 3) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8')
  } catch (error) {
    if (error.code === 'EPIPE' && retries > 0) {
      setTimeout(() => {
        writeFileWithRetry(filePath, content, retries - 1)
      }, 100)
    } else {
      console.error(`Failed to write file ${filePath}:`, error)
    }
  }
}

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
          const replaceStrings = [
            ['VueApolloComposable.UseQueryOptions', 'UseQueryOptions'],
            ['VueApolloComposable.UseQueryReturn', 'UseQueryReturn'],
            ['VueApolloComposable.UseMutationReturn', 'UseMutationReturn'],
            ['VueApolloComposable.UseMutationOptions', 'UseMutationOptions'],
            ['VueApolloComposable.useQuery', 'useQuery'],
            ['VueApolloComposable.useMutation', 'useMutation'],
            ['VueApolloComposable.useLazyQuery', 'useLazyQuery'],
            ['VueApolloComposable.UseLazyQueryReturn', 'UseLazyQueryReturn'],
            ['VueApolloComposable.MutateFunction', 'MutateFunction'],
            ['VueApolloComposable.MutateOverrideOptions', 'MutateOverrideOptions'],
            ['VueApolloComposable.MutateResult', 'MutateResult'],
            ['VueApolloComposable.UseSubscriptionOptions', 'UseSubscriptionOptions'],
            ['VueApolloComposable.UseSubscriptionReturn', 'UseSubscriptionReturn'],
            ['VueApolloComposable.UseResultReturn', 'UseResultReturn'],
            ['VueApolloComposable.useQueryLoading', 'useQueryLoading'],
            ['VueApolloComposable.useGlobalQueryLoading', 'useGlobalQueryLoading'],
            ['VueApolloComposable.useMutationLoading', 'useMutationLoading'],
            ['VueApolloComposable.useGlobalMutationLoading', 'useGlobalMutationLoading'],
            ['VueApolloComposable.useSubscriptionLoading', 'useSubscriptionLoading'],
            ['VueApolloComposable.useGlobalSubscriptionLoading', 'useGlobalSubscriptionLoading'],
            ['VueApolloComposable.DefaultApolloClient', 'DefaultApolloClient'],
            ['VueApolloComposable.ApolloClients', 'ApolloClients'],
            ['VueApolloComposable.useApolloClient', 'useApolloClient'],
            ['VueApolloComposable.UseApolloClientReturn', 'UseApolloClientReturn'],
            ['VueApolloComposable.provideApolloClient', 'provideApolloClient'],
            ['VueApolloComposable.provideApolloClients', 'provideApolloClients'],
            ['VueApolloComposable.useResult', 'useResult'],
          ]
          replaceStrings.forEach(([oldString, newString]) => {
            content = content.replace(new RegExp(oldString, 'g'), newString)
          })

          content = content.replaceAll('', '')

          if (content.includes('import * as VueApolloComposable')) {
            content = content.replace(
              "import * as VueApolloComposable from '@vue/apollo-composable';",
              `            
import {
   useQuery as apolloUseQuery,
   useMutation,
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

import { getCurrentInstance, onMounted, watch } from 'vue';
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

const useQuery = <TResult = any, TVariables = any>(
  document,
  variables,
  options
): UseQueryReturn<TResult, TVariables> => {
  if (process.server || options?.ssr) {
    return useSSRQuery(document, variables, options) as any;
  }

  const router = useRouter();
  const route = useRoute();
  // Read global refetchOnUpdate setting
  const globalRefetchOnUpdate = NuxtApollo?.refetchOnUpdate;
  // Check if refetchOnUpdate is explicitly disabled in the query options
  const queryRefetchOnUpdate = options?.refetchOnUpdate !== undefined ? 
    options.refetchOnUpdate : 
    globalRefetchOnUpdate;
  
  const queryKey = JSON.stringify({ document, variables });
  const query = apolloUseQuery<TResult, TVariables>(document, variables, options);
  const instance = getCurrentInstance();
  const instanceId = instance?.uid ?? Math.random();

  // Skip caching if refetchOnUpdate is false
  if (queryRefetchOnUpdate === false) {
    return query;
  }

  // Initialize or get cache entry
  if (!queryCache.has(queryKey)) {
    queryCache.set(queryKey, {
      loading: false,
      timestamp: 0,
      subscribers: new Map(),
      manualRefetchTriggered: false,
      routeSnapshot: JSON.stringify(route.fullPath)
    });
  }

  const cacheEntry = queryCache.get(queryKey)!;

  // Helper to get current props snapshot
  const getPropsSnapshot = () => {
    return JSON.stringify({
      ...(instance?.props || {}),
      ...(instance?.attrs || {}),
      value: null,
      values: null,
      selected: null,
    });
  };

  // Helper to check if props have changed
  const havePropsChanged = (oldSnapshot: string | null) => {
    if (!oldSnapshot) return false;
    const currentSnapshot = getPropsSnapshot();
    return oldSnapshot !== currentSnapshot;
  };

  // Helper to check if route has changed
  const hasRouteChanged = () => {
    const currentRouteSnapshot = JSON.stringify(route.fullPath);
    const hasChanged = currentRouteSnapshot === cacheEntry.routeSnapshot;
    if (hasChanged) {
      cacheEntry.routeSnapshot = currentRouteSnapshot;
    }
    return hasChanged;
  };

  // Get configurable refetch timestamp
  const getRefetchTimeout = () => {
    return options?.refetchTimeout || NuxtApollo?.refetchTimeout || 15000;
  };

  // Helper to perform refetch with debounce
  const performRefetch = async () => {
    const now = Date.now();
    const timeoutValue = getRefetchTimeout();
    
    if (!cacheEntry.loading && now - cacheEntry.timestamp > timeoutValue) {
      cacheEntry.loading = true;
      cacheEntry.timestamp = now;
      
      const subscriber = cacheEntry.subscribers.get(instanceId);
      if (subscriber) {
        subscriber.setLoading(true);
      }
      
      try {
        const { data } = await query.refetch(variables);
        if (data) {
          cacheEntry.result = data;
          if (subscriber) {
            subscriber.setResult(data);
            subscriber.setLoading(false);
          }
        }
      } finally {
        cacheEntry.loading = false;
      }
      
    }
    query.loading.value = false;
  };

  // Wrap the original refetch function to track manual refetches
  const originalRefetch = query.refetch;
  query.refetch = async (...args) => {
    cacheEntry.manualRefetchTriggered = true;
    cacheEntry.timestamp = Date.now();
    
    try {
      const result = await originalRefetch?.(...args);
      cacheEntry.manualRefetchTriggered = false;
      return result;
    } catch (error) {
      cacheEntry.manualRefetchTriggered = false;
      throw error;
    }
  };

  // Create subscriber for this instance
  const subscriber = {
    setResult: (data: TResult) => {
      query.result.value = data;
    },
    setLoading: (loading: boolean) => {
      query.loading.value = loading;
    },
    propsSnapshot: getPropsSnapshot()
  };

  onMounted(() => {
    cacheEntry.subscribers.set(instanceId, subscriber);

    if (cacheEntry.result) {
      query.result.value = cacheEntry.result;
    }

    // Initial fetch if needed
    const now = Date.now();
    if (!cacheEntry.loading && !query.loading.value && now - cacheEntry.timestamp > 2500) {
      performRefetch();
    }
  });

  // Watch for route changes
  watch(
    () => route.fullPath,
    () => {
      if (queryRefetchOnUpdate === false || cacheEntry.manualRefetchTriggered) return;
      
      if (hasRouteChanged()) {
        performRefetch();
        query.loading.value = false;
      }
    }
  );

  watch(query.result, (newData) => {
    if (newData) {
      cacheEntry.result = newData;
      cacheEntry.subscribers.forEach((sub, subId) => {
        if (subId !== instanceId) {
          sub.setResult(newData);
        }
      });
    }
  });

  onUpdated(() => {
    if (queryRefetchOnUpdate === false || cacheEntry.manualRefetchTriggered) return;

    const subscriber = cacheEntry.subscribers.get(instanceId);
    if (!subscriber) return;

    if (havePropsChanged(subscriber.propsSnapshot)) {
      subscriber.propsSnapshot = getPropsSnapshot();
      performRefetch();
      query.loading.value = false;
    }
  });

  onUnmounted(() => {
    cacheEntry.subscribers.delete(instanceId);
    if (cacheEntry.subscribers.size === 0) {
      queryCache.delete(queryKey);
    }
  });

  return query;
};


//////////////////////////////////////////////////////////////////////////////////////// 

const useLazyQuery = <TResult = any, TVariables = any>(
   document,
   variables,
   options
): UseLazyQueryReturn<TResult, TVariables> => {
   return apolloUseLazyQuery(document, variables, {
      fetchPolicy: 'cache-and-network',
      ...options,
   }) as any
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
