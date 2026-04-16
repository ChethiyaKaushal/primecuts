# CS3404: GUI Programming – Mini Project Report
## Prime Cuts – Premium Butcher & Gourmet Market SPA

**Student:** [Your Name]
**Student ID:** [Your ID]
**Date:** 2026

---

## 1. Features Implemented

### Core Features
- **Data Fetching:** Live product data from `https://dummyjson.com/products/category/groceries` with 30-item pagination.
- **Search:** Debounced (400ms) full-text search using `/products/search?q=` endpoint; resets to default when cleared.
- **Sorting & Filtering:** Client-side sort by price (asc/desc), rating, discount, and alphabetical name.
- **Detail View:** Dynamic route `/product/:id` showing full product details, image gallery (switchable thumbnails), customer reviews, warranty/shipping info, and an in-page quantity selector.
- **Responsive Layout:** Mobile-first using Tailwind CSS Grid and Flexbox. Works on 320px → 1440px+ screens.
- **Loading States:** Shimmer skeleton screens while data loads; spinner on product detail page.
- **Error Handling:** Graceful error state with a "Try Again" button; empty-state screen for no search results.

### Bonus Features (A/A+ Level)
- **Authentication Simulation:** Real HTTP POST to `/auth/login`, receives a JWT `accessToken`, stores it in `localStorage`. NavBar shows user's first name when authenticated and provides a Logout button.
- **Shopping Cart with Pinia:** Global `cartStore` using Pinia composition API. Supports add, remove, update-quantity, and clear-all. Cart persists across page reloads via `localStorage` serialization. Free-shipping progress bar updates live.
- **Dynamic Routing:** Vue Router v4 with `createWebHistory`. Routes: `/` (home), `/product/:id` (detail), `/cart`, `/login`. Wildcard route redirects to home. `scrollBehavior` restores scroll position.
- **Dark Mode:** Tailwind `darkMode: 'class'` strategy. Toggle persisted in `localStorage`; respects OS `prefers-color-scheme` on first visit. Smooth CSS `transition-colors` on all surfaces.

---

## 2. Component Hierarchy

```
App.vue  (dark mode state, page transitions)
│
├── NavBar.vue
│   ├── RouterLink (Logo)
│   ├── RouterLink (Shop)
│   ├── RouterLink (Login / Logout)
│   ├── Dark Mode Toggle Button
│   └── RouterLink (Cart, with badge)
│
├── HomeView.vue  [route: /]
│   ├── Hero Section (static)
│   ├── FilterBar.vue
│   │   ├── Search Input
│   │   └── Sort Select
│   └── ProductCard.vue  (×N, rendered in grid)
│
├── ProductDetailView.vue  [route: /product/:id]
│   ├── Breadcrumb Navigation
│   ├── Image Gallery (main + thumbnails)
│   ├── Product Info Panel
│   │   ├── Rating Stars
│   │   ├── Price / Discount Box
│   │   ├── Quantity Selector
│   │   └── Add-to-Cart Button
│   └── Reviews Grid
│
├── CartView.vue  [route: /cart]
│   ├── Free Shipping Progress Bar
│   ├── CartItem (×N, with quantity controls)
│   └── Order Summary Panel
│
└── LoginView.vue  [route: /login]
    ├── Demo Credentials Hint
    ├── Username Input
    ├── Password Input (toggle visibility)
    ├── Error Message (animated)
    └── Submit Button
```

### Diagram

```
┌─────────────────────────────────────────┐
│               App.vue                   │
│  (dark mode, router-view, transitions)  │
└─────────────┬───────────────────────────┘
              │
     ┌────────▼────────┐
     │    NavBar.vue   │
     │ auth | cart | 🌙│
     └─────────────────┘
              │
   ┌──────────┼────────────┐
   │          │            │
┌──▼──┐  ┌───▼──┐  ┌─────▼─────┐  ┌────────▼────┐
│Home │  │Detail│  │   Cart    │  │    Login    │
│View │  │ View │  │   View    │  │    View     │
└──┬──┘  └──────┘  └───────────┘  └─────────────┘
   │
┌──▼───────────┐   ┌─────────────┐
│ FilterBar    │   │ ProductCard │
│(search+sort) │   │  (×N grid)  │
└──────────────┘   └─────────────┘
```

---

## 3. State Management

| Store | State | Actions |
|---|---|---|
| `authStore` | `user`, `loading`, `error` | `login()`, `logout()`, `clearError()` |
| `cartStore` | `items[]`, `isOpen` | `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()` |

Both stores use **Pinia Composition API** style and persist critical state to `localStorage`.

---

## 4. API Endpoints Used

| Endpoint | Usage |
|---|---|
| `GET /products/category/groceries?limit=30` | Home page product list |
| `GET /products/search?q={query}&limit=50` | Live search results |
| `GET /products/{id}` | Product detail page |
| `POST /auth/login` | Authentication simulation |

---

## 5. TypeScript Architecture

All API response types are defined in `src/types/index.ts`:

- `Product` — full product shape including `reviews[]`, `meta`, `dimensions`
- `ProductsResponse` — paginated list wrapper (`products`, `total`, `skip`, `limit`)
- `AuthUser` — JWT response with `accessToken`, `refreshToken`, user fields
- `LoginCredentials` — form input shape
- `CartItem` — `{ product: Product, quantity: number }`
- `SortOption` — string literal union for compile-time sort safety

Zero use of `any` type throughout the codebase.
