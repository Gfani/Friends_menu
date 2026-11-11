# 📜 MEREBA FRIENDS GARDEN &bull; Client Operations & Handover Guide

> **Recipient**: Management & Staff &bull; Mereba Friends Garden (መረባ ፍሬንድስ)  
> **Location**: Kebele 17, Mekelle, Tigray, Ethiopia  
> **System**: Commercial In-Restaurant Digital QR Menu & Operations Suite  

---

## 🌟 1. Welcome to Your New Digital Menu System

This suite transforms your dining experience from paper menus to a high-end, interactive digital menu. It is custom-tailored for your garden lounge and bistro in Kebele 17, combining iconic Central Perk heritage with modern luxury dining.

### What Your Restaurant Gets:
1. **Instant QR Menu**: Diners point their phone camera at the acrylic table stand and the menu loads in **less than 0.5 seconds**.
2. **One Master QR Code**: You only need to print **one single QR stand design** for all dining tables, the bar, and outdoor patio seats.
3. **Zero Tablet Overhead (No Hardware to Buy)**: Waiters do not need expensive dedicated tablets. The digital menu runs directly in your customer's browser, allowing waiters to focus on genuine hospitality and personal table service.
4. **Trilingual Language Switcher**: Local guests can browse the full menu in **English**, **ትግርኛ (Tigrinya)**, or **አማርኛ (Amharic)** with 1 tap.
5. **Full Manager Control on Your Phone**: You can update prices in 5 seconds, hide sold-out dishes, change the Wi-Fi password, and customize colors/text on your smartphone without hiring a developer.

---

## 🔐 2. Accessing the Management Portal

### How to Log In:
1. On your phone, tablet, or computer, open your browser and navigate to:
   * **`https://your-domain.com/admin`** *(or `http://localhost:5173/admin` during local testing)*
2. **Hidden Staff Shortcut**: On the customer menu page, scroll all the way down to the footer. Right beside *"Casual Luxury Dining • Kebele 17, Mekelle"*, tap the subtle lock icon `🔒`.

### Default Manager Credentials:
* **Username**: `admin` *(or Email: `admin@friends.com`)*
* **Password**: `admin123`

### Security Guarantees:
* **The Login Page Is Always Shown First**: Unauthorized users or customers browsing the Wi-Fi will never bypass the password.
* **Brute-Force Lockout**: 5 consecutive wrong passwords locks the login form for 30 seconds.
* **Automatic Session Clearing**: When you close your browser tab or tap **Logout**, your session ends immediately.

### Changing Your Password & Email:
1. Log in to the management dashboard.
2. In the top-right header, tap the **Shield / Manager Profile** button.
3. Enter your current password and your new desired password.
4. Tap **"Save Security Settings"**.

---

## ⚡ 3. Daily Operations Checklist (How-To in 10 Seconds)

### A. Updating a Dish Price (5 Seconds)
1. On your phone, log in to `/admin`.
2. Find the dish in the **Dishes** tab.
3. Tap **"Price"** directly on the dish card.
4. Type the new price in ETB (e.g. `350`) and tap **"Save"**.
5. *Result*: The new price appears instantly on every customer's phone.

### B. Hiding a Dish When Sold Out (1 Tap)
1. In the **Dishes** tab, find the item that the kitchen has run out of.
2. Tap **"Hide Dish"** *(or the eye icon)*.
3. *Result*: The item is instantly marked hidden and will not be shown to customers. When restocked tomorrow, tap **"Make Live"** to restore it.

### C. Adding a New Dish or Beverage
1. In the **Dishes** tab, tap **"+ Add Dish"**.
2. Fill in:
   * **Name**: (e.g. *Special Kitfo Pizza* or *Passion Fruit Mojito*)
   * **Category**: Select the section (e.g. *Pizza*, *Tibs*, *Mojito*, *Beer*)
   * **Price**: Enter amount in ETB, or leave blank for Market Price
   * **Description**: Ingredients and preparation notes
   * **Photo**: Upload a photo from your phone gallery or take a picture
3. Tap **"Save Dish"**.

### D. Updating Guest Wi-Fi Password
When your internet provider changes your router password:
1. In `/admin`, tap the **Theme & CMS** tab.
2. Select **"Guest Wi-Fi"**.
3. Type the new **Wi-Fi Network Name (SSID)** and **Password**.
4. Tap **"Save Live Changes"**.
5. *Result*: When diners tap the Wi-Fi button on the customer menu, they copy the updated password with 1 tap.

### E. Safety Net: "Restore to Default"
If staff accidentally change the colors, fonts, or text on the menu and you want the pristine original look back:
1. Go to **Theme & CMS**.
2. Tap **"Restore to Default"** at the top right.
3. Confirm the prompt. The menu instantly reverts to factory defaults without deleting your dishes.

---

## 🖨️ 4. Printing the Official Acrylic Table QR Stand

You do not need to print 20 different cards. You only need **one master card**:

1. Log in to `/admin` and tap the gold **"Master QR"** button in the header.
2. Review the preview card:
   * Master Vector Couch Logo with Ge'ez text (*መረባ*)
   * "SCAN FOR DIGITAL MENU" gold badge
   * High-resolution QR code
   * Guest Wi-Fi credentials box
3. **To Download**: Tap **"Download High-Res PNG"** and send the image to your local print shop in Mekelle.
4. **To Print Directly**: Tap **"Print Stand Card"** on any connected office printer.
5. **Recommended Presentation**: Place the printed card inside standard 4x6" (10x15 cm) or 5x7" clear acrylic double-sided table tent stands on every dining table and bar counter.

---

## 📊 5. Real-Time Menu Analytics & Popular Dishes Leaderboard

Track which dishes your guests view most often to optimize your kitchen prep and inventory purchasing:

1. In `/admin`, tap the **Analytics** tab.
2. View key performance metrics:
   * **Total QR Scans**: Unified count of how many guests scanned the table QR stand.
   * **Menu Impressions**: How many total customer sessions viewed the menu.
   * **Dish Views**: How many dishes customers clicked into for detail.
3. **Popular Dishes Leaderboard**: Top 8 most viewed dishes with live view counts, category tags, and current price. Use this data to identify your most profitable bestsellers and customer favorites.

---

## 🌍 6. Trilingual Language Switcher for Local Diners

The customer menu includes a trilingual toggle at the top of the screen:
* **EN**: English (default)
* **ትግ**: Tigrinya (ትግርኛ) &mdash; customized for local clientele in Mekelle
* **አማ**: Amharic (አማርኛ)

All culinary department headings, subcategories, action buttons, search bars, and filter pills translate dynamically without reloading the page.

---

## 📞 7. Technical Support & Warranty

* **Repository**: [`https://github.com/Gfani/Friends_menu.git`](https://github.com/Gfani/Friends_menu.git)
* **Branch**: `main`
* **Local Server**: Fastify REST API on port 5000 + Vite Frontend on port 5173
* **Database**: High-reliability SQLite database (`backend/prisma/dev.db`) with automatic daily backup capabilities.

*We'll be there for you!*
