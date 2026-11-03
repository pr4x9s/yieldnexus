# 🚀 YieldNexus - Investment & Referral Dashboard Platform (MERN Stack Developer Assessment)

A complete MERN stack application featuring secure user authentication, an automated daily ROI distribution engine, a live profit history tracker, and a dynamic multi-level referral network system.

---

## 🛠️ Architecture & Core Tech Stack

This project is built using a clean, modern architecture separating the backend API service from a highly responsive React client dashboard.

### Backend API Architecture (`/server`)
- **Runtime & Language:** Node.js with TypeScript, running dynamically in development via `tsx` and compiled using `tsc`.
- **Framework & Database:** Express.js paired with MongoDB using Mongoose schemas, custom data models, and database indexing.
- **Automation:** Automated backend scripts run automatically at scheduled intervals using `node-cron`.
- **Validation & Security:** Strict data validation via Zod, secure password hashing using `bcrypt`, and stateless user sessions secured by double-token JWT authentication(`jsonwebtoken`).
- **API Documentation:** Interactive API exploration docs built directly with Swagger UI (`swagger-ui-express`).

### Client Dashboard Architecture
- **Core Framework:** React 19 with TypeScript, bundled and served instantly using Vite with basic SSL support.
- **State & Data Synchronization:** Server data synchronization, state tracking, and background caching are handled by TanStack Query alongside Axios. Local UI states are managed via Zustand.
- **Data Grid Tables:** Advanced history logs are structured with TanStack Table v8, powering instant text searches, status tab filtering, and smooth frontend pagination.
- **UI Styling & Charts:** Styled with Tailwind CSS v4 and Lucide React icons, featuring responsive performance charts powered by Recharts

---

## ⚙️ Environment Configurations

Set up your project environment keys by creating a `.env` file in both the server and client folders.

### 🔌 Backend Environment Configuration (`/server/.env`)
Create a `.env` file inside the `server` root based on the provided configuration samples:
```env
PORT=8000
MONGODB_URI=mongodb+srv://username:password@clusterN.abcdefg.mongodb.net/nexachain
CORS_ORIGIN=http://127.0.0.1:5173
ACCESS_TOKEN_SECRET=your_access_token_secret_string
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret_string
REFRESH_TOKEN_EXPIRY=7d
```

### 💻 Client Environment Configuration (`/client/.env`)
Create a .env file inside the client root:
```env
VITE_SERVER_URL=http://127.0.0.1:8000/api/v1
```

---

## 🚀 Local Installation & Execution Steps

