export const getMultiQuery = () => `
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
`
