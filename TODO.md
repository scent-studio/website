# Scent Studio — Production Refactor & Stabilization Plan

> Luxury perfume e-commerce platform. Improve the existing codebase — do not rebuild from scratch.
> Update checkboxes as tasks complete: `[ ]` → `[x]`

---

## Phase 0 — Foundation & Audit
- [ ] 0.1 Document current architecture gaps (schema drift, dual cart, missing admin)
- [ ] 0.2 Align frontend/backend TypeScript types with MongoDB models
- [ ] 0.3 Fix `.env.example` to match `config/env.ts`
- [ ] 0.4 Apply rate limiters to API routes
- [ ] 0.5 Verify health endpoint, CORS, Helmet, compression

## Phase 1 — Design System & Global UI Shell
- [ ] 1.1 Redefine CSS variables & Tailwind theme (warm white, soft beige, champagne gold)
- [ ] 1.2 Replace Inter with premium font pairing (editorial serif + refined sans)
- [ ] 1.3 Rebuild base UI primitives (Button, Input, Select, Modal, Skeleton, EmptyState, Badge)
- [ ] 1.4 Redesign Layout: Navbar, Footer, MobileNav with luxury aesthetic
- [ ] 1.5 Premium page transitions, loading screens, scroll reveals (Framer Motion)
- [ ] 1.6 Consistent spacing scale, shadows, focus states, responsive containers

## Phase 2 — Customer Storefront Redesign
- [ ] 2.1 Homepage — hero, featured, collections, bestsellers, newsletter (one composition, brand-first)
- [ ] 2.2 Shop — filters, sort, grid/list, pagination, skeleton loaders
- [ ] 2.3 Product Detail — gallery, notes pyramid, sizes, add to cart/wishlist, reviews
- [ ] 2.4 Categories & Category Products
- [ ] 2.5 Collections & Collection Detail
- [ ] 2.6 Brands listing & brand products (add frontend service + pages if missing)
- [ ] 2.7 New Arrivals, Best Sellers, Offers, Gift Sets
- [ ] 2.8 Cart — unify localStorage + API cart for guests vs authenticated
- [ ] 2.9 Wishlist — sync with API when logged in
- [ ] 2.10 Checkout — require auth or guest-token flow; fix payment method enums; order status alignment
- [ ] 2.11 Order Success & Order Tracking
- [ ] 2.12 Search (header + dedicated results)
- [ ] 2.13 Account: Dashboard, Orders, Addresses, Profile, Password
- [ ] 2.14 Content: About, Contact, FAQ, Blog
- [ ] 2.15 Legal: Privacy, Terms, Shipping, Returns (PKR-consistent copy)
- [ ] 2.16 Auth pages: Login, Register, Forgot/Reset Password
- [ ] 2.17 404 / Empty states

## Phase 3 — Critical Bug Fixes (Backend ↔ Frontend Contract)
- [ ] 3.1 Align Product fields (`topNotes`/`middleNotes`/`baseNotes`, `stock`, `discount`, gender enums, `isVisible`)
- [ ] 3.2 Fix admin product create/edit form to match backend validators
- [ ] 3.3 Unify cart: guest localStorage → merge on login; authenticated use `/api/cart`
- [ ] 3.4 Align Order status enums (frontend ↔ backend)
- [ ] 3.5 Fix checkout payment methods to match Order model
- [ ] 3.6 Enforce checkout auth or implement proper guest checkout API
- [ ] 3.7 Fix wishlist bugs (add/remove, persistence)
- [ ] 3.8 Fix coupon validation flow end-to-end
- [ ] 3.9 Fix image URLs / Cloudinary upload path
- [ ] 3.10 Fix search, filter, sort, pagination bugs

