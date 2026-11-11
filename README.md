# MEREBA FRIENDS GARDEN (መረባ ፍሬንድስ) &bull; Commercial Digital QR Menu & Management Suite

> *"WE'LL BE THERE FOR YOU."*  
> A high-performance, mobile-first, in-restaurant digital QR menu and management suite built specifically for **Mereba Friends Garden** (Kebele 17, Mekelle, Tigray, Ethiopia).

---

## 🌟 Overview & Key Capabilities

This suite replaces traditional physical paper menus with an interactive, instant-loading digital menu and kitchen operations suite designed for casual luxury dining.

### 🍽️ 1. Customer Dining Experience (Mobile QR View)
- **Zero-App Instant Load (< 0.5s)**: Progressive Web App (PWA) with Service Worker offline caching. Dishes and high-resolution photos open instantly even on slow 3G network connections.
- **Iconic Casual Luxury Aesthetic**: Central Perk heritage meets modern boutique lounge (`#050505` deep black canvas, `#121212` charcoal cards, `#222222` subtle borders, warm `#FFBD18` gold action accents).
- **Two-Tier Culinary Hierarchy**:
  - **🍽️ FOOD**: Tibs & Ethiopian Specials, Hand-Tossed Pizzas, Gourmet Burgers, Artisan Pastas, Fragrant Rice Bowls, Fresh Salads, and Slow-Simmered Soups.
  - **🍹 DRINKS**: Signature Mojitos & Mocktails, Chilled Draft Beers & Local Brews, 100% Freshly Squeezed Juices & Smoothies, Cold Soft Drinks, and Central Perk Hot Coffees & Clay-Pot Jebena Brews.
- **3-Language Instant Switcher**: Full trilingual support switchable with 1 tap:
  - **English (`EN`)**
  - **ትግርኛ / Tigrinya (`ትግ`)**
  - **አማርኛ / Amharic (`አማ`)**
- **Single Master QR Code**: No confusing per-table QR printing or fragile hardware dependencies. One master QR code prints on acrylic stands, counters, and garden tables.
- **Zero Waiter Tablet Burden**: Waiters do not need expensive dedicated tablets; customers browse effortlessly on their own smartphones, allowing servers to provide personal, attentive hospitality.
- **Complimentary Guest Wi-Fi**: 1-tap SSID and password copy with live credentials pulled directly from the manager dashboard.
- **Social & Location**: Direct links to official Instagram (`@mereba_friends_garden`), TikTok (`@friends_garden`), Facebook, and 1-tap phone calls.

---

### 🛡️ 2. Admin & Kitchen Management Portal (`/admin`)
- **Strict Security Lockdown**:
  - Customer-facing pages contain zero visible admin links.
  - Any direct visit to `/admin` forces the **Login Page (`/admin/login`)** first.
  - Cryptographic `bcrypt.compare` password authentication. Incorrect passwords return `401 Unauthorized` with a 5-attempt brute-force rate-limiting lockout.
  - Session-scoped security (`sessionStorage`) ensures credentials never linger on shared tablets or customer devices.
  - Discreet hidden staff portal shortcut `🔒` in the menu footer for staff phones.
- **100% Mobile-Responsive Management**:
  - Built specifically for managers walking the floor with a smartphone.
  - Desktop tables automatically convert into touch-friendly **Mobile Dish Cards** on small screens.
  - **1-Tap Dish Availability Toggle**: Instantly mark any dish as *"Live on Menu"* or *"Hidden"* when kitchen ingredients run low.
  - **Inline Live Price Editor**: Change prices in ETB in under 5 seconds directly from the mobile card.
- **Visual CMS & Live Customization**:
  - Update restaurant name, taglines, hero titles, philosophy manifesto, and address live without touching code.
  - Update guest Wi-Fi SSID and password instantly.
  - Adjust theme colors (Canvas, Cards, Accent Gold) and typography fonts.
  - **1-Click "Restore to Default"**: Safety net to revert any mistake back to original factory settings instantly.
