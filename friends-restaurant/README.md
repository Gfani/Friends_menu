# F.R.I.E.N.D.S (Mereba Friends Garden) — Mobile QR Menu & Admin System

> **"WE'LL BE THERE FOR YOU."**  
> Modern luxury dark theme inspired by Central Perk meets upscale Addis Ababa garden dining.

---

## 🌟 Overview & Architecture

This application consists of two decoupled, high-performance systems:
1. **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons, TanStack Query (React Query)
2. **Backend**: Fastify v4, TypeScript, Prisma ORM, SQLite database (`dev.db`), JWT Auth, Multipart Image Uploads

---

## 📁 Project Structure

```
friends-restaurant/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Category, MenuItem, Admin, ServiceRequest models
│   │   └── seed.ts             # Seeds 29 exact menu items, categories, and admin
│   ├── src/
│   │   ├── config/             # database.ts (PrismaClient), env.ts
│   │   ├── controllers/        # auth.controller.ts, menu.controller.ts
│   │   ├── hooks/              # auth.hook.ts (JWT verification)
│   │   ├── routes/             # auth.routes.ts, menu.routes.ts
│   │   ├── services/           # menu.service.ts, storage.service.ts
│   │   ├── types/              # index.ts (TypeScript DTOs)
│   │   └── app.ts              # Fastify server bootstrap & plugins
│   ├── uploads/                # Local uploaded dish photography
│   ├── .env                    # PORT=5000, JWT_SECRET, DATABASE_URL
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── public/
    │   ├── assets/
    │   └── favicon.svg         # Signature F.R.I.E.N.D.S 3-dot brand icon
    ├── src/
    │   ├── api/
    │   │   └── client.ts       # Typed Fetch API client
    │   ├── components/
    │   │   ├── admin/          # AdminHeader, CategoryManager, ItemFormModal, ItemListTable
    │   │   ├── customer/       # MenuHeader, CategoryTabs, MenuItemRow
    │   │   └── ui/             # Button, Input, Modal
    │   ├── context/            # AuthContext.tsx (JWT session management)
    │   ├── hooks/              # useMenu.ts (React Query hooks & optimistic mutations)
    │   ├── pages/              # CustomerMenu.tsx, AdminLogin.tsx, AdminDashboard.tsx
    │   ├── types/              # menu.ts
    │   ├── App.tsx             # React Router setup
    │   ├── index.css           # Tailwind base & custom scrollbar
    │   └── main.tsx
    ├── .env                    # VITE_API_URL=http://localhost:5000
    ├── package.json
    ├── tailwind.config.js      # Custom theme: #050505, #121212, signature dots
    └── vite.config.ts          # Reverse proxy to backend API & uploads
```

---

## 🎨 Design & Brand Identity
- **Dark Background**: `#050505`
- **Card Backgrounds**: `#121212` with borders `#222222`
- **Text**: Primary `#FFFFFF`, Secondary muted `#A1A1AA`
- **Signature Accent Dots**:
  - Red: `#F32636`
  - Blue: `#16B9E8`
  - Yellow: `#FFBD18`
- **Episode Tone**: Subtle episode naming conventions (e.g., *"THE ONE WITH THE PASTA"*).

---

## 📱 Customer Features (`/`)
1. **Quick Action Bar**:
   - **Call Waiter**: Pick table number (1–20), add optional notes, alert server in real-time.
   - **Request Bill**: Select table and payment method (Cash, Telebirr, CBE Birr, Card).
   - **Free Wi-Fi**: Network `Mereba_Friends_Garden_5G`, password `centralperkcoffee` with 1-click copy.
2. **Category Filter Tabs**: Smooth horizontal scrolling with item counts and colored dot indicators.
3. **Live Search**: Instant text filtering by dish name, description, or ingredient.
4. **Accordion Expandable Item Rows**:
   - Ultra-compact default row: Dish name and price in ETB with chevron (`^`) toggle.
   - Expanded state: High-resolution food photography, description, dietary badges, live availability, and dynamic pricing tag.

---

## 🔐 Admin Console (`/admin`)
- **Login Credentials**:
  - **Email**: `admin@friends.com`
  - **Password**: `admin123`
- **Full CRUD Operations**:
  - Create dishes with image upload or photo URL, category, tags, and price.
  - Full modal editing and quick inline price editing.
  - Deletion with confirmation prompt.
- **Out-of-Stock Toggle (`isAvailable`)**:
  - Instant one-click toggle between "Available" (green) and "Sold Out" (red) with optimistic TanStack Query cache updates.
- **Category Management**:
  - Re-order categories (Move Up / Down).
  - Rename categories and update descriptions.
  - Add new categories and delete existing ones.
- **Table Service Alerts**:
  - Live alerts for customer waiter calls and bill requests with one-click resolve.

---

## 🚀 Running Locally

### Backend:
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
# Server runs at http://localhost:5000
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
# Accessible at http://localhost:5173
```

