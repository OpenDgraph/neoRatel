
export const ADD_NAMESPACE = `
  mutation addNamespace($password: String!) {
    addNamespace(input: { password: $password }) {
      namespaceId
      message
    }
  }
`;

export const DELETE_NAMESPACE = `
  mutation deleteNamespace($namespaceId: Int!) {
    deleteNamespace(input: { namespaceId: $namespaceId }) {
      namespaceId
      message
    }
  }
`;

export const RESET_PASSWORD = `
  mutation resetPassword($userId: String!, $password: String!, $namespace: Int!) {
    resetPassword(input: { userId: $userId, password: $password, namespace: $namespace }) {
      userId
      message
    }
  }
`;

export const LOGIN_MUTATION = `
  mutation login($userId: String!, $password: String!, $namespace: Int!) {
    login(userId: $userId, password: $password, namespace: $namespace) {
      response {
        accessJWT
        refreshJWT
      }
    }
  }
`;

export const EXPORT = `
  mutation export($format: String!, $namespace: Int!) {
    export(input: { format: $format, namespace: $namespace }) {
      response {
        message
      }
    }
  }
`;

export const SHUTDOWN = `
  mutation {
    shutdown {
      response {
        message
        code
      }
    }
  }
`;
