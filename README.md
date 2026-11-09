# F.R.I.E.N.D.S Restaurant (Mereba Friends Garden)

> *"WE'LL BE THERE FOR YOU."*  
> A high-performance, mobile-first in-restaurant digital QR menu and admin management panel built with modern luxury dark aesthetics and iconic Central Perk heritage.

---

## ✨ Features

### 🍽️ Customer Experience (Mobile QR View)
- **Cinematic Dark Luxury Aesthetic**: Central Perk meets modern gastronomy (`#131316` / `#050505`) with signature F.R.I.E.N.D.S dot accents (**Red `#F32636`**, **Blue `#16B9E8`**, **Yellow `#FFBD18`**).
- **Responsive 3-Column Bento Cards**: Ultra-clean, spacious cards with high-contrast typography, bold pricing in ETB, and generous breathing room.
- **Editorial Inline Accordion (`^`)**: Tapping any card smoothly expands it inline to reveal pristine food photography, full descriptions, and fresh preparation notes without overwhelming customers with endless scrolling.
- **Fast Live Search & Category Filtering**: Instant real-time filtering across Pasta, Rice, Salad, and Soup categories.
- **Table Detection**: Automatically detects table numbers from QR codes (e.g., `/?table=5`) and stores them for the dining session.
- **Complimentary Wi-Fi Modal**: One-click Wi-Fi credentials copy for in-house diners.

### 🛡️ Admin & Kitchen Console (`/admin`)
- **JWT-Protected Authentication**: Secure login portal for restaurant managers and staff.
- **Full CRUD Operations**: Create, edit, and delete dishes with real-time feedback.
- **Instant Out-of-Stock Toggle**: Switch dishes between *"Available"* and *"Sold Out"* with immediate UI updates.
- **Category Management**: Organize, re-order, and rename categories.
- **Printable QR Code Generator**: Generate high-resolution, branded table tent QR codes for table numbering.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS with custom F.R.I.E.N.D.S theme palette
- **Icons**: Lucide React & Google Material Symbols
- **State & Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router DOM (v6)

### Backend
- **Server**: Fastify (Node.js) with TypeScript
- **ORM & Database**: Prisma ORM with SQLite (or PostgreSQL)
- **Authentication**: JWT (`@fastify/jwt`) + `bcryptjs`
- **File & Media Handling**: Fastify Multipart with local uploads directory

---

## 📁 Project Architecture

```
Friends_menu/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database models (Admin, Category, MenuItem)
│   │   └── seed.ts             # 29 exact dishes across Pasta, Rice, Salad, Soup
│   ├── src/
│   │   ├── config/             # DB & environment configuration
│   │   ├── controllers/        # Auth and menu route handlers
│   │   ├── routes/             # Fastify REST endpoints
│   │   ├── services/           # Business logic & storage services
│   │   └── app.ts              # Fastify server bootstrap
│   ├── .env.example
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/                # Typed REST client
│   │   ├── components/
│   │   │   ├── admin/          # AdminHeader, ItemListTable, CategoryManager, TableQRModal
│   │   │   ├── customer/       # MenuHeader, CategoryTabs, MenuCard
│   │   │   └── ui/             # Reusable Button, Input, Modal
│   │   ├── hooks/              # useMenu, useCategories, useToggleItemStatus
│   │   ├── pages/              # CustomerMenu, AdminLogin, AdminDashboard
│   │   ├── App.tsx             # Route configuration
│   │   └── index.css           # Global typography & glowing pulse animations
│   ├── tailwind.config.js      # Custom theme colors & shadows
│   └── vite.config.ts          # Vite configuration with /api reverse proxy
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Gfani/Friends_menu.git
cd Friends_menu
```

### 2. Backend Setup
```bash
cd backend
npm install

# Setup SQLite database and seed initial 29 dishes
npx prisma db push
npx ts-node prisma/seed.ts

# Start the Fastify API (Runs on port 5000)
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Start Vite dev server (Runs on port 5173 with proxy to port 5000)
npm run dev
```

Visit **`http://localhost:5173`** in your browser or on mobile via your local network.

---

## 🔐 Default Admin Credentials

- **URL**: `http://localhost:5173/admin`
- **Email**: `admin@friends.com`
- **Password**: `admin123`

---

## 📜 License
MIT License. Created for **Mereba Friends Garden** Bistro & Lounge.

