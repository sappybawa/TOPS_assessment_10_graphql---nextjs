import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';

export const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://graphqlzero.almansi.me/api' }),
  cache: new InMemoryCache(),
});

// Public mock GraphQL API (GraphQLZero). Each "post" is treated as a menu item;
// see toMenuItem() for the mapping (price/category are derived from the id).
export const GET_MENU = gql`
  query GetMenu {
    posts(options: { paginate: { page: 1, limit: 12 } }) {
      data {
        id
        title
        body
      }
    }
  }
`;

const CATEGORIES = ['Pizza', 'Burgers', 'Desserts', 'Drinks', 'Salads'];
const EMOJI = { Pizza: '🍕', Burgers: '🍔', Desserts: '🍰', Drinks: '🥤', Salads: '🥗' };

export function toMenuItem(post) {
  const category = CATEGORIES[(Number(post.id) - 1) % CATEGORIES.length];
  const name = post.title.split(' ').slice(0, 3).join(' ');
  return {
    id: String(post.id),
    name: name.charAt(0).toUpperCase() + name.slice(1),
    description: post.body.slice(0, 70) + '…',
    price: 99 + (Number(post.id) % 7) * 25, // ₹
    category,
    emoji: EMOJI[category],
  };
}
