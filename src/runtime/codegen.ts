import codegen from 'vite-plugin-graphql-codegen'
import fs from 'fs'
import type { ModuleOptions } from '../module'

let isCodegenDone = false

export const addCodegenPlugin = (_options: ModuleOptions, nuxt, resolve) => {
  const codegenPlugin = codegen({
    runOnBuild: _options?.runOnBuild,
    enableWatcher: _options?.enableWatcher,
    config: {
      schema: Object.values(_options?.endPoints),
      documents: `${nuxt.options?.rootDir}/${_options?.gqlDir}/**/*.ts`,
      config: {
        preResolveTypes: true,
      },
      hooks: {
        beforeDone: async () => {
          if (!isCodegenDone) {
            isCodegenDone = true
            return nuxt.callHook('restart')
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
  UseQueryOptions,
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
   

const defaultResult = () => {
  const result = ref({});
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

  const clientId =
    options?.clientId ||
    Object.keys(context.$apolloClients)["default"] ||
    Object.keys(context.$apolloClients)[0];

  const apolloClient = context.$apolloClients[clientId];

  try {
    const { data } = await apolloClient.query({
      query: document,
      variables,
      ...options,
    });

    const result = ref(data);
    const loading = ref(false);
    const error = ref(null);

    const onResult = (callback) => {
      callback(result.value);
    };

    const onError = (callback) => {
      callback(error.value);
    };

    return { ...defaultResult(), result, loading, error, onResult, onError };
  } catch (error) {      
    const errorRef = ref(error);

    const onError = (callback) => {
      callback(error.value);
    };

    return {
      ...defaultResult(),
      error: errorRef,
      onError,
    };
  }
};  

const useQuery = <TResult = any, TVariables = any>(
  document,
  variables,
  options
): UseQueryReturn<TResult, TVariables> => {
  if (process.server) {
    return useSSRQuery(document, variables, options) as any;
  }
  return apolloUseQuery<TResult, TVariables>(document, variables, options);
};

                      `
          )

          fs.writeFileSync(filePath, content, 'utf8')
        },
      },
      generates: {
        [resolve('./runtime/composables/graphql.ts')]: {
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
            ..._options?.config,
          },
        },
      },
    },
  })

  if (nuxt.options.vite?.plugins) {
    nuxt.options.vite.plugins.push(codegenPlugin)
  } else {
    nuxt.options.vite.plugins = [codegenPlugin]
  }
}
