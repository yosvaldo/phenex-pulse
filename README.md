# Phenex-Pulse

Phenex-Pulse is an internal web-based management tool designed to track factory production orders, monitor supply chain logistics, and manage distributor invoicing and payments. 

## Features
- **Role-Based Access:** Full CRUD access for Developers, read-only access for Admins.
- **Production Tracking:** Monitor goods across four stages: Production, Transit, Transport, and Ready.
- **Distributor Management:** Track invoice statuses (Outstanding, Overdue, Paid) and rank distributors.
- **Automated Alerts:** Email reminders for reordering stock and collecting payments via Resend.
- **Analytics:** Real-time metrics on incoming goods and total invoices.

## Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js Route Handlers (REST API), Prisma ORM
- **Database:** PostgreSQL (Neon)
- **Validation:** Zod
- **Email:** Resend API

## Quick Start
1. Clone the repository
2. Install dependencies: `npm install`
3. Setup environment variables (`.env`)
4. Run migrations: `npx prisma db push`
5. Start the development server: `npm run dev`