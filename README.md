# Velvorn

Velvorn is a full-stack e-commerce application for apparel, built with Next.js and MongoDB. It provides a customer storefront for browsing products, managing a cart, and placing cash-on-delivery orders, alongside a role-protected dashboard for managing products, orders, shipping rates, coupons, staff, customers, and sales reports.

## Overview

The storefront reads product data from MongoDB, supports product filters and size selection, and lets visitors use a local cart or synchronize it after logging in. Checkout supports registered users and guests, calculates shipping and coupon discounts on the server, and creates orders in MongoDB.

The dashboard uses separate administrator accounts with `admin` and `staff` roles. Administrators can manage catalog, shipping, coupons, staff, customers, and reports; staff accounts are limited to order access. Product images are uploaded to Cloudinary through a protected server route.

## Features

- Product catalog with product details, image galleries, offers, size-level stock fields, filters, sorting, and search suggestions.
- Guest cart persisted in browser storage and authenticated cart persistence in MongoDB.
- User registration, login, logout, session restoration, and protected order history.
- Guest and authenticated checkout with delivery-address collection, shipping rates, coupon application, and idempotency keys.
- Customer order history with pending-order cancellation.
- Admin dashboard for products, image uploads, coupons, shipping rates, orders, reports, customers, and staff accounts.
- Role-aware administration: `admin` and restricted `staff` access.
- Product-image hosting and delivery through Cloudinary.
- Responsive Material UI layouts, animated storefront sections, carousels, drawers, dialogs, and loading states.

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, TypeScript |
| UI | Material UI, Emotion, AOS, Splide |
| Backend | Next.js Route Handlers and server-side services |
| Database | MongoDB with Mongoose |
| State Management | Zustand with persisted browser storage; React Context for modal visibility |
| Forms | React Hook Form |
| Validation | Zod for admin product, coupon, and shipping update DTOs |
| Authentication | JWT cookies using `jsonwebtoken` and `jose`; bcrypt password hashing |
| Media Storage | Cloudinary |
| Notifications | SweetAlert2 |

## Project Architecture

The application uses the Next.js App Router with three route groups:

- `(shop)` contains public storefront pages.
- `(auth)` contains customer login and registration pages.
- `(checkout)` contains the checkout experience.

Server Components load the storefront catalog directly through `src/lib/actions.ts`, which connects to MongoDB through Mongoose. Client-side dashboard pages and cart actions call `/api` route handlers. Those handlers delegate business logic to server services, Mongoose models, and authentication helpers.

```text
Storefront / Dashboard UI
        │
        ├── Server Components ──> lib/actions ──> MongoDB
        │
        └── Client fetch calls ──> /api Route Handlers
                                      │
                                      ├── Auth / validation helpers
                                      ├── Server services
                                      ├── Mongoose models ──> MongoDB
                                      └── Cloudinary (protected image uploads)
```

## Project Structure

```text
src/
├── app/
│   ├── (auth)/                 # Customer login and registration
│   ├── (checkout)/             # Checkout layout and page
│   ├── (shop)/                 # Storefront, products, contact, orders
│   ├── api/                    # Customer and admin Route Handlers
│   ├── dashboard/              # Protected admin dashboard pages
│   ├── layout.tsx              # Root providers, global cart, metadata
│   └── globals.css             # Global styles
├── Components/                 # Shared storefront components
├── Context/visibility/         # Cart/overlay visibility context
├── Errors/                     # AppError class
├── lib/                        # Database, auth, Cloudinary, constants, validation
├── models/                     # Mongoose models
├── providers/                  # Customer authentication bootstrap
├── services/
│   ├── client/                 # Cart API client
│   └── server/                 # Auth, cart, checkout, and pricing logic
├── Stores/                     # Zustand stores
└── proxy.ts                    # Route-access redirects

scripts/
└── seed-admin.ts               # Explicit administrator bootstrap script
```

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- A MongoDB database
- A Cloudinary account if using dashboard image uploads

### Installation