- **Menu Analytics & Popular Dishes Leaderboard**:
  - Unified **Total QR Scans** counter tracking physical table scans.
  - **Total Menu Impressions** and **Dishes Explored**.
  - Real-time **Popular Dishes Leaderboard** showing the top dishes guests browse most frequently.
- **1-Click Master QR Stand Card Generator**:
  - Generates high-resolution acrylic table tent cards featuring the vector Mereba Couch Logo, "SCAN FOR DIGITAL MENU" badge, and guest Wi-Fi info.
  - Ready for immediate A5/4x6" printing or high-res PNG download.
- **1-Page Manager Cheatsheet Guide**:
  - Accessible via "Manager Guide" in the admin header with 1-click A4 printing for staff onboarding.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS (Casual Luxury Dark Theme palette)
- **Icons**: Lucide React
- **QR Engine**: `qrcode` (High-resolution error correction level H)
- **State & Caching**: TanStack Query (React Query v5)
- **Routing**: React Router DOM (v6) with Protected Route Isolation

### Backend
- **Runtime**: Node.js + Fastify (v4) with TypeScript
- **Database & ORM**: SQLite + Prisma ORM (v5)
- **Security**: JWT (`@fastify/jwt`) + `bcryptjs` salted password hashing
- **File Handling**: `@fastify/multipart` with local media storage

---

## 📁 Repository Structure

```
Friends_menu/
├── friends-restaurant/
│   ├── backend/
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Prisma models: Admin, Category, MenuItem, SiteSetting, AnalyticsEvent
│   │   │   ├── dev.db              # SQLite production-ready database
│   │   │   └── seed.ts             # Complete culinary catalog with real Friends Garden photos
│   │   ├── src/
│   │   │   ├── config/             # DB & environment configuration
│   │   │   ├── controllers/        # Auth, menu, settings, analytics controllers
│   │   │   ├── routes/             # Fastify REST endpoints
│   │   │   └── app.ts              # Server bootstrap on port 5000
│   │   └── package.json
│   │
│   ├── frontend/
│   │   ├── public/
│   │   │   ├── manifest.json       # PWA manifest
│   │   │   ├── sw.js               # Service Worker offline cache
│   │   │   └── assets/real/        # Real photographic assets from Friends Garden
│   │   ├── src/
│   │   │   ├── api/client.ts       # Typed REST API client
│   │   │   ├── components/
│   │   │   │   ├── admin/          # AdminHeader, ItemListTable, CategoryManager, SiteSettingsCMS, AnalyticsDashboard, TableQRModal, ManagerGuideModal, AccountSecurityModal
│   │   │   │   ├── customer/       # MenuHeader, CategoryTabs, MenuCard, FriendsDoodleRibbon
│   │   │   │   ├── common/         # MerebaLogo (vector tufted couch with Ge'ez text)
│   │   │   │   └── ui/             # Button, Input, Modal (bottom sheet on phones)
│   │   │   ├── i18n/               # Trilingual translations (English, Tigrinya, Amharic)
│   │   │   └── pages/              # CustomerMenu, AdminLogin, AdminDashboard
│   │   └── package.json
│   │
│   ├── CLIENT_HANDOVER.md          # Manager operational guide & commercial sales handover
│   └── DEPLOYMENT.md               # Cloud & VPS deployment guide
└── README.md
```

---

## 🚀 Quick Start (Local Run)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

### 2. Start the Backend API
```bash
cd friends-restaurant/backend
npm install
npx prisma generate
node dist/app.js
# API running on http://localhost:5000
```

### 3. Start the Frontend Dev Server
```bash
cd friends-restaurant/frontend
npm install
npm run dev
# Frontend running on http://localhost:5173
```

---

## 🔑 Default Manager Credentials

| Field | Value |
| :--- | :--- |
| **Username** | `admin` |
| **Email** | `admin@friends.com` |
| **Default Password** | `admin123` |

*(Can be updated anytime inside `/admin` &rarr; Manager Profile &rarr; Change Password)*.

---

## 📄 License
Commercial proprietary software developed for **Mereba Friends Garden**. All rights reserved.
