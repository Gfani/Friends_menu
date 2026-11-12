# ☁️ MEREBA FRIENDS GARDEN &bull; Azure Deployment Guide (Docker)

> **Platform**: Microsoft Azure (Azure App Service / Azure Container Apps)  
> **Container**: Multi-stage Node 20 Alpine Linux (~160MB ultra-lightweight)  
> **Repository**: [https://github.com/Gfani/Friends_menu.git](https://github.com/Gfani/Friends_menu.git)  

This guide walks you through deploying your Dockerized Friends Garden menu and management suite directly to **Microsoft Azure** so it runs 24/7/365 with high availability, fast response times, and persistent storage.

---

## 🌟 Why Azure + Docker Runs Faster & Uses Less Memory

1. **Ultra-Lightweight Alpine Linux**:
   * Uses minimal Alpine Linux base (`node:20-alpine`).
   * Total memory consumption is only **~110MB – 140MB RAM** (leaves 80% free on standard plans).
2. **Multi-Stage Build**:
   * Dev compilers (TypeScript, Vite build tools) are discarded after building.
   * Only minified static files and production Node modules are packaged into the final container.
3. **Single Process Architecture**:
   * Fastify directly serves the built React frontend, image uploads, and the REST API simultaneously on a single port (`5000`).
4. **Persistent Storage in Azure**:
   * Azure App Service provides permanent storage (`WEBSITES_ENABLE_APP_SERVICE_STORAGE=true`), so your menu dishes, price changes, and uploaded photos **never get wiped or reset** across restarts.

---

## 🚀 Option 1: Deploying via Azure Portal (GUI — Simplest)

### Step 1: Create an Azure Web App
1. Go to **[portal.azure.com](https://portal.azure.com)** and sign in.
2. In the top search bar, type **App Services** &rarr; click **Create** &rarr; **Web App**.
3. Fill in the **Basics** tab:
   * **Subscription**: Your Azure subscription.
   * **Resource Group**: Click *Create new* &rarr; name it `rg-friends-garden`.
   * **Name**: `friends-garden-menu` *(your site URL will be `https://friends-garden-menu.azurewebsites.net`)*.
   * **Publish**: Select **Container** (or Code with Node 20 LTS).
   * **Operating System**: **Linux**.
   * **Region**: **South Africa North** (closest to Ethiopia) or **Germany West Central / France Central**.
   * **Pricing Plan**: 
     * **Free (F1)**: Good for testing.
     * **Basic (B1)**: ~$12/month (Recommended for production: custom domain, always-on, persistent storage).

### Step 2: Configure the Container
In the **Container** tab:
* **Image Source**: **GitHub Actions** (or Docker Hub / Azure Container Registry).
* Select your GitHub repository: `Gfani/Friends_menu`.
* Select branch: `main`.

### Step 3: Configure Environment Variables in Azure
Once the Web App is created, go to **Settings** &rarr; **Environment Variables** (or **Configuration**):

Add these Application Settings:
| Name | Value | Purpose |
| :--- | :--- | :--- |
| `WEBSITES_PORT` | `5000` | Tells Azure your container listens on port 5000 |
| `NODE_ENV` | `production` | Enables production caching |
| `PORT` | `5000` | Fastify server port |
| `WEBSITES_ENABLE_APP_SERVICE_STORAGE` | `true` | **Crucial**: Keeps SQLite database and uploaded photos permanent across restarts |
| `JWT_SECRET` | `mereba-friends-super-secret-azure-key-2026` | Encrypts admin login tokens |

Click **Apply** & Save.

---

## ⚡ Option 2: Deploying via Azure CLI (Fastest for Developers)

If you have Azure CLI installed on your computer:

```bash
# 1. Log in to your Azure account
az login

# 2. Create a Resource Group
az group create --name rg-friends-garden --location southafricanorth

# 3. Create an App Service Plan (Basic B1 Linux)
az appservice plan create --name plan-friends-garden --resource-group rg-friends-garden --sku B1 --is-linux

# 4. Create the Web App from your GitHub repository
az webapp create \
  --resource-group rg-friends-garden \
  --plan plan-friends-garden \
  --name friends-garden-menu \
  --deployment-source-url https://github.com/Gfani/Friends_menu.git \
  --deployment-source-branch main

# 5. Configure Port & Persistent Storage
az webapp config appsettings set --resource-group rg-friends-garden --name friends-garden-menu --settings \
  WEBSITES_PORT=5000 \
  WEBSITES_ENABLE_APP_SERVICE_STORAGE=true \
  NODE_ENV=production \
  JWT_SECRET=mereba-friends-azure-key-2026
```

---

## 🔄 Automated CI/CD with GitHub Actions

We have included a GitHub Action workflow template in `.github/workflows/azure-deploy.yml`:
* Every time you `git push origin main`, GitHub automatically compiles the frontend and backend, packages the Docker image, and deploys it live to your Azure Web App with zero downtime.

---

## 🖨️ Accessing Your Live System & Printing QR Stands

1. Visit your live Azure URL:  
   `https://friends-garden-menu.azurewebsites.net`
2. Access the Manager Portal:  
   `https://friends-garden-menu.azurewebsites.net/admin/login`
   * **Username**: `admin`
   * **Password**: `admin123`
3. Click the gold **"Master QR"** button in the top navigation bar.
4. Click **"Print Stand Card"** (or **"Download High-Res PNG"**).
   * The QR code automatically encodes your live Azure domain with `?scan=qr`.
5. Place the printed acrylic stands on all tables at Mereba Friends Garden!
