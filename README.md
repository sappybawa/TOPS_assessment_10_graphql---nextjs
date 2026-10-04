# TOPS Technologies — ReactJS Assessment M4-A1 (GraphQL & Next.js)

**Program:** ReactJS · **Assessment code:** M4-A1 · **Stack:** React, GraphQL (Apollo), Next.js, Firebase, Redux

This repository contains my complete submission for all four sections of the assessment.
Every task is a **separate, independently runnable project**, so each can be installed, run and screenshotted on its own.

---

## 1. Repository map (what is where, and why)

| Assessment part | Location | What it is | Why it is set up this way |
|---|---|---|---|
| **Section A** (S1–S6) | [`section-a-concepts/ANSWERS.md`](section-a-concepts/ANSWERS.md) | Written scenario answers | Theory only, so a single Markdown file |
| **Section B – Task 1** (FoodItemCard) | [`section-b-practical/task1-2-react-basics`](section-b-practical/task1-2-react-basics) | Vite + React app | Allowed by the brief ("CRA, Vite or Next.js"). Tasks 1 and 2 are both pure React fundamentals, so they share one app, shown as two sections on one page |
| **Section B – Task 2** (`useFetchRestaurants`) | same project as Task 1 (`src/useFetchRestaurants.js`, `src/RestaurantList.jsx`) | Custom hook + consumer | – |
| **Section B – Task 3** (Firestore order tracker) | [`section-b-practical/task3-firestore-tracker`](section-b-practical/task3-firestore-tracker) | Vite + React + Firebase | Separate project because it needs its own Firebase `.env` |
| **Section B – Task 4** (Next.js + Apollo) | [`section-b-practical/task4-nextjs-apollo`](section-b-practical/task4-nextjs-apollo) | Next.js (pages router) | `getStaticProps`, `_app.js` and `ApolloProvider` are requirements, which need the Next.js **pages router** |
| **Section C** (Mini capstone) | [`section-c-capstone/food-delivery-platform`](section-c-capstone/food-delivery-platform) | Next.js + Apollo + Firebase + Redux | Full-stack platform combining Modules 2–4 |
| **Section D** (AI-augmented) | [`section-d-ai-augmented`](section-d-ai-augmented) | Vite app + `PROMPTS.md` + `NOTE.md` | Holds the three required submission items, with a toggle to compare original vs corrected code |

```
.
├── README.md
├── section-a-concepts/ANSWERS.md
├── section-b-practical/
│   ├── task1-2-react-basics/        # Tasks 1 & 2
│   ├── task3-firestore-tracker/     # Task 3
│   └── task4-nextjs-apollo/         # Task 4
├── section-c-capstone/food-delivery-platform/
└── section-d-ai-augmented/
```

---

## 2. Prerequisites
- **Node.js 18.17+** (20 LTS recommended) and npm
- A free **Firebase project** (needed only for Task 3 and Section C) — see §4
- Internet access (the apps call public APIs: JSONPlaceholder and GraphQLZero)

Every project follows the same flow: `cd <folder>` → `npm install` → `npm run dev`.

---

## 3. How to run each part

### Section A — read only
Open `section-a-concepts/ANSWERS.md`.

### Task 1 & 2 — `section-b-practical/task1-2-react-basics`
```bash
cd section-b-practical/task1-2-react-basics
npm install
npm run dev          # http://localhost:5173
```
- **Task 1:** `src/FoodItemCard.jsx` (props + `useState` `isInCart`; button disabled/greyed when `isAvailable` is false). `src/App.jsx` maps over 6 hardcoded items.
- **Task 2:** `src/useFetchRestaurants.js` returns exactly `{ data, loading, error }`; `src/RestaurantList.jsx` shows "Fetching restaurants…", then name + email, or a friendly error (try/catch). *Tip:* to screenshot the error state, go offline in DevTools → reload.

### Task 3 — `section-b-practical/task3-firestore-tracker`
```bash
cd section-b-practical/task3-firestore-tracker
cp .env.example .env     # then fill in your Firebase values (see §4)
npm install
npm run dev              # http://localhost:5173
```
Add an order → it appears instantly (`onSnapshot`). Click **Cancel Order** → `deleteDoc()` removes it. Open the app in two tabs to see real-time sync.

> Vite exposes env vars via `import.meta.env.VITE_*` (the Vite equivalent of `process.env`); the keys are never hardcoded and `.env` is git-ignored.

