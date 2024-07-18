import gql from 'graphql-tag'

const MeQuery = gql`
  query Me {
    me {
      avatar
      email
      name
    }
  }
`

export default MeQuery
