# PortNet Full-Stack Dashboard

A production-grade maritime management dashboard built with **Next.js 16**, **Prisma**, and **PostgreSQL**. This application provides real-time vessel tracking, port management, and weather integration with a robust **Role-Based Access Control (RBAC)** system.

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Authentication**: Custom JWT-based (Access/Refresh tokens)
- **UI Components**: Radix UI / Shadcn UI
- **Icons**: Lucide React
- **Weather API**: OpenWeatherMaps

## ✨ Key Features

- **Advanced RBAC**: Granular data isolation between Admins and Shipping Agents.
- **Vessel Tracking**: Real-time status monitoring (In Roads, At Port, At Quay).
- **Port Intelligence**: Detailed bathymetry data and dynamic weather conditions per port.
- **Dynamic Dashboard**: Interactive vessel map and agency-specific statistics.
- **Security**: Secure authentication flow with server-side session validation.

## 🏗️ Architecture Overview

The system follows a clean, layered architecture:
- **Data Layer**: Prisma ORM handles PostgreSQL interactions with optimized query patterns.
- **Access Layer**: Centralized data access logic (`data-access.ts`) enforces security boundaries.
- **Service Layer**: External integrations (Weather API) and Auth services.
- **UI Layer**: React Server Components (RSC) for performance and Client Components for interactivity.

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/manal-khafi/portnet-internship-projectgit
cd portnet-dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/portnet"
JWT_SECRET="your-super-secret-key"
OPENWEATHER_API_KEY="your-api-key"
```

### 4. Database Setup
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Run Locally
```bash
npm run dev
```

## 📁 Folder Structure

- `src/app/`: Next.js App Router (Routes & Server Actions)
- `src/components/`: UI components library (Atoms, Molecules, Shadcn)
- `src/lib/`: Core utilities (Auth, Data Access, Prisma, Weather)
- `src/services/`: Business logic services
- `prisma/`: Database schema, migrations, and seed scripts
- `public/`: Static assets

## 🔒 Security & RBAC Model

The application enforces a strict data isolation policy:
- **ADMIN**: Global visibility. Can monitor all ports, vessels, and agency performance.
- **AGENT**: Restricted visibility. Agents can only view and manage vessels (`Escales`) associated with their specific `Agence ID`. This is enforced at the database query level using Prisma's `where` filters.

