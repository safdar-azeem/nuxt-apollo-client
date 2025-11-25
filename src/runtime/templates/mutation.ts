export const getMutation = () => `
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
