# Section A — Concept Application (Answers)

## S1 — Props in `RestaurantCard` (Module 2)
Props are the input channel of a React component: the parent passes data down and the child renders it. If the name, cuisine, rating and delivery time were hardcoded inside `RestaurantCard`, every restaurant would need its own copy of the component, so 50 restaurants would mean 50 near-identical components, and any API change would force edits in all of them.

With props-driven design there is **one** component and **50 instances**:

```jsx
{restaurants.map(r => <RestaurantCard key={r.id} {...r} />)}
```

The problem it solves is **duplication plus the inability to render dynamic data**. The component becomes a pure, reusable function of its props (same props → same UI), the UI always reflects whatever the API returned, a layout or style fix is made once, and the component is easy to test with different props. Props are read-only, so data flows one way (parent → child), which keeps behaviour predictable.

## S2 — Live order tracking (Module 2)
Hooks: **`useState`** (holds `orderStatus`) and **`useEffect`** (performs the API call and sets up the live updates).

Order on the initial render:
1. The component function runs; `useState` returns the initial value (e.g. `null`/`'Loading'`), and the first render paints.
2. After React commits that render to the DOM, the `useEffect` callback runs, calls the API and then calls `setOrderStatus(...)`.
3. The state update triggers a re-render with the real status. A polling interval / WebSocket / Firestore `onSnapshot` listener started inside the same effect keeps calling `setOrderStatus`, so the UI updates without a page reload. The effect's cleanup function clears the interval/listener on unmount.

Why not in the function body: the function body runs on **every render**. A fetch there would run on each render, call `setState`, trigger another render, and loop forever. Fetching is also a *side effect*; render must be pure. `useEffect` runs after paint, only when its dependency array changes (`[orderId]`), and provides a cleanup phase to avoid leaks and race conditions.

## S3 — Custom hook for fetch logic (Module 3)
Extract the shared logic into one hook:

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(null);
    fetch(url, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error('Request failed'); return r.json(); })
      .then(setData)
      .catch(e => { if (e.name !== 'AbortError') setError(e.message); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [url]);
  return { data, loading, error };
}
```

- **Naming convention:** the name must start with `use` (e.g. `useFetch`), so React and the ESLint rules-of-hooks plugin recognise it and enforce the hooks rules.
- **Return value:** an object (or array) with `{ data, loading, error }`.
- **Independent state:** every call to a custom hook creates its own `useState`/`useEffect` instances inside the calling component. The listing, menu and order-history components each call `useFetch` with their own URL and each gets a completely separate copy of the state. Custom hooks share *logic*, not *state*.

## S4 — Context API vs Redux for the cart (Module 3)
| | Context API | Redux (Toolkit) |
|---|---|---|
| Setup | Built in, tiny | Extra library, store/slices |
| Re-renders | Every consumer re-renders when the context value changes (no selector) | Components subscribe to slices via selectors, so only affected components re-render |
| Debugging | Basic | Redux DevTools: action log, time travel |
| Async logic | Hand-rolled | Middleware (Thunk/Saga) |
| Best for | Low-frequency data (theme, auth user) | Frequently updated, complex, shared state |

Context is fine for a small app. **Redux is more suitable in a production-scale app when** the cart is updated frequently (quantity changes) and read by many distant components (menu, navbar drawer, checkout), when state transitions are complex (discounts, totals, validation), when several developers need predictable, traceable updates and DevTools, when async server interaction is involved, or when state must be persisted/hydrated.

**Redux Thunk:** reducers must be pure and synchronous, so they cannot call an API. A thunk is a function that is dispatched instead of a plain action; it gets `dispatch` and `getState`, so it can `await` the promo-code API and then dispatch `pending`/`fulfilled`/`rejected` actions (loading spinner, discount applied, "invalid code"). It solves the problem of **handling async side effects and multi-step dispatches in a clean, centralised place** outside components and reducers.

## S5 — GraphQL vs REST (Module 4)
With REST, each resource has a fixed response shape: `/restaurants` returns the whole record to everybody, so the mobile app **over-fetches** (owner details, order counts it never shows), or the backend must create extra endpoints/versions (`/restaurants/summary`, `/restaurants/full`) for each client; the admin may also need several round trips (`/restaurants`, `/menu`, `/orders`) = **under-fetching**.

With GraphQL there is **one endpoint** and the **client decides the shape** of the response in its query:

```graphql
# mobile
{ restaurants { name averageRating deliveryFee } }
# admin
{ restaurants { name ownerContact totalOrders city menuItems(active: true) { name } } }
```

The feature that prevents the mobile app from receiving unneeded data is the **query's field selection set** (the server's resolvers return only the requested fields). On a mobile connection this means **smaller payloads, fewer bytes over slow/metered networks, faster parsing, lower battery use**, and one round trip even for nested data, so lower latency.

## S6 — `getStaticProps` vs `getServerSideProps` (Module 4)
**Choice: `getStaticProps`**, with `revalidate: 86400` (Incremental Static Regeneration), because the list only changes once a day.

- **Google indexing:** both give fully rendered HTML in the first response, so the crawler sees the restaurant names without running JavaScript. With `getStaticProps` that HTML is a pre-built file served from the CDN, so it is **fastest (very low TTFB)**, which helps Core Web Vitals, a ranking signal. The crawler gets complete HTML in either case; static is just faster and more reliable.
- **Server load:** `getStaticProps` runs **at build time** (and at most once per revalidation window in the background), so the cost is *one* data fetch per day regardless of traffic; each visitor just receives a cached file. `getServerSideProps` runs **on every request**: N visitors = N executions of the data fetch + HTML render on your server, higher latency (the user waits for it) and cost, and it needs scaling during traffic spikes.
- Use `getServerSideProps` only for per-request or per-user data (e.g. a cookie-personalised page), which this page is not.
