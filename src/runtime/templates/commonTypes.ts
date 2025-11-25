export const getCommonTypes = () => `
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
`
