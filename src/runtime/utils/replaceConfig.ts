const replaceStrings = [
  { from: 'VueApolloComposable.UseQueryOptions', to: 'UseQueryOptions' },
  { from: 'VueApolloComposable.UseQueryReturn', to: 'UseQueryReturn' },
  { from: 'VueApolloComposable.UseMutationReturn', to: 'UseMutationReturn' },
  { from: 'VueApolloComposable.UseMutationOptions', to: 'UseMutationOptions' },
  { from: 'VueApolloComposable.UseLazyQueryReturn', to: 'UseLazyQueryReturn' },
  { from: 'VueApolloComposable.MutateFunction', to: 'MutateFunction' },
  { from: 'VueApolloComposable.MutateOverrideOptions', to: 'MutateOverrideOptions' },
  { from: 'VueApolloComposable.MutateResult', to: 'MutateResult' },
  { from: 'VueApolloComposable.UseSubscriptionOptions', to: 'UseSubscriptionOptions' },
  { from: 'VueApolloComposable.UseSubscriptionReturn', to: 'UseSubscriptionReturn' },
  { from: 'VueApolloComposable.UseResultReturn', to: 'UseResultReturn' },
  { from: 'VueApolloComposable.UseApolloClientReturn', to: 'UseApolloClientReturn' },
  { from: 'VueApolloComposable.useQuery', to: 'useQuery' },
  { from: 'VueApolloComposable.useMutation', to: 'useMutation' },
  { from: 'VueApolloComposable.useLazyQuery', to: 'useLazyQuery' },
  { from: 'VueApolloComposable.useQueryLoading', to: 'useQueryLoading' },
  { from: 'VueApolloComposable.useGlobalQueryLoading', to: 'useGlobalQueryLoading' },
  { from: 'VueApolloComposable.useMutationLoading', to: 'useMutationLoading' },
  { from: 'VueApolloComposable.useGlobalMutationLoading', to: 'useGlobalMutationLoading' },
  { from: 'VueApolloComposable.useSubscriptionLoading', to: 'useSubscriptionLoading' },
  { from: 'VueApolloComposable.useGlobalSubscriptionLoading', to: 'useGlobalSubscriptionLoading' },
  { from: 'VueApolloComposable.useApolloClient', to: 'useApolloClient' },
  { from: 'VueApolloComposable.provideApolloClient', to: 'provideApolloClient' },
  { from: 'VueApolloComposable.provideApolloClients', to: 'provideApolloClients' },
  { from: 'VueApolloComposable.useResult', to: 'useResult' },
  { from: 'VueApolloComposable.DefaultApolloClient', to: 'DefaultApolloClient' },
  { from: 'VueApolloComposable.ApolloClients', to: 'ApolloClients' },
  {
    from: /import type\s*\*\s*as\s*VueCompositionApi\s*from\s*'vue';\s*\n?/g,
    to: "import type * as VueCompositionApi from 'vue';\n",
  },
  { from: /^\s*;\s*\n/gm, to: '' },
  { from: /^export type Maybe<T>\s*=.*$/gm, to: 'export type Maybe<T> = T;' },
  {
    from: /^export type InputMaybe<T>\s*=.*$/gm,
    to: 'export type InputMaybe<T> = Maybe<T> | Ref<T>|ComputedRef<T>;',
  },
  {
    from: /^export type Exact<T extends { \[key: string\]: unknown }>\s*=.*$/gm,
    to: 'export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] | Ref<T[K]> | ComputedRef<T[K]>; };',
  },
]

const applyReplacements = (content) => {
  let updatedContent = content
  replaceStrings.forEach(({ from, to }) => {
    if (from instanceof RegExp) {
      updatedContent = updatedContent.replace(from, to)
    } else {
      const regex = new RegExp(`\\b${escapeRegExp(from)}\\b`, 'g')
      updatedContent = updatedContent.replace(regex, to)
    }
  })
  return updatedContent
}

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export { replaceStrings, applyReplacements }
