# ⚡ Phenex-Pulse — Internal Supply Chain & Logistics Operations Engine

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**Phenex-Pulse** is an enterprise-grade internal management platform engineered to oversee global factory production, multi-tier overseas supply chain logistics, and distributor invoicing pipelines. Designed with a luxury, minimal aesthetic and strict software quality constraints, it automates critical operational alerts for product restocking and debt collection.

---

## 🚀 Key Features

### 🛡️ Role-Based Access Control (RBAC) & Security
* **Granular Permission Hierarchy:** Enforces strict role boundaries—`Dev` users hold full CRUD control over factory orders and invoices, while `Admin` users are restricted to read-only dashboard access.
* **Dual-Layer Boundary Validation:** End-to-end runtime data validation powered by Zod schemas on both client forms and server endpoints to prevent invalid payloads.

### 🏭 Supply Chain & Factory Order Lifecycle
* **Multi-Stage Logistics Pipeline:** Tracks factory orders across four distinct physical states: `PRODUCTION` ➔ `TRANSIT` ➔ `TRANSPORT` ➔ `READY`.
* **Lead Time Management Engine:** Models multi-week factory production schedules (15, 30, 45, 60, 75 days) alongside overseas and inland transport transitions (3–7 days to overseas warehouse; 4–6 weeks to receiving warehouse; 5–9 days to main warehouse).
* **Automated Stock Reorder Triggers:** System monitors lead times and inventory depletion, utilizing the **Resend API** to automatically dispatch reorder email notifications to operations staff.

### 🚚 Distributor Management & Automated Collections
* **State-Driven Invoicing Pipeline:** Manages distributor payment lifecycles through deterministic states (`OUTSTANDING` ➔ `OVERDUE` ➔ `PAID`) under 30-to-60 day credit terms.
* **Automated Collection Engine:** Dispatches timely email payment reminders via Resend API based on upcoming due dates and overdue flags.
* **Performance Leaderboard:** Ranks distributors dynamically based on total order volume and historical payment promptness.
* **Automated Inventory Allocation:** Enforces business logic designating an **85% allocation to existing distributors** and a **15% allocation to new partners and retail channels** upon main warehouse arrival.

### 📊 Operations Dashboard & BI Analytics
* **Executive Summary Widgets:** Displays immediate operational metrics including active batches in transit, pending outstanding invoices, and overdue balances.
* **Server-Side Paginated Lists:** Implements server-side pagination enforcing a strict 10-item limit per page across all list views (Suppliers, Distributors, and Reports) for optimal data transfer efficiency.
* **Historical Reporting:** Tracks aggregated metrics on overall inventory arrivals and invoice throughput.

---

## 🛠️ Software Architecture & Clean Code Standards

To ensure long-term maintainability and performance, the application complies with strict code hygiene constraints:
* **File & Function Bounds:** Every component/module is strictly capped under **200 lines of code**, with individual functions restricted to **15 lines maximum**.
* **Zero Production Logs:** Automated build step stripping all debug and development logs prior to production deployment.
* **Serverless Database Infrastructure:** Backend powered by PostgreSQL hosted on Neon.tech with connection pooling via Prisma ORM.

---

## 💻 Tech Stack

### **Frontend & Interface**
* **Framework:** Next.js (App Router), TypeScript
* **Styling & Icons:** Tailwind CSS, Lucide React
* **Validation:** Zod Schema Validation
* **Hosting:** Vercel

### **Backend & Services**
* **Runtime & API:** TypeScript, Next.js API Routes / REST Middleware
* **Database & ORM:** Managed PostgreSQL (Neon.tech), Prisma ORM
* **Transactional Email Engine:** Resend API
