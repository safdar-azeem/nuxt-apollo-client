# Nuxt Apollo Client Module

A Nuxt module for integrating Apollo Client with SSR and codegen support.

## Features

- Apollo Client integration with Nuxt 3
- Server-Side Rendering (SSR) support
- GraphQL Code Generator integration
- Multiple client support
- File Upload support
- Automatic token management
- Automatic type generation for queries and mutations
- Auto-imports for generated composables and types

## Installation

```bash
npm install nuxt-apollo-client
# or
yarn add nuxt-apollo-client
```

### Everything is set up for you: 📦

- No need to install Apollo Client or GraphQL codegen packages
- All necessary dependencies are automatically handled
- Apollo Client configuration is done for you

## Minimal Configuration

##### 1. Add `nuxt-apollo-client` to the `modules` section of your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-apollo-client'],
  apollo: {
    endPoints: {
      default: 'http://localhost:4000/graphql',
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
  <div v-if="result">Welcome, {{ result.me.name }}!</div>
</template>
```

This way, your data is ready when the page loads. Great for SEO and initial page load performance!

### Client-side Query

For queries that don't need server-side rendering, simply remove the await:

```vue
const { result, loading, error, refetch } = useMeQuery();
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

| Option             | Type                       | Default                                        | Description                              |
| ------------------ | -------------------------- | ---------------------------------------------- | ---------------------------------------- |
| endPoints          | `Record<string, string>`   | `{ default: 'http://localhost:4000/graphql' }` | GraphQL endpoint URLs                    |
| prefix             | `string`                   | `'I'`                                          | Prefix for generated types               |
| tokenKey           | `string`                   | `'token'`                                      | Key for storing the authentication token |
| config             | `object`                   | `{}`                                           | Additional configuration for codegen     |
| plugins            | `string[]`                 | `[]`                                           | Additional plugins for codegen           |
| gqlDir             | `string`                   | `'graphql'`                                    | Directory for GraphQL files              |
| runOnBuild         | `boolean`                  | `false`                                        | Run codegen on build                     |
| enableWatcher      | `boolean`                  | `true`                                         | Enable file watcher for codegen          |
| setContext         | `function`                 | `(operationName, variables) => any`            | Set context for codegen                  |
| memoryConfig       | `InMemoryCacheConfig`      | `{}`                                           | Memory cache config for Apollo Client    |
| useGETForQueries   | `boolean`                  | `false`                                        | Use GET for queries                      |
| apolloClientConfig | `ApolloClientOptions<any>` | `null`                                         | Apollo Client config                     |

## Functions

| Function    | Description                       | Syntax                                                  |
| ----------- | --------------------------------- | ------------------------------------------------------- |
| setToken    | Sets the token in the cookie      | `setToken({ key(optional), token, expires(optional) })` |
| getToken    | Gets the token from the cookie    | `getToken(key(optional))`                               |
| removeToken | Removes the token from the cookie | `removeToken(key(optional))`                            |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
