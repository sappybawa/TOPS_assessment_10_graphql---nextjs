import { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from '../lib/apollo';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  // pageProps.initialData (from getStaticProps) hydrates the Apollo cache
  const client = useMemo(
    () => createApolloClient({ initialData: pageProps.initialData }),
    [pageProps.initialData]
  );

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
