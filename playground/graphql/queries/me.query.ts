import gql from 'graphql-tag'

export const GetUserQuery = gql`
  query GetUser($id: String) {
    getUser(id: $id) {
      id
      name
      email
      age
    }
  }
`
