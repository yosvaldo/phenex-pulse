# ⚡ Phenex-Pulse — Internal Supply Chain & Logistics Operations Engine

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)](https://resend.com/)

**Phenex-Pulse** is an enterprise-grade, Progressive Web App (PWA) engineered to oversee global factory production, multi-tier overseas supply chain logistics, and distributor invoicing pipelines. Built on a serverless Next.js architecture, it features automated cron-driven alerts for product restocking and invoice collection, ensuring seamless operational continuity.

---

## 🚀 Key Features

### 🛡️ Secure Authentication & PWA Integration
- **JWT Session Management:** Secure login and logout flows protected by Next.js Middleware to ensure route isolation between authenticated personnel and public access.
- **Progressive Web App (PWA):** Fully mobile-responsive UI featuring a unified manifest implementation, allowing operational staff to install the dashboard directly to their mobile home screens for native-like app access.

### 🏭 Supply Chain & Dynamic Lead Time Engine
- **Multi-Stage Logistics Pipeline:** Tracks factory orders across four distinct physical states: `PRODUCTION` ➔ `TRANSIT` ➔ `TRANSPORT` ➔ `READY`.
- **Dynamic ETA Recalculation:** The backend dynamically recalculates Estimated Time of Arrival (ETA) based on real-time status mutations (e.g., automatically appending exact transit and buffer days the moment a shipment leaves the factory), alongside manual overrides for warehouse readiness.
- **Custom Inventory Strategies:** Supports multiple replenishment algorithms including standard Numeric Thresholds, "Once Distributed", "Twice a Year", and "Once a Year" reorder rules.

### 🚚 Distributor Management & Invoicing
- **B2B Order Tracking:** Full lifecycle management of distributor accounts and multi-item purchase invoices.
- **State-Driven Invoicing:** Tracks payment states (`OUTSTANDING` ➔ `OVERDUE` ➔ `PAID`), dynamically calculating total amounts and formatting regional currency (IDR).

### ⚙️ Serverless Cron & Automated Operations
- **Vercel Scheduled Jobs:** A secure, token-protected `/api/cron` endpoint executes automatically at 02:00 UTC (09:00 AM Jakarta time).
- **Intelligent Stock Alerts:** The JavaScript filter engine bypasses strict database limitations to accurately evaluate mixed inventory strategies, instantly dispatching low-stock warnings via the Resend API.
- **Automated Collection Engine:** Evaluates outstanding invoice due dates, auto-updates expired records to `OVERDUE`, and dispatches consolidated Handlebars-templated HTML emails to administrators.

### 📊 Business Intelligence Analytics
- **Real-Time KPI Dashboard:** High-level executive overview aggregating total realized revenue, outstanding debt, active manufacturing shipments, and urgent action items directly on the root path.

---

## 🛠️ Software Architecture & Clean Code Standards

To ensure long-term maintainability and performance, the application complies with strict code hygiene constraints:
- **Strict File Bounds:** Every module and page component is engineered to remain under a **200-line strict limit**, enforcing clean architecture and separation of concerns.
- **Serverless Database Infrastructure:** Backend powered by PostgreSQL hosted on Neon.tech with connection pooling via Prisma ORM.
- **Edge-Ready API:** All routes are built using Next.js App Router API handlers, optimizing cold starts and response times.

---

## 💻 Tech Stack

### **Frontend & Interface**
- **Framework:** Next.js 14+ (App Router), TypeScript
- **Styling & Icons:** Tailwind CSS, Lucide React
- **PWA Integration:** Web Manifest & Next.js Viewport Metadata

### **Backend & Services**
- **Runtime & API:** TypeScript, Next.js Route Handlers
- **Database & ORM:** Managed PostgreSQL (Neon.tech), Prisma Client
- **Automation:** Vercel Cron Jobs
- **Transactional Email Engine:** Resend API, Handlebars HTML Templates

---

## 🔗 Connect with Phenex
- **Instagram**: [https://www.instagram.com/phenexfishingline/](https://www.instagram.com/phenexfishingline/)
- **Tiktok**: [https://www.tiktok.com/@phenexfishingline](https://www.tiktok.com/@phenexfishingline)
- **Shopee**: [https://shopee.co.id/phenexfishingline](https://shopee.co.id/phenexfishingline)