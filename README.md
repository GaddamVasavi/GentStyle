# GentStyle – Men's Fashion E-Commerce Platform

> An enterprise-grade, full-stack sartorial e-commerce application engineered for luxury menswear, bespoke tailoring, and accessories.

---

## 1. Overview & Architecture

**GentStyle** is a large-scale modern men's fashion marketplace supporting a customer shopping journey and an executive administration console.

The system is organized into **6 Major Enterprise Modules**:
1. **Module 1 — Customer & Authentication Management**: Multi-tier JWT (Access + Refresh tokens), RBAC, customer profile, multi-address book with default shipping/billing flags, session history, and audit logging.
2. **Module 2 — Men's Fashion Product & Catalog Management**: 20+ menswear categories (Suits, Blazers, Shirts, Trousers, Selvedge Denim, Footwear, Automatic Watches), SKU generation, multi-attribute variants (XS-XXXL, Shoe sizes 6-12), fabrics, materials, fits, and dynamic multi-parameter search/filtering.
3. **Module 3 — Cart, Wishlist & Fashion Discovery**: Persistent user cart, real-time stock and reservation validation, wishlist management, and curated seasonal lookbooks (Office Wear, Riviera Summer, Black Tie, Streetwear, Royal Sovereign).
4. **Module 4 — Checkout, Orders, Returns & Delivery**: Multi-step checkout with address selection, tax/shipping computation, comprehensive order state machine (13 lifecycle stages), digital invoices, return workflows, and size/color exchange replacements.
5. **Module 5 — Payments, Coupons & Promotions**: Stripe & Razorpay integration interfaces, Cash on Delivery, tokenized payment security, dynamic coupon engine with minimum order/category constraints, and flash sales.
6. **Module 6 — Admin Dashboard & Analytics**: Executive overview with real-time revenue KPIs, dispatch tables, customer management, inventory thresholds, and audit logging.

---

## 2. Technology Stack

### Backend
- **Runtime**: Node.js v20+ / TypeScript
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL & Prisma ORM
- **Caching & Sessions**: Redis
- **Security**: JWT (Short-lived Access + Long-lived Refresh), Bcrypt, Helmet, CORS, Express-Rate-Limit
- **API Documentation**: OpenAPI / Swagger UI
- **Testing**: Jest & Supertest

### Frontend
- **Framework**: React 18 / TypeScript / Vite
- **Styling**: Tailwind CSS (Custom luxury color palette, dark mode glassmorphism, responsive grids)
- **State Management**: Redux Toolkit (Thunks for async operations)
- **Routing**: React Router DOM
- **Forms & Validation**: React Hook Form & Zod
- **Icons & Typography**: Lucide React, Google Fonts (*Cinzel*, *Outfit*, *Playfair Display*)
- **HTTP Client**: Axios with automatic JWT interceptors and auto-refresh queue

---

## 3. Monorepo Project Structure

```
GentStyle/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Complete 6-module relational database schema
│   │   └── seed.ts             # Realistic luxury seed data (Admin, Brands, Categories, Collections, Coupons)
│   ├── src/
│   │   ├── config/             # Config loader, env validation, Winston logger
│   │   ├── database/           # Prisma client connection singleton
│   │   ├── docs/               # Swagger OpenAPI setup
│   │   ├── middleware/         # Auth, RBAC, Validation, Error handler, Rate limit, Audit logger
│   │   ├── modules/
│   │   │   ├── auth/           # Registration, Login, Token refresh, Password reset
│   │   │   ├── users/          # Profiles, User directory, Login history
│   │   │   └── addresses/      # Multi-address CRUD and default flags
│   │   ├── routes/             # API Router aggregator
│   │   ├── utils/              # Standard JSON envelopes, JWT helpers, Bcrypt, Error classes
│   │   └── app.ts              # Express application entrypoint
│   └── tests/                  # Backend Jest test suites
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Button, Input, Modal, AuthModal, Navbar, Footer
│   │   ├── layouts/            # MainLayout, CustomerLayout, AdminLayout
│   │   ├── pages/              # HomePage, LoginPage, RegisterPage, ForgotPassword, Profile, Addresses, AdminDashboard
│   │   ├── routes/             # AppRoutes definition
│   │   ├── services/           # Axios HTTP client with auto-refresh interceptors
│   │   ├── store/              # Redux Toolkit store and slices (authSlice, uiSlice)
│   │   ├── types/              # TypeScript interfaces
│   │   ├── index.css           # Luxury design system tokens and glassmorphism
│   │   └── main.tsx            # React root application
│   └── index.html
│
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
├── PROJECT_STATUS.md
└── package.json
```

---

## 4. The Six Primary Commands

Inspect and execute using standard npm commands:

1. **`npm run dev`**
   Starts both the backend API (`http://localhost:5000`) and frontend development server (`http://localhost:5173`) concurrently.

2. **`npm run build`**
   Type-checks and compiles both backend (TypeScript to `dist/`) and frontend (Vite production bundle).

3. **`npm run start`**
   Runs the compiled backend production server (`node dist/app.js`).

4. **`npm run db:migrate`**
   Applies pending Prisma migrations to the PostgreSQL database.

5. **`npm run db:seed`**
   Populates the database with realistic luxury men's fashion brands, categories, subcategories, curated collections, coupons, and test accounts.

6. **`npm run test`**
   Executes automated unit and integration tests with Jest.

---

## 5. Quickstart & Installation

### Step 1: Clone and Install
```bash
git clone <repo-url> gentstyle
cd gentstyle
npm install
```

### Step 2: Environment Setup
```bash
cp .env.example .env
```

### Step 3: Database Preparation
Ensure PostgreSQL is running, then generate Prisma client and apply seed data:
```bash
npm run db:generate --workspace=backend
npm run db:push --workspace=backend
npm run db:seed --workspace=backend
```

### Step 4: Run Application
```bash
npm run dev
```
- **Storefront & Customer Portal**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000/api`
- **Swagger Documentation**: `http://localhost:5000/api/docs`

---

## 6. Default Demo Credentials

- **Admin Console**:
  - Email: `admin@gentstyle.com`
  - Password: `AdminSecurePassword123!`
- **Customer Account**:
  - Email: `james.bond@gentstyle.com`
  - Password: `Customer123!`
