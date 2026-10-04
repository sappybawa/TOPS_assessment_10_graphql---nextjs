import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { client } from '../lib/apollo';
import { store } from '../store';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Navbar />
          <main className="container">
            <Component {...pageProps} />
          </main>
        </AuthProvider>
      </ApolloProvider>
    </Provider>
  );
}
