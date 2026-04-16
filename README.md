# 🥩 Prime Cuts – Premium Butcher & Gourmet Market

A fully-featured **Single Page Application** built with Vue 3, TypeScript, Vite, and Tailwind CSS,
consuming live data from the [DummyJSON API](https://dummyjson.com).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later

### Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

### Other Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# TypeScript type-check (optional)
npm run typecheck
```

---

## ✨ Features Implemented

### Core (Pass–Credit Level)
| Feature | Details |
|---|---|
| **Data Fetching** | Fetches from `dummyjson.com/products/category/groceries` |
| **Search** | Live search with 400ms debounce via `/products/search` |
| **Sort / Filter** | Sort by price, rating, discount, name |
| **Detail View** | Full product page at `/product/:id` with image gallery |
| **Responsive Design** | Mobile-first grid, works on all screen sizes |
| **TypeScript** | Strict types, zero `any`, full interfaces for all API shapes |

### Bonus (Distinction–Outstanding Level)
| Bonus Feature | Implementation |
|---|---|
| **🔐 Auth Simulation** | JWT via `/auth/login`, stored in `localStorage`, Login/Logout state |
| **🛒 Shopping Cart** | Pinia store, persists across reloads, quantity controls, item removal |
| **🗺️ Dynamic Routing** | Vue Router with `/product/:id`, breadcrumbs, back navigation |
| **🌙 Dark Mode** | Tailwind `dark:` modifier, toggle persisted to `localStorage` |

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── NavBar.vue          # Sticky nav: auth, cart, dark mode toggle, mobile menu
│   ├── ProductCard.vue     # Reusable card: image, price, discount badge, add-to-cart
│   └── FilterBar.vue       # Search input + sort dropdown + result count
│
├── composables/
│   └── useProducts.ts      # All API calls: fetch, search, fetchById, fetchByCategory
│
├── stores/
│   ├── authStore.ts        # Pinia: login/logout, JWT, localStorage persistence
│   └── cartStore.ts        # Pinia: add/remove/update, subtotal, savings, persistence
│
├── types/
│   └── index.ts            # All TypeScript interfaces: Product, AuthUser, CartItem, etc.
│
├── views/
│   ├── HomeView.vue        # Hero banner, FilterBar, skeleton loading, product grid
│   ├── ProductDetailView.vue # Image gallery, reviews, quantity selector, breadcrumb
│   ├── CartView.vue        # Line items, free shipping bar, order summary, checkout
│   └── LoginView.vue       # Auth form with demo credentials and error handling
│
├── router/
│   └── index.ts            # Vue Router: /, /product/:id, /cart, /login
│
├── App.vue                 # Root: dark mode init, page transition
├── main.ts                 # Vite entry: app + pinia + router
└── style.css               # Tailwind base + custom components + skeleton animation
```

---

## 🎨 Design Decisions

- **Color Palette:** Crimson red primary, warm stone neutrals, amber accents
- **Typography:** Playfair Display (headings) + DM Sans (body)
- **Dark Mode:** Class-based toggle, OS preference detection on first load
- **Animations:** CSS-only page transitions, skeleton loaders, badge pop animations
- **API:** DummyJSON `/groceries` category — no API key required

---

## 📦 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Vue 3 | ^3.4 | Composition API, reactivity |
| TypeScript | ^5.4 | Strict typing |
| Vite | ^5.2 | Build tool / dev server |
| Tailwind CSS | ^3.4 | Utility-first styling + dark mode |
| Pinia | ^2.1 | Global state (cart + auth) |
| Vue Router | ^4.3 | Client-side routing |