## Phase 4 — Admin Panel (Modern SaaS)
- [ ] 4.1 Redesign AdminLayout, Sidebar, Topbar
- [ ] 4.2 Dashboard — real analytics charts (revenue, orders, top products)
- [ ] 4.3 Products CRUD + image upload (fully working)
- [ ] 4.4 Categories CRUD
- [ ] 4.5 Brands CRUD (new admin screens)
- [ ] 4.6 Orders list + detail + status updates
- [ ] 4.7 Customers management
- [ ] 4.8 Reviews moderation
- [ ] 4.9 Coupons CRUD
- [ ] 4.10 Banners CRUD
- [ ] 4.11 Newsletter subscribers
- [ ] 4.12 Contact messages + reply
- [ ] 4.13 Settings
- [ ] 4.14 Collections admin (new)
- [ ] 4.15 Blog admin (new)
- [ ] 4.16 Inventory overview / low-stock alerts

## Phase 5 — Database & Seed
- [ ] 5.1 Audit seed for duplicates / fake lorem content
- [ ] 5.2 Rewrite seed with realistic luxury perfume brands, names, descriptions
- [ ] 5.3 Seed blogs, collections, gift sets, newsletter samples, analytics
- [ ] 5.4 Seed realistic reviews and order history
- [ ] 5.5 Use professional Unsplash/Cloudinary perfume imagery
- [ ] 5.6 Re-run seed and verify storefront + admin populate correctly

## Phase 6 — Security & Hardening
- [ ] 6.1 Mount rate limiters (auth, API, contact, newsletter)
- [ ] 6.2 Review JWT expiry, refresh rotation, cookie flags
- [ ] 6.3 Sanitize inputs; validate all mutation endpoints
- [ ] 6.4 Secure upload MIME/size limits
- [ ] 6.5 Ensure admin routes require `authorize('admin')` server-side
- [ ] 6.6 Remove secrets from client; scrub console logs of tokens

## Phase 7 — Performance
- [ ] 7.1 Route-based code splitting (`React.lazy` + Suspense)
- [ ] 7.2 Image lazy loading / proper sizes
- [ ] 7.3 Optimize MongoDB queries (indexes, select, populate lean)
- [ ] 7.4 Remove unused deps (unused Radix if still unused, or wire them)
- [ ] 7.5 Bundle analysis; trim dead code
- [ ] 7.6 API response pagination defaults

## Phase 8 — Deploy & DX
- [ ] 8.1 Fix `vercel.json` for SPA + document API hosting
- [ ] 8.2 Root README with setup, env, seed, deploy
- [ ] 8.3 Ensure `npm run build` succeeds (frontend + backend tsc)
- [ ] 8.4 Production CORS / FRONTEND_URL guidance

## Phase 9 — QA & Final Pass
- [ ] 9.1 Fix all TypeScript / lint errors
- [ ] 9.2 Smoke-test customer journeys (browse → cart → checkout → orders)
- [ ] 9.3 Smoke-test admin journeys (CRUD products, orders, coupons)
- [ ] 9.4 Mobile / tablet / desktop responsive pass
- [ ] 9.5 Zero console errors on key pages
- [ ] 9.6 Final UI polish pass

---

## Priority Order (execution)

1. Phase 0 + Phase 3 (contract fixes — unblock everything)
2. Phase 5 (realistic data)
3. Phase 1 + Phase 2 (UI redesign)
4. Phase 4 (admin)
5. Phase 6–8 (security, perf, deploy)
6. Phase 9 (QA)

---

## Progress Log

| Date | Task | Notes |
|------|------|-------|
| 2026-07-19 | Plan created | Full audit complete; starting Phase 0 |

---

## Known Critical Issues (from audit)

1. Product schema drift (frontend `notes.top` vs backend `topNotes`, gender enums, stock fields)
2. Dual cart (localStorage vs `/api/cart`)
3. Checkout guest UI vs auth-required orders API
4. Payment is stub only
5. Rate limiters defined but never mounted
6. Missing admin: Brands, Blogs, Collections
7. Seed missing blogs/collections
8. Order status enum mismatch
9. React Query / Radix unused
10. Policy copy USD vs seed PKR
