# 📋 SOFTWARE DELIVERY & ACCEPTANCE AGREEMENT

> **Project**: Mereba Friends Garden (መረባ ፍሬንድስ) &bull; Commercial Digital QR Menu Suite  
> **Client**: Mereba Friends Garden Bistro & Lounge &bull; Kebele 17, Mekelle, Tigray  
> **Developer / Vendor**: Independent Software Engineer  
> **Date of Delivery**: November 2026  

---

## 1. Scope of Deliverables

The Developer has designed, configured, and delivered the complete in-restaurant digital menu platform to the Client, including:

1. **Mobile Customer Digital Menu**:
   * Instant loading (< 0.5s) Progressive Web App (PWA) with offline caching.
   * Central Perk casual luxury theme (`#050505` black canvas, `#FFBD18` gold accents).
   * Two culinary departments: **Food** & **Drinks** across 12 distinct categories.
   * 29 pre-loaded menu items with high-resolution food photography, descriptions, and ETB pricing.
   * Instant 3-Language switcher: **English (`EN`)**, **ትግርኛ / Tigrinya (`ትግ`)**, and **አማርኛ / Amharic (`አማ`)**.
   * Complimentary Guest Wi-Fi access card with 1-tap copy.
   * Social media links to official Instagram, TikTok, and direct phone ordering.

2. **Manager & Admin Dashboard (`/admin`)**:
   * Password-protected management console with `bcrypt` encryption and brute-force lockout.
   * 1-Tap dish availability toggle (*Live* vs. *Hidden*) for kitchen stock management.
   * 5-Second inline price editor in Ethiopian Birr (ETB).
   * Live Content Management System (CMS) to edit restaurant philosophy, address, and Wi-Fi credentials.
   * Real-time visitor analytics, QR scan counter, and Popular Dishes Leaderboard.
   * High-resolution Master QR acrylic stand card generator with 1-click printing.

3. **Operational Documentation & Launch Tools**:
   * `CLIENT_HANDOVER.md`: 1-Page Manager Operations Guide & Cheatsheet.
   * `DEPLOYMENT.md`: Step-by-step cloud, VPS, and local in-restaurant server deployment manual.
   * `start-restaurant.bat`: 1-Click Windows launcher for the restaurant cashier counter.

---

## 2. Credentials & Security Handover

The default administrative credentials provided at handover:
* **Admin Portal URL**: `/admin/login`
* **Default Username**: `admin` *(or `admin@friends.com`)*
* **Initial Password**: `admin123`

> [!IMPORTANT]
> The Client acknowledges that they have been shown how to update their administrative email and password under the **Shield / Manager Profile** tab upon handover. The Developer is not liable for unauthorized access resulting from failure to change the default password.

---

## 3. Warranty & Technical Support (1-Year Terms)

1. **System Stability Warranty**:
   * The Developer warrants that the software is delivered free of critical bugs, memory leaks, and blocking errors.
   * The system is engineered to run continuously for 1 year (and beyond) with zero programmatic memory bloat.

2. **Free Maintenance Period**:
   * The Developer will provide **90 days of complimentary technical support** from the delivery date for any software defects, bug fixes, or minor configuration assistance.

3. **Ongoing Cloud Hosting & Backups**:
   * If hosted on a cloud platform (e.g. Render, Railway, or VPS), monthly hosting fees are the responsibility of the Client unless a monthly maintenance agreement is active.
   * The Client has been instructed on the 5-second database backup procedure (`dev.db` copy) for total data safety.

---

## 4. Acceptance & Signatures

By signing below, the Client confirms that they have received the working software, witnessed a live demonstration of menu browsing, price updates, and QR scanning, and accepts delivery of the platform.

<br />

**For the Client (Mereba Friends Garden):**

Signature: _____________________________________________  
Print Name: ___________________________________________  
Title: Restaurant Owner / General Manager  
Date: _________________________________________________  

<br />

**For the Developer:**

Signature: _____________________________________________  
Print Name: ___________________________________________  
Title: Lead Software Engineer  
Date: _________________________________________________  

