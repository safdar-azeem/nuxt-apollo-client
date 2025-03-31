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

const applyReplacements = (content) => {
  replaceStrings.forEach(([oldString, newString]) => {
    content = content.replace(new RegExp(oldString, 'g'), newString)
  })
  return content
}

export { replaceStrings, applyReplacements }
