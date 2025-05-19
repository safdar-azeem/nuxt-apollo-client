# Nuxt Apollo Client Module

A Nuxt module for integrating Apollo Client with SSR, Codegen and Offline support.

## Features

- Apollo Client integration with Nuxt 3
- Server-Side Rendering (SSR) support
- GraphQL Code Generator integration
- Offline support (mutations)
- Multiple client support
- File Upload support
- Automatic token management
- Automatic type generation for queries and mutations
- Auto-imports for generated composables and types
- Production-ready 📦

## Installation

```bash
npm install nuxt-apollo-client
# or
yarn add nuxt-apollo-client
```

### Everything is set up for you: 🚀

- No need to install Apollo Client or GraphQL codegen packages
- All necessary dependencies will be automatically handled
- Apollo Client configuration is done for you

## Minimal Configuration

##### 1. Add `nuxt-apollo-client` to the `modules` section of your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-apollo-client'],
  apollo: {
    endPoints: {
      default: 'http://localhost:4000/graphql',
      // Don't change the 'default' key as it is used for the default client
      // Add more endpoints as needed
    },
    // Optional configurations
    prefix: 'I',
    tokenKey: 'token',
    gqlDir: 'graphql',
  },
})
```

##### 2. Create a `graphql` directory in your project root and add your GraphQL queries and mutations as `.ts` files.

```bash
// graphql/meQuery.ts
import gql from 'graphql-tag';
export const meQuery = gql`
  query me {
    me {
      id
      name
    }
  }
`;

// graphql/deletePostMutation.ts
import gql from 'graphql-tag';
export const deletePostMutation = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }

```

## Usage

Use auto-generated composables in your Vue component via auto-imports or import them using the #graphql alias.

### Server-side Query (SSR)

Want to fetch data on the server? Just use the await keyword with your query:

```vue
<script setup>
const { result, loading, error, refetch } = await useMeQuery()
</script>

<template>
  <div>Welcome, {{ result?.me?.name }}!</div>
</template>
```

This way, your data is ready when the page loads. Great for SEO and initial page load performance!

### Client-side Query

For queries that don't need server-side rendering, simply remove the await:

```vue
const { result, loading, error, refetch } = useMeQuery();
```

### Dynamic Refetching Query

You can pass reactive variables such as ref(), reactive(), or computed() to the query, and the hook will automatically refetch the data whenever these variables update. This eliminates the need for manual refetch calls,

```vue
<script setup>
const userId = ref('1')

const { result, loading, error, refetch } = useGetUserQuery({ id: userId })

const { result, loading, error, refetch } = useGetUserQuery({ id: computed(() => '1') })
</script>
```

### Multiple Queries

The useMultiQuery composable allows you to combine multiple GraphQL queries—along with their results, loading, and error into a single composable call.

```vue
<script setup lang="ts">
const { result, loading, error, refetch } = useMultiQuery(
  ['useGetUsersLazyQuery', 'useMeQuery'], // list of query keys (must match keys in generated composables)
  {
    // optional shared variables passed to all queries
  },
  {
    // optional options object, e.g. fetchPolicy, context, etc.
  }
)

// Access results
const users = result.value?.getUsers
const me = result.value?.me

// Refetch Queries
const handleRefetch = () => {
  // Refetch all combined queries
  refetch(variables)

  // OR: Refetch only specified queries
  refetch(variables, ['useGetUsersLazyQuery'])
}
</script>
```

### Mutations

```vue
<script setup lang="ts">
const { mutate, loading, error, onDone, onError } = useDeletePostMutation()

const handleDelete = async (id: string) => {
  await mutate({ id })
  // Handle successful deletion
}
</script>
```

## Configuration Options

Customize it in your `nuxt.config.ts` file:

| Option             | Type                        | Description                                                                                       | Default                                        |
| ------------------ | --------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| endPoints          | `Record<string, string>`    | GraphQL endpoint URLs                                                                             | `{ default: 'http://localhost:4000/graphql' }` |
| prefix             | `string`                    | Prefix for generated types                                                                        | `'I'`                                          |
| tokenKey           | `string`                    | Key for storing the authentication token                                                          | `'token'`                                      |
| plugins            | `string[]`                  | Additional plugins for codegen                                                                    | `[]`                                           |
| pluginConfig       | `object`                    | Additional configuration for codegen plugins                                                      | `{}`                                           |
| gqlDir             | `string`                    | Directory for GraphQL files                                                                       | `'graphql'`                                    |
| runOnBuild         | `boolean`                   | Run codegen on build                                                                              | `false`                                        |
| enableWatcher      | `boolean`                   | Enable file watcher for codegen                                                                   | `true`                                         |
| setContext         | `function`                  | Set context for codegen                                                                           | `({operationName, variables, token}) => any`   |
| memoryConfig       | `InMemoryCacheConfig`       | Memory cache config for Apollo Client                                                             | `{}`                                           |
| useGETForQueries   | `boolean`                   | Use GET for queries                                                                               | `false`                                        |
| apolloClientConfig | `ApolloClientOptions<any>`  | Apollo Client config                                                                              | `null`                                         |
| apolloUploadConfig | `ApolloUploadClientOptions` | Apollo Upload Client config                                                                       | `{}                                            |
| refetchOnUpdate    | `boolean`                   | Smartly Refetch queries on component, page, or route changes, ideal for dynamic data-driven apps. | `false`                                        |
| refetchTimeout     | `number`                    | Time in milliseconds to wait before refetching a query after a component, page, or route change.  | `10000`                                        |
| allowOffline       | `boolean`                   | Runs mutations later if the connection drops.                                                     | `false`                                        |
|                    |

## Functions

| Function          | Description                                           | Syntax                                        |
| ----------------- | ----------------------------------------------------- | --------------------------------------------- |
| setToken          | Sets the token in the cookie                          | `setToken({ key(optional), token, options })` |
| getToken          | Gets the token from the cookie                        | `getToken(key(optional))`                     |
| removeToken       | Removes the token from the cookie                     | `removeToken(key(optional), options)`         |
| loadApolloClients | Initializes Apollo Clients for use outside components | `loadApolloClients()`                         |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
