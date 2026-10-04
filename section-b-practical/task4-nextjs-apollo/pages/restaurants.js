import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { createApolloClient, GET_USERS, GET_USERS_BROKEN } from '../lib/apollo';

export default function Restaurants() {
  const [broken, setBroken] = useState(false); // dev toggle to demo the error state

  const { data, loading, error, refetch } = useQuery(broken ? GET_USERS_BROKEN : GET_USERS, {
    fetchPolicy: broken ? 'network-only' : 'cache-first', // cache-first => pre-rendered data is used
    notifyOnNetworkStatusChange: true, // makes `loading` true again on refetch (spinner demo)
  });

  const restaurants = data?.users?.data ?? [];

  return (
    <main>
      <h1>Restaurants</h1>

      {/* Dev helpers so both states are visible in the browser */}
      <div className="dev">
        <button onClick={() => refetch()} disabled={broken}>Refetch (show spinner)</button>
        <button onClick={() => setBroken((b) => !b)}>
          {broken ? 'Restore valid query' : 'Simulate error'}
        </button>
      </div>

      {loading && <div className="spinner" role="status" aria-label="Loading" />}

      {error && <div className="banner-error">⚠️ Failed to load restaurants: {error.message}</div>}

      {!error && (
        <div className="grid">
          {restaurants.map((r) => (
            <div className="card" key={r.id}>
              <h3>{r.name}</h3>
              <p>{r.email}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

// Runs at BUILD time (npm run build) — page is pre-rendered with content.
export async function getStaticProps() {
  const client = createApolloClient({ ssrMode: true });
  try {
    await client.query({ query: GET_USERS });
  } catch (e) {
    console.error('getStaticProps GraphQL error:', e.message);
  }
  return {
    props: { initialData: client.cache.extract() }, // hydrates the client cache
    revalidate: 3600,
  };
}
