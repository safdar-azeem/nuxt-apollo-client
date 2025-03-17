import gql from 'graphql-tag'

export const GetUserQuery = gql`
  query GetUser {
    getUser {
      id
      name
      email
      age
    }
  }
`
