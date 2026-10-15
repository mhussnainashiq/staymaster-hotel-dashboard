# StayMaster — Hotel Management System

A professional hotel management dashboard built with React and Vite.

## Features

- **Dashboard** — Occupancy rates, booking stats, revenue KPIs, charts
- **Room Management** — CRUD for rooms, types, rates, availability, maintenance
- **Reservations** — Create/edit reservations with conflict detection (same room + overlapping dates)
- **Guest Management** — Guest profiles and history
- **Check-in / Check-out** — Status updates, auto room status, bill generation
- **Housekeeping** — Task status tracking
- **Room Service** — Order placement and status workflow
- **Billing** — Invoices, mark as paid, printable invoices
- **Staff Management** — Staff CRUD
- **Reports** — Summary metrics and charts
- **Settings** — Light/dark theme, data reset
- **LocalStorage** persistence
- Fully responsive (desktop, tablet, mobile)

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

- React 18 + Vite
- React Router DOM
- Lucide React icons
- Recharts
- Custom CSS (no Tailwind)
- LocalStorage for demo data

## Notes

- All data is fictional demo data
- No backend or external APIs required
- Booking conflict prevention is enforced on create/edit
