export const getSSRQuery = () => `
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
      let onResultCallBack = (vars:any) => {}

      const onResult = (callback) => {
         if (queryResult?.data) {
            onResultCallBack = callback
            callback?.(result)
         }
      }

      const onError = (callback) => {
         if (queryResult?.error) {
            callback?.(queryResult.error)
         }
      }

      const refetch = async (newVariables) => {
         error.value = null
         
         try {
            const refetchResult = await apolloClient.query({
               query: document,
               variables: newVariables || variables,
               fetchPolicy: 'network-only', 
               ...options,
            })
            
            onResultCallBack(refetchResult?.data)

            result.value = refetchResult?.data
            return refetchResult
         } catch (refetchError) {
            error.value = refetchError
            throw refetchError
         } 
      }

      return { ...defaultResult(), result, loading, error, onResult, onError, refetch }
   } catch (error) {
      const errorRef = ref(error)

      const onError = (callback) => {
         callback?.(error)
      }

      return { ...defaultResult(), error: errorRef, onError }
   }
}
`
