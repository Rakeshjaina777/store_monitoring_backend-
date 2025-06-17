# 🧠 Store Monitoring Backend – NODE JS + PostgreSQL + Prisma

A scalable, production-ready backend built with **Node JS**, **PostgreSQL**, and **Prisma ORM** to track and download restaurant store uptime/downtime reports with business-hour awareness and real-time analytics.

---

## 🚀 Tech Stack

| Layer            | Tool                              |
|------------------|-----------------------------------|
| Backend          | [Node JS](https://nestjs.com/)     |
| ORM              | [Prisma](https://www.prisma.io/)  |
| Database         | PostgreSQL                        |
| API Docs         | Swagger + OpenAPI                 |
| Runtime          | Node.js (v18+)                    |
| Auth/Guard       | Custom Roles + AuthGuard (Mocked) |
| Security         | Helmet, CORS, secure headers      |
| Containerization | Docker + Docker Compose           |

---

## 🛠️ Local Installation

```bash
# Clone the repository
git clone https://github.com/your-org/store-monitoring-backend.git
cd store-monitoring-backend

# Install dependencies
npm install

# Create environment config
cp .env.example .env

# Start local PostgreSQL if not using Docker
docker run -d --name store-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres

# Migrate the database schema
npx prisma migrate dev --name init

# Optional: Seed test data
npm run seed

# Start the dev server
npm run start:dev
```

---

## 🐳 Docker Setup

```bash
# Build and run both backend and DB using docker-compose
docker-compose up --build
```

- Backend: http://localhost:3000
- Swagger Docs: http://localhost:3000/api
- PostgreSQL: exposed on port 5432


---

## 📁 Folder Structure

```
src/
├── common/            # DTOs, enums, guards, middleware, filters, utils
├── modules/           # Modular features (store, report, etc.)
├── prisma/            # Schema, seed, and client
├── config/            # App and env config
├── main.ts            # App bootstrap
```

---

## 🧠 Prisma Schema & Relationships

```prisma
model Store {
  id            String              @id @default(uuid())
  name          String
  timezone      String              @default("America/Chicago")
  businessHours StoreBusinessHour[]
  statuses      StoreStatus[]
}

model StoreStatus {
  id        String   @id @default(uuid())
  storeId   String
  status    StoreActivityStatus
  timestamp DateTime
  store     Store    @relation(fields: [storeId], references: [id])
  @@index([storeId, timestamp])
}

model StoreBusinessHour {
  id        String @id @default(uuid())
  storeId   String
  dayOfWeek Int
  startTime String
  endTime   String
  store     Store @relation(fields: [storeId], references: [id])
}

enum StoreActivityStatus {
  active
  inactive
}
```

---

## 🌐 API Documentation (Swagger)

Available at: **http://localhost:3000/api**

![image](https://github.com/user-attachments/assets/68766b7e-c79c-4a41-973f-2692d140a339)


### `POST /trigger_report`

Triggers report generation. Returns a report ID.

```json
{
  "reportId": "abc123-report-id"
}
```

---

### `GET /get_report/:reportId`

Poll report status or download CSV if complete.

- If pending:
```json
{ "status": "Running" }
```

- If ready: downloads a CSV file.

---

### `POST /stores`

Creates a new store.

```json
{
  "name": "Loop Pizza",
  "timezone": "America/New_York"
}
```

---

### `POST /stores/:id/status`

Adds an activity status log.

```json
{
  "status": "active",
  "timestamp": "2025-06-14T10:00:00Z"
}
```

---

## 🧪 Sample CSV Output

https://github.com/Rakeshjaina777/store_monitoring_backend-/tree/main/output_sample

```
store_id,uptime_last_hour(in minutes),uptime_last_day(in hours),uptime_last_week(in hours),downtime_last_hour(in minutes),downtime_last_day(in hours),downtime_last_week(in hours)
abc123,45,12.5,80.3,15,11.5,39.7
```
![image](https://github.com/user-attachments/assets/ffc72e11-6730-4d99-a24c-7fc7ed386261)


---

## 📦 Environment Variables

| Key             | Example                                      | Description                        |
|------------------|----------------------------------------------|------------------------------------|
| `DATABASE_URL`   | `postgresql://postgres:postgres@localhost`   | Prisma DB URL                      |
| `PORT`           | `3000`                                       | App port                           |
| `NODE_ENV`       | `development` / `production`                 | Mode                               |

---

## 🛡 Security Features

- ✅ Helmet-based HTTP headers
- ✅ CORS configuration
- ✅ Secure response headers
- ✅ Global DTO validation
- ✅ Role-based route protection
- ✅ Global exception handling
- ✅ Global response interceptor

---

## 🧠 Future Scope / Improvement

- **🔐 Role-Based Access Control (RBAC)**  
  **Why it matters**: Enforces strict user permissions, ensuring that only authorized personnel (admins, staff, managers) can access specific features.  
  **Future implementation**: Leverage NestJS `@Roles()` decorators and `AuthGuard`, structured with enums and user claims inside JWT tokens.

- **🕒 Scheduled Auto-Reports via Cron + Redis Caching**  
  **Why it matters**: Automates daily/weekly report generation and caching to eliminate manual triggers and optimize performance.  
  **Future implementation**: Use `@nestjs/schedule` for cron-based jobs and Redis to cache report data for quick retrieval.

- **⚙️ Background Queue with BullMQ for Heavy Report Jobs**  
  **Why it matters**: Offloads intensive report computation from the main thread, ensuring API responsiveness even under load.  
  **Future implementation**: Integrate `BullMQ` + Redis to enqueue report generation and process asynchronously with retry logic.

- **📡 Real-Time Downtime Notifications (WebSockets + Alerts)**  
  **Why it matters**: Provides instant visibility to store managers when a store goes inactive. Great for operations and SLA monitoring.  
  **Future implementation**: Implement WebSocket (via `@nestjs/websockets`) or MQTT, and optionally send email/Slack alerts.

- **📊 PDF Report Export for Stakeholders**  
  **Why it matters**: Generates printable summaries for managers and executives, usable in reviews and compliance.  
  **Future implementation**: Render reports to PDF using `Puppeteer`, `html-pdf`, or similar libraries.

- **🏢 Multi-Tenant SaaS Mode with Billing**  
  **Why it matters**: Supports scaling across multiple organizations with isolated data and role access per org. Opens monetization opportunities.  
  **Future implementation**: Add tenant-aware data layers + billing integration via Stripe for usage tiers.
---

## 🧑‍💻 Author & Maintainer

- 👤 **Author**: Rakesh Jain
- 🏢 **Linkdien**: https://www.linkedin.com/in/rakesh-jain-b93b28223/

- 🛠 **Stack**: Node.js · NestJS · PostgreSQL · Prisma · Swagger · Docker

---
