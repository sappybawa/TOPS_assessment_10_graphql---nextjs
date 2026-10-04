import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';

export const GRAPHQL_URI = 'https://graphqlzero.almansi.me/api';

export const GET_USERS = gql`
  query GetUsers {
    users(options: { paginate: { page: 1, limit: 6 } }) {
      data {
        id
        name
        email
      }
    }
  }
`;

// Deliberately invalid query (unknown field) — used by the "Simulate error" dev button
// so the error banner can be seen in the browser.
export const GET_USERS_BROKEN = gql`
  query GetUsersBroken {
    users(options: { paginate: { page: 1, limit: 6 } }) {
      data {
        id
        name
        emailAddressThatDoesNotExist
      }
    }
  }
`;

/**
 * Creates an Apollo client.
 * - On the server (getStaticProps) pass ssrMode = true.
 * - On the browser pass the cache extracted on the server as `initialData`
 *   so the cache is hydrated and the page renders with content immediately.
 */
export function createApolloClient({ ssrMode = false, initialData = null } = {}) {
  return new ApolloClient({
    ssrMode,
    link: new HttpLink({ uri: GRAPHQL_URI }),
    cache: new InMemoryCache().restore(initialData || {}),
  });
}