```bash
git clone <your-repository-url>
cd "Velvorn next"
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and provide real values. Do not commit `.env.local`.

```env
# Required application services
MONGODB_URI=your_mongodb_connection_string
SECRET_JWT=a_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Required only while creating the first administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=a_strong_unique_password
ADMIN_FULL_NAME=Administrator
```

`ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_FULL_NAME` are only read by the bootstrap script. After creating the first administrator, `ADMIN_PASSWORD` is not needed for normal application startup.

### Create the First Administrator

Run this once after configuring the database and environment variables:

```bash
npm run seed:admin
```

The script creates an `admin` account only when the configured email does not already exist.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The administrator login page is available at `/dashboard/login`.

## Application Architecture

### Storefront and Checkout

- The home page and products page fetch available products from MongoDB on the server.
- Product filters are represented in URL search parameters and are applied by storefront filter utilities.
- Zustand persists unauthenticated cart data in `localStorage` and synchronizes it to the database after customer login.
- Checkout obtains shipping rates from `/api/shipping`, submits delivery information and cart data to `/api/checkout`, and supports optional coupon codes.
- Checkout currently presents Cash on Delivery as the payment option.

### Admin Dashboard

- Dashboard pages are client components that load protected data from `/api/admin/*` endpoints.
- Product images are posted as multipart form data to `/api/admin/upload`.
- Uploads accept JPEG, PNG, WebP, and AVIF files, with a maximum of five files and 5 MB per file. The server verifies file signatures before forwarding them to Cloudinary.
- Product, coupon, and shipping updates use strict Zod DTO validation and allowlisted fields.

## Authentication and Authorization

Customer and administrator sessions are separate:

- Customer login and registration issue a JWT in an `httpOnly` `token` cookie. Customer state is restored by `/api/auth/me` and held in `AuthStore`.
- Administrator login issues an `httpOnly` `admin_token` cookie. `AdminAuthStore` reads `/api/admin/auth/me` to restore the dashboard session.
- Passwords are hashed with bcrypt before being persisted.
- `src/proxy.ts` redirects unauthenticated visitors away from `/orders` and `/dashboard` routes, and redirects logged-in users away from login/register pages.
- Admin API handlers enforce roles on the server. `admin` users can access management routes; `staff` users are limited to order endpoints.

## API Documentation

All administrator endpoints require an authenticated administrator cookie. Unless noted otherwise, cart and order endpoints require an authenticated customer cookie.

### Customer and Checkout APIs

| Method | Endpoint | Description | Authentication |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a customer account and session | Public |
| `POST` | `/api/auth/login` | Create a customer session | Public |
| `POST` | `/api/auth/logout` | Clear the customer session | Customer cookie |
| `GET` | `/api/auth/me` | Read the current customer session | Optional |
| `GET` | `/api/shipping` | List active shipping rates and the default rate | Public |
| `POST` | `/api/cart/add` | Add an item to the authenticated cart | Customer |
| `GET` | `/api/cart/get` | Read the authenticated cart | Customer |
| `PATCH` | `/api/cart/update` | Change a cart item quantity | Customer |
| `DELETE` | `/api/cart/delete` | Remove a cart item | Customer |
| `DELETE` | `/api/cart/clear` | Empty the authenticated cart | Customer |
| `POST` | `/api/cart/merge` | Merge local cart items after login | Customer |
| `POST` | `/api/checkout` | Create a guest or authenticated order | Optional |
| `GET` | `/api/orders` | List the current customer's orders | Customer |
| `PATCH` | `/api/orders/:orderId/cancel` | Cancel the customer's pending order | Customer |

### Administration APIs

| Method | Endpoint | Description | Role |
| --- | --- | --- |
| `POST` | `/api/admin/auth/login` | Create an administrator session | Public |
| `POST` | `/api/admin/auth/logout` | Clear the administrator session | Admin or staff session |
| `GET` | `/api/admin/auth/me` | Read the administrator session | Admin or staff session |
| `GET`, `POST` | `/api/admin/products` | List/filter products or create a product | Admin |
| `GET`, `PATCH`, `DELETE` | `/api/admin/products/:id` | Read, update, or delete a product | Admin |
| `POST` | `/api/admin/upload` | Upload validated product images to Cloudinary | Admin |
| `GET`, `POST` | `/api/admin/coupons` | List or create coupons | Admin |
| `PATCH`, `DELETE` | `/api/admin/coupons/:id` | Update or delete a coupon | Admin |
| `GET`, `POST` | `/api/admin/shipping` | List or create shipping rates | Admin |
| `PATCH`, `DELETE` | `/api/admin/shipping/:id` | Update or delete a shipping rate | Admin |
| `GET` | `/api/admin/customers` | List customers with spend/order aggregates | Admin |
| `GET` | `/api/admin/reports` | Read sales, returns, and product report data | Admin |
| `GET` | `/api/admin/orders` | List and filter orders | Admin or staff |
| `PATCH` | `/api/admin/orders/:id` | Update order status | Admin or staff |
| `GET`, `POST` | `/api/admin/staff` | List or create administrator/staff accounts | Admin |
| `DELETE` | `/api/admin/staff/:id` | Delete an administrator/staff account | Admin |

## Database

MongoDB is accessed through Mongoose with a cached connection in `src/lib/mongodb.ts`.

| Collection | Purpose |
| --- | --- |
| `product` | Product title, category, styles, image URLs, prices, per-size stock, description, and availability status |
| `user` | Customer name, unique normalized email, hashed password, and timestamps |
| `cart` | One active cart per user with product references, selected size, quantity, and stored line price |
| `order` | Order-item snapshots, totals, shipping address, coupon details, status, and optional user reference |
| `coupon` | Percentage/fixed discounts, validity, usage limits, and usage count |
| `shippingRate` | Governorate-level delivery price and activation state |
| `admin` | Administrator/staff accounts with role and hashed password |
| `RequestLog` | Short-lived idempotency keys for register, login, and checkout requests |

Products are referenced by cart items. Orders store title, image, price, quantity, and size snapshots rather than product references.

## State Management

Zustand manages client state in four stores:

- `AuthStore`: customer session, login, registration, and logout.
- `AdminAuthStore`: administrator session and dashboard login state.
- `CartState`: cart items, totals, local persistence, and server synchronization.
- `ProductsStore`: catalog data used by navbar search and similar-product suggestions.

`RenderProvider` uses React Context to control the cart overlay and related visual layers.

## UI and Responsive Design

The application uses Material UI components and its responsive breakpoint system for the storefront and dashboard. The product catalog includes desktop and mobile filter UIs. The dashboard switches between permanent and temporary navigation drawers depending on screen size. Animations are provided by AOS, and product carousels use Splide.

## SEO

The root layout defines basic application metadata:

- Title: `Velvorn`
- Description: `Generated by create next app`

No sitemap, robots file, Open Graph metadata, structured data, or page-specific metadata is currently implemented.

## Performance

Implemented optimizations include:

- `next/image` for optimized local and configured remote images, including Cloudinary delivery URLs.
- Server-side product loading for the home, product detail, and catalog pages.
- A cached global Mongoose connection to avoid repeated connection initialization during development/runtime reuse.
- Debounced product search input in the navigation.
- `useMemo` and `useCallback` in selected client filters, cart, and dashboard views.
- A route-level loading component for the product listing page.

The home page intentionally uses `dynamic = "force-dynamic"`; it is not statically cached.

## Available Scripts

```bash
# Start the development server
npm run dev

# Create an optimized production build
npm run build

# Run the production server after building
npm run start

# Create the first administrator from ADMIN_* environment variables
npm run seed:admin
```

## Deployment

The repository does not include a deployment-platform configuration, container configuration, or CI workflow. Deploy the Next.js application to a Node.js-compatible host and configure the same environment variables used locally. MongoDB and Cloudinary must be accessible from that environment.

## Testing

No automated test runner or test suite is configured in the repository. TypeScript can be checked manually with:

```bash
npx tsc --noEmit
```

## Known Limitations

- Checkout is Cash on Delivery only; no external payment gateway or webhook workflow is implemented.
- Contact form submission currently displays a success message locally and does not send or persist messages.
- Storefront catalog filtering is performed in memory after loading products; server-side pagination is not implemented.
- Categories are stored as product strings rather than managed as a separate collection.
- Inventory decrement/restoration is not yet tied atomically to checkout and cancellation.
- API responses and error handling are not yet standardized across every route.
- Authentication verification currently uses both `jsonwebtoken` and `jose`; the implementation has not yet been consolidated on one JWT library.
- No license file, deployment configuration, CI workflow, sitemap, or automated tests are present.

## Future Improvements

The following are suggestions, not current functionality:

- Add atomic inventory reservations and order transactions.
- Integrate a payment provider, verified webhooks, refunds, and return workflows.
- Add category CRUD, server-side catalog pagination, filtering, and indexed search.
- Add customer profile management, password reset, and email verification.
- Standardize API responses, JWT handling, and client-side data fetching.
- Add unit, integration, and end-to-end tests plus CI.
- Improve SEO with meaningful metadata, Open Graph assets, sitemap, and robots configuration.
