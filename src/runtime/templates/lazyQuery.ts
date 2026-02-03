export const getLazyQuery = () => `
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
        return lazyQuery.refetch(unwrapVariables(newVariables || variables))
      } else { 
        // Ensure variables are safely unwrapped to avoid circular references (ReactiveEffect) during stringify
        const safeVariables = unwrapVariables(newVariables || variables)
        return lazyQuery.refetch(safeVariables)
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
`
