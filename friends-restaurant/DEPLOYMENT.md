# 🚀 MEREBA FRIENDS GARDEN &bull; Production Deployment Guide

> **Project**: Mereba Friends Garden (መረባ ፍሬንድስ) &bull; Commercial Digital QR Menu & Admin Suite  
> **Repository**: [https://github.com/Gfani/Friends_menu.git](https://github.com/Gfani/Friends_menu.git)  

This guide provides step-by-step instructions for deploying the system into live production so customers can scan table QR codes from their phones and restaurant management can access the admin dashboard.

---

## 📋 Architectural Overview

The application is engineered as a unified, high-performance web service:
* **Backend**: Node.js + Fastify (v4) + Prisma ORM with **Render PostgreSQL 16** database.
* **Frontend**: React 18 + Vite + Tailwind CSS + PWA Service Worker (pre-built into `frontend/dist`).
* **Unified Serving**: The Fastify backend directly serves the pre-compiled frontend SPA, customer uploaded photos (`/uploads/`), and REST API on a single port (`PORT=5000` or assigned by host).
* **Live Sync**: 3-second polling interval ensures price edits and sold-out dish toggles appear across all customer devices automatically.

---

## 🌐 Option 1: Cloud Deployment on Render.com (Recommended & Permanent)

Render provides free hosting with automatic SSL (`https://`), GitHub auto-deploys, and persistent PostgreSQL database support.

### Step 1: Create a Free PostgreSQL Database on Render
1. In Render dashboard &rarr; click **New +** &rarr; **PostgreSQL**.
2. Settings:
   * **Name**: `friends-db`
   * **Database**: `friends_db`
   * **Region**: Frankfurt (EU Central)
   * **Instance Type**: `Free` ($0/mo)
3. Click **Create Database**.
4. Once created, scroll down to **Connections** and copy the **Internal Database URL** (`postgres://friends_db_user:...`).

### Step 2: Create a Render Web Service
1. Click **New +** &rarr; **Web Service**.
2. Select your repository: `Gfani/Friends_menu`.
3. Configure service settings:
   * **Name**: `friends-garden-menu`
   * **Region**: Frankfurt (EU Central)
   * **Branch**: `main`
   * **Root Directory**: `friends-restaurant`
   * **Language**: `Node`
   * **Build Command**:
     ```bash
     cd frontend && npm install && npm run build && cd ../backend && npm install && npx prisma generate && npm run build
     ```
   * **Start Command**:
     ```bash
     cd backend && node dist/app.js
     ```
   * **Instance Type**: `Free` ($0/mo)

### Step 3: Configure Environment Variables in Render
In the **Environment** tab of your Web Service, add:
| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `JWT_SECRET` | `mereba-friends-secret-2026` |
| `DATABASE_URL` | *(Paste your copied Render Internal Database URL)* |
| `UPLOAD_DIR` | `./uploads` |

*(On startup, the server automatically initializes tables in PostgreSQL and seeds the initial 29 dishes and `admin` / `admin123` account with zero manual commands needed).*

---

## 🖥️ Option 2: Linux VPS / Ubuntu Deployment (DigitalOcean, Linode, AWS Lightsail)

For full ownership with a custom domain (e.g., `menu.merebafriends.com` or `friendsgarden.et`), deploy on an Ubuntu 22.04 / 24.04 LTS VPS ($4–$6/month).

### Step 1: Server Setup & Dependencies
Connect via SSH to your VPS:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx ufw

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 process manager
sudo npm install -g pm2
```

### Step 2: Clone & Build the System
```bash
# Clone the repository
cd /var/www
sudo git clone https://github.com/Gfani/Friends_menu.git
cd Friends_menu/friends-restaurant

# Build Frontend
cd frontend
npm install
npm run build

# Build Backend & Database
cd ../backend
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run build
```

### Step 3: Run with PM2 (Background Daemon with Auto-Restart)
```bash
cd /var/www/Friends_menu/friends-restaurant/backend
pm2 start dist/app.js --name "friends-menu"
pm2 save
pm2 startup
```

### Step 4: Configure Nginx Reverse Proxy & Free SSL (Let's Encrypt)
Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/friends-menu
```
Paste the following:
```nginx
server {
    server_name menu.yourdomain.com; # Or your server IP

    client_max_body_size 15M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site & get SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/friends-menu /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Free automated HTTPS SSL
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d menu.yourdomain.com
```

---

## 📶 Option 3: Local In-Restaurant Server (Mini-PC / POS Counter on Local Wi-Fi)

If the restaurant prefers 100% offline local intranet operation without relying on external internet connectivity:

1. Connect a mini-PC or laptop to the restaurant's main Wi-Fi router via Ethernet cable.
2. Assign a static local IP to the computer in the router admin (e.g., `192.168.1.100`).
3. Start the application:
   ```powershell
   cd friends-restaurant/backend
   node dist/app.js
   ```
4. Guests connected to `Mereba_Friends_Garden_5G` Wi-Fi scan the QR code pointing to `http://192.168.1.100:5000`.

---

## 🖨️ Generating & Printing the Final Acrylic Table QR Stands

Once your site is live at its production URL (e.g. `https://menu.yourdomain.com`):

1. On your phone or computer, visit `https://menu.yourdomain.com/admin`.
2. Log in with:
   * **Username**: `admin`
   * **Password**: `admin123`
3. Click the gold **"Master QR"** button in the top navigation bar.
   * *Notice*: The QR code dynamically links to your live domain with `?scan=qr`.
4. Click **"Download High-Res PNG"** to send to Mekelle print shops, or click **"Print Stand Card"** to print directly onto standard 4x6" cardstock.
5. Insert into clear acrylic double-sided table stands and place them on all dining tables and the bar.

---

## 🔒 Owner Handover & Go-Live Checklist

Complete these 5 quick steps when delivering the system to the restaurant owner:

- [ ] **1. Change Default Password**:
  Have the owner log in at `/admin/login`, open the **Shield / Profile** modal, and change their password from `admin123` to their own private password.
- [ ] **2. Verify Guest Wi-Fi Credentials**:
  In `/admin` &rarr; **Theme & CMS** &rarr; **Guest Wi-Fi**, confirm that the Wi-Fi Network Name and Password match the restaurant's actual guest router.
- [ ] **3. Test Price Change on Mobile**:
  Walk the owner through changing a price in 5 seconds from their smartphone in the **Dishes** tab to show how intuitive it is.
- [ ] **4. Test Out-of-Stock Toggle**:
  Demonstrate tapping the **Eye icon** to instantly hide a sold-out dish and restoring it with 1 tap.
- [ ] **5. Hand Over the Printable Guides**:
  Give the owner a printed/laminated copy of `CLIENT_HANDOVER.md` and the acrylic QR table stands.

*Congratulations! The system is 100% production-ready for Mereba Friends Garden.*

