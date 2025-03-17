<script setup lang="ts">
const { result, loading, error, refetch } = useGetUserQuery()
const { mutate, loading: updateUserLoading } = useUpdateUserMutation()

const users = [
  { name: 'John Doe', email: 'john@example.com', age: 30 },
  { name: 'Barley Sue', email: 'barley@example.com', age: 28 },
  { name: 'Alice Smith', email: 'alice@example.com', age: 25 },
  { name: 'Bob Johnson', email: 'bob@example.com', age: 35 },
  { name: 'Emma Brown', email: 'emma@example.com', age: 27 },
]

const updateUser = async () => {
  try {
    await mutate(users[Math.floor(Math.random() * users.length)])
    refetch()
  } catch (err) {
    console.error('Error updating user:', err)
  }
}
</script>

<template>
  <div>
    {{ loading }}
    <p v-if="loading">Loading...</p>

    <p v-if="error">Error: {{ error.message }}</p>

    <div v-if="result?.getUser">
      <p>Name: {{ result.getUser.name }}</p>
      <p>Email: {{ result.getUser.email }}</p>
      <p>Age: {{ result.getUser.age }}</p>
    </div>

    <button :disabled="updateUserLoading" @click="updateUser">
      {{ updateUserLoading ? 'Updating...' : 'Update User' }}
    </button>
  </div>
</template>
