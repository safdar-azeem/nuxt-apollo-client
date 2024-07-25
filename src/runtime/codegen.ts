import fs from 'fs'
import type { ModuleOptions } from '../module'
import codegen from 'vite-plugin-graphql-codegen'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

let isCodegenDone = false

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
      overwrite: true,
      config: {
        overwrite: true,
        preResolveTypes: true,
      },
      hooks: {
        beforeDone: async () => {
          if (!isCodegenDone) {
            isCodegenDone = true
            if (nuxt && nuxt.callHook) {
              nuxt.callHook('restart')
              nuxt.options.alias[
                '#graphql'
              ] = `${nuxt.options?.rootDir}/${_options?.gqlDir}/generated`
              return
            }
          }
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

          content = content.replace(
            "import * as VueApolloComposable from '@vue/apollo-composable';",
            `
import {
  useQuery as apolloUseQuery,
  useMutation,
  useLazyQuery,
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
} from "@vue/apollo-composable";

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
} from "@vue/apollo-composable";

import { useNuxtApp } from "#app";
import {ref} from "vue";

interface UseQueryOptions<TData=any, TVariables=any> extends ApolloUseQueryOptions<TData, TVariables> {
  ssr?: true
}

const defaultResult = () => {
const result = ref(null);
const loading = ref(false);
const error = ref(null);

return {
  result,
  loading,
  error,
  onResult: (callback) => {
    callback?.(result.value);
  },
  onError: (callback) => {
    callback?.(error.value);
  },
  start: () => {},
  stop: () => {},
  restart: () => {},
  refetch: () => {},
  onCompleted: () => {},
};
};


const useSSRQuery = async (document, variables, options) => {
  const context = useNuxtApp();
  const clientId = options?.clientId || "default";
  const apolloClient = context.$apolloClients[clientId];
  
  try {
    const queryResult = await apolloClient.query({
      query: document,
      variables,
      ...options,
    });
  
    const result = ref(queryResult?.data);
    const loading = ref(false);
    const error = ref(queryResult?.error);
  
    const onResult = (callback) => {
      if (queryResult?.data) {
        callback?.(result);
      }
    };
  
    const onError = (callback) => {
      if (queryResult?.error) {
        callback?.(queryResult.error);
      }
    };
  
    return { ...defaultResult(), result, loading, error, onResult, onError };
  } catch (error) {
    const errorRef = ref(error);
  
    const onError = (callback) => {
        callback?.(error);
    };
  
    return { ...defaultResult(), error: errorRef ,onError };
  }
  };
  
  const useQuery = <TResult = any, TVariables = any>(
  document,
  variables,
  options
  ): UseQueryReturn<TResult, TVariables> => {
  if (process.server || options?.ssr) {
    return useSSRQuery(document, variables, options) as any;
  }
  
  return apolloUseQuery<TResult, TVariables>(document, variables, {
    fetchPolicy: 'cache-and-network',
    ...options,
  });
};
                      `
          )

          fs.writeFileSync(filePath, content, 'utf8')
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
            overwrite: true,
            ..._options?.pluginConfig,
          },
        },
      },
    },
  })

  if (nuxt.options.vite?.plugins) {
    nuxt.options.vite.plugins.push(codegenPlugin, viteCommonjs())
  } else {
    nuxt.options.vite.plugins = [codegenPlugin, viteCommonjs()]
  }
}
