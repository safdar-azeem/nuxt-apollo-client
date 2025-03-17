const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { gql } = require('graphql-tag')

// Sample in-memory user data
let user = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
}

// Type definitions
const typeDefs = gql`
  type User {
    id: String!
    name: String!
    email: String!
    age: Int
  }

  type Query {
    getUser: User
  }

  type Mutation {
    updateUser(name: String, email: String, age: Int): User
  }
`

// Resolvers
const resolvers = {
  Query: {
    getUser: () => user,
  },
  Mutation: {
    updateUser: (_, { name, email, age }) => {
      if (name) user.name = name
      if (email) user.email = email
      if (age) user.age = age
      return user
    },
  },
}

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Start the server
async function startServer() {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4009 },
    })
    console.log(`🚀 Server ready at ${url}`)
  } catch (error) {
    console.error('Failed to start server:', error)
    if (error.code === 'EADDRINUSE') {
      console.log('Port 4001 is in use. Please free it up or try a different port.')
    }
  }
}

startServer()
