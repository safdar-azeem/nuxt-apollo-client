import gql from 'graphql-tag'

export const UpdateUserMutation = gql`
  mutation UpdateUser($name: String, $email: String, $age: Int) {
    updateUser(name: $name, email: $email, age: $age) {
      id
      name
      email
      age
    }
  }
`