### Task 4 — `section-b-practical/task4-nextjs-apollo`
```bash
cd section-b-practical/task4-nextjs-apollo
npm install
npm run dev              # http://localhost:3000/restaurants
# To see the static pre-render (built at build time):
npm run build && npm start
```
- `lib/apollo.js` — client factory (`ssrMode`, cache restore), `GET_USERS` query
- `pages/_app.js` — wraps the app in `ApolloProvider` (GraphQLZero endpoint) and hydrates the cache from `pageProps.initialData`
- `pages/restaurants.js` — `useQuery`, `getStaticProps` (fetches at build time, returns `initialData`), spinner + error banner
- Dev buttons on the page make both states visible: **Refetch** (spinner) and **Simulate error** (invalid query → error banner). View-source shows the restaurant names are already in the HTML.

### Section C — `section-c-capstone/food-delivery-platform`
```bash
cd section-c-capstone/food-delivery-platform
cp .env.example .env.local     # fill in Firebase values (see §4)
npm install
npm run dev                    # http://localhost:3000
```

| Requirement | Where |
|---|---|
| ≥ 3 pages with file-based routing + shared Navbar | `pages/index.js` (Home), `pages/menu.js` (Menu), `pages/orders.js` (Order History), `pages/login.js`; `components/Navbar.js` rendered in `pages/_app.js` so it appears on every page |
| Firebase email/password sign-up/login, session persistence, redirect | `pages/login.js`, `context/AuthContext.js` (`onAuthStateChanged`), redirect logic in `pages/orders.js` |
| Menu via Apollo `useQuery` + reusable `FoodItemCard` with loading/error states | `pages/menu.js`, `lib/apollo.js`, `components/FoodItemCard.js` (skeleton while loading, error card on failure) |
| Redux cart (add / remove / quantity) + Thunk for discount | `store/cartSlice.js` (`applyDiscount` async thunk → `pages/api/discount.js`), `store/index.js`, `components/CartSummary.js` |
| Orders stored in Firestore + real-time history | `components/CartSummary.js` (`addDoc` to `orders`), `pages/orders.js` (`onSnapshot`, filtered by user's `uid`) |

Discount codes to try: `SAVE10` (10%) and `FOOD20` (20%).

**Design notes**
- *Menu data:* a public mock API (GraphQLZero) has no real food data, so each "post" is mapped to a menu item (name from title; category and price derived from id) in `toMenuItem()`.
- *Redux Thunk:* implemented with Redux Toolkit's `createAsyncThunk`; `configureStore` includes the `redux-thunk` middleware automatically.
- *Firestore query:* order history filters by `uid` and is sorted client-side to avoid creating a composite index.

### Section D — `section-d-ai-augmented`
```bash
cd section-d-ai-augmented
npm install
npm run dev              # http://localhost:5173 — buttons switch "AI original" vs "Corrected"
```
| Required submission item | File |
|---|---|
| 1. Exact prompt(s) given to the AI | `PROMPTS.md` |
| 2. AI's original code and the corrected version | `src/CategoryFilter.original.jsx` and `src/CategoryFilter.jsx` |
| 3. 3–4 line note on what changed and why | `NOTE.md` |

---

## 4. Firebase setup (Task 3 and Section C)
1. Go to <https://console.firebase.google.com> → **Add project**.
2. **Build → Firestore Database → Create database** (start in *test mode* for development).
3. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable** (Section C only).
4. **Project settings → Your apps → Web (`</>`)** → register an app → copy the config values into the `.env` / `.env.local` files (variable names are in each `.env.example`).
5. Suggested Firestore rules for development only:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{id} { allow read, write: if true; }   // Task 3 (demo only)
  }
}
```
For Section C you can tighten this to `allow read: if request.auth != null && resource.data.uid == request.auth.uid; allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;`.

> 🔒 `.env` and `.env.local` are in `.gitignore`. **Never commit real keys**; only `.env.example` files are committed.

---

## 5. Screenshots
Add your browser screenshots to a `screenshots/` folder (as the brief requires) and name them by task, e.g. `task1.png`, `task2.png`, `task3.png`, `task4-loading.png`, `task4-error.png`, `capstone-menu.png`, `capstone-orders.png`, `sectionD.png`.

## 6. Pushing to GitHub
```bash
git init
git add .
git commit -m "TOPS M4-A1 assessment submission"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## 7. Tech stack
React 18 · Vite 5 · Next.js 14 (pages router) · Apollo Client 3 · GraphQL · Firebase 10 (Auth + Firestore) · Redux Toolkit / Redux Thunk · react-redux

## 8. Verification status
- All 34 JS/JSX source files and all `package.json` files were syntax-checked (JSX parse) with no errors, and `FoodItemCard` was render-tested (button shown / disabled when unavailable).
- `npm install` / `npm run dev` / `npm run build` and the live Firebase and GraphQL calls need network access and your own Firebase keys, so run them locally as described in §3 before taking screenshots.
