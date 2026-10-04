import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import App from './App.jsx';
import './styles.css';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://graphqlzero.almansi.me/api' }),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}><App /></ApolloProvider>
);