### 1. Project Initialization
Clone the repository: [https://github.com/undefinedx96/nexachain-mern-assessment.git](https://github.com/undefinedx96/nexachain-mern-assessment.git)
### 2. Launch the Backend API Instance
```bash
cd server
pnpm i
pnpm run dev
```
_The server will start up and listen securely on the configured port (e.g., port `8000`)._

### 3. Launch the React UI Framework Workspace in Another Terminal
```bash
cd client
bun i
bun run dev
```
_Open your browser to the designated network IP provided by Vite to review the dashboard application flow._

---

## 📦 Script Manifest

### Backend Commands (`/server/package.json`)
- `pnpm run dev`: Launches the server in development mode using `tsx --watch` to reload automatically when code changes.

- `pnpm run start`: Runs the pre-compiled production build of the server.

- `pnpm run build`: Compiles the TypeScript backend files into clean JavaScript code.

- `pnpm run type-check`: Runs the TypeScript compiler in watch mode to highlight layout or type errors immediately without outputting code.

### Client Commands (`/client/package.json`)
- `bun run dev`: Boots the Vite engine running exposed host variables.
- `bun run build`: Compiles production modules checking script paths and compressing static bundle outputs.

- `bun run preview`: Stages production-ready code locally inside standard deployment tracking layouts.

---

## 📈 Key Architecture & Design Decisions

### 🔄 Multi-Level Referral Hierarchy Engine
The backend uses a recursive loop lookup algorithm to handle downline rewards. When a new user signs up or performs an activity, the backend automatically traverses up the account hierarchy tree, calculating and distributing accurate network level bonuses to eligible parent accounts across multiple tiers.
### 🛡️ Idempotent Daily ROI Cron Job Scheduler
The automated yield scheduler runs on a daily cron loop configured via `node-cron`, executing automatically at **12:00 AM every night**. To protect data integrity and prevent errors, the script has a strict idempotency check:
- Before any wallet balance is incremented, the server checks the history database for an existing ROI log matching the active investment ID and the current date.
- If the cron job triggers multiple times on the same calendar day by mistake, the script catches it immediately, skips duplicate calculations, and terminates safely—guaranteeing users are never credited twice.
### ⚡ Optimized Client Data Tables (TanStack Table)
To keep network payloads small and avoid putting unnecessary heavy filtering loads on the database, the history endpoints stream simple data arrays directly to the client side. The user dashboard filters rows by status tabs, searches by matching text string targets, and paginates records locally using TanStack Table's internal engines. This delivers zero-latency updates for the user without making repeated API network requests.

---

## 📋 Core API Endpoint Documentation
Private endpoints require a valid authorization bearer token passed in the request header (`Authorization: Bearer <token>`).
_Also available as **Swagger OpenAPI** Docs at `/docs` and **Postman Collection**._
| Method | Endpoint Route | Security | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/users/register` | Public | Registers a new user account and links them to their referrer. |
| **POST** | `/users/login` | Public | Verifies credentials, manages session tracking, and returns tokens. |
| **POST** | `/users/logout` | Protected | Clears secure cookies and destroys the active token session. |
| **POST** | `/users/refresh-token` | Public | Evaluates refresh tokens to issue new short-lived access tokens. |
| **POST** | `/investments/create-investment` | Protected | Creates a new investment contract plan using available wallet balance. |
| **GET** | `/investments/get-my-investments` | Protected | Fetches all active, completed, or cancelled investment contracts for the user. |
| **GET** | `/investments/get-roi-history` | Protected | Fetches the historical log of all daily ROI payouts received by the user. |
| **GET** | `/dashboard/stats` | Protected | Returns core KPIs including wallet balance, total investments, and earnings totals. |
| **GET** | `/referrals/direct-refs` | Protected | Fetches the first-line direct user referrals list with engagement stats. |
| **GET** | `/referrals/comp-ref-tree` | Protected | Calculates and returns a structured object mapping the multi-level downline tree. |
| **GET** | `/referrals/get-referral-income-history` | Protected | Audits chronological log of commissions earned from downline registrations. |
| **POST** | `/admin/payout/trigger` | Protected (Admin) | *Testing Utility Only:* Manually triggers the automated daily cron distribution cycle. |

### 🧪 Sample Request and Response Data
[Sample Request and Response Data Here](https://github.com/undefinedx96/nexachain-mern-assessment/tree/main/server#readme)

---

## 💡 Development Assumptions Made

1. **Fixed Daily Yields:** Investment contract yields are assigned standard baseline rates when a plan is opened, rather than evaluating live variable index updates.
2. **Client-Side History Operations:** For early scalability, list history data is streamed fully to the client, allowing TanStack Table to handle sorting, status tabs, and row pagination locally in memory for maximum rendering performance.
3. **Standalone Data Layer:** The database architecture relies on core MongoDB transaction patterns and model indexes without requiring separate caching systems to simplify local setup and code evaluation.

---

## File/Folder Structure

```tree
.
├── client
│   ├── bun.lock
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── public
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── README.md
│   ├── src
│   │   ├── api
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   └── investment.service.ts
│   │   ├── App.tsx
│   │   ├── assets
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── components
│   │   │   ├── common
│   │   │   │   └── ConfirmationModal.tsx
│   │   │   ├── dashboard
│   │   │   │   ├── AnalyticsChart.tsx
│   │   │   │   ├── ReferralTable.tsx
│   │   │   │   ├── ReferralTree.tsx
│   │   │   │   └── StatCards.tsx
│   │   │   ├── investments
│   │   │   │   ├── CreateInvestment.tsx
│   │   │   │   └── InvestmentList.tsx
│   │   │   ├── layout
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── layouts
│   │   │   │   ├── AuthLayout.tsx
│   │   │   │   └── DashboardLayout.tsx
│   │   │   └── profitHistory
│   │   │       ├── ReferralIncomeList.tsx
│   │   │       └── RoiHistoryList.tsx
│   │   ├── conf
│   │   │   └── conf.ts
│   │   ├── hooks
│   │   │   ├── useDashboardData.ts
│   │   │   ├── useInvestments.ts
│   │   │   ├── useLogin.ts
│   │   │   ├── useLogout.ts
│   │   │   └── useRegister.ts
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── index.ts
│   │   │   ├── Login.tsx
│   │   │   ├── protected
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Investments.tsx
│   │   │   │   └── ProfitHistory.tsx
│   │   │   └── Register.tsx
│   │   ├── providers
│   │   │   └── AuthProvider.tsx
│   │   ├── store
│   │   │   ├── authStore.ts
│   │   │   └── themeStore.ts
│   │   ├── types
│   │   │   └── types.ts
│   │   ├── utils
│   │   │   ├── cn.ts
│   │   │   └── format.ts
│   │   └── validators
│   │       ├── auth.validator.ts
│   │       └── investment.validator.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── README.md
└── server
    ├── nexachain-mern-assessment.postman_collection.json
    ├── package.json
    ├── pnpm-lock.yaml
    ├── pnpm-workspace.yaml
    ├── public
    ├── README.md
    ├── src
    │   ├── app.ts
    │   ├── conf
    │   │   └── conf.ts
    │   ├── constants.ts
    │   ├── controllers
    │   │   ├── admin.controller.ts
    │   │   ├── dashboard.controller.ts
    │   │   ├── investment.controller.ts
    │   │   ├── referral.controller.ts
    │   │   └── user.controller.ts
    │   ├── db
    │   │   └── index.ts
    │   ├── middlewares
    │   │   ├── auth.middleware.ts
    │   │   ├── error.middleware.ts
    │   │   └── validate.middleware.ts
    │   ├── models
    │   │   ├── investment.model.ts
    │   │   ├── referralIncome.model.ts
    │   │   ├── roiHistory.model.ts
    │   │   └── user.model.ts
    │   ├── routes
    │   │   ├── admin.route.ts
    │   │   ├── dashboard.route.ts
    │   │   ├── index.ts
    │   │   ├── investment.route.ts
    │   │   ├── referral.route.ts
    │   │   └── user.route.ts
    │   ├── server.ts
    │   ├── services
    │   │   ├── cron.service.ts
    │   │   └── payout.service.ts
    │   ├── types
    │   │   ├── auth.d.ts
    │   │   └── types.ts
    │   ├── utils
    │   │   ├── ApiError.ts
    │   │   ├── ApiResponse.ts
    │   │   └── asyncHandler.ts
    │   └── validators
    │       ├── auth.validator.ts
    │       └── investment.validator.ts
    ├── swaggerOpenapiDocs.yaml
    └── tsconfig.json
```
