# 🎫 Concert Ticket Reservation System (Full-stack Assignment)

A full-stack web application that allows users to reserve concert tickets, and admins to manage concerts and view reservation history.

## 🛠 Tech Stack

- **Frontend:** Next.js (v13), TypeScript, MUI (Material UI)
- **Backend:** NestJS (v9), TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Testing:** Jest
- **Utilities:** Day.js, Axios

## 📦 Installation

### 1. Clone this repo

```bash
git clone https://github.com/pkapoom-333/assignment_datawow.git
cd assignment_datawow
```

### 2. Backend Setup

```bash
cd backend
cp .env
# Fill in DATABASE_URL with your PostgreSQL connection string

npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.local
# Set NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

npm install
npm run dev
```

## 🔐 Environment Variables

### Backend

- `DATABASE_URL`: PostgreSQL connection string

### Frontend

- `NEXT_PUBLIC_API_BASE_URL`: Base URL of the NestJS backend API

## 🧪 Running Tests

```bash
# Run backend unit tests
cd backend
npm run test
```

## 📋 API Overview

| Method | Endpoint                   | Description                        |
| ------ | -------------------------- | ---------------------------------- |
| GET    | /concerts                  | Get all concerts                   |
| POST   | /concerts                  | Create a new concert (Admin)       |
| DELETE | /concerts/\:id             | Delete a concert (Admin)           |
| POST   | /reservation               | Reserve a seat                     |
| PUT    | /reservation               | Cancel reservation                 |
| GET    | /reservation/user-actions  | Get user's action log (admin view) |

## ✅ Features

- Admin dashboard to manage concerts and view user logs
- User can reserve and cancel one seat per concert
- Prevents overbooking via Prisma transaction
- Error handling on both server and client sides
- Unit tests for ReservationService

## 🚀 Bonus: Optimization Strategy

### Performance

- Use Redis to cache concert data
- Implement pagination for large concert lists
- Optimize database with indexes on `concertId`, `userId`

### Concurrency (High Load Booking)

- Use `Prisma.$transaction` to handle concurrent seat booking
- Check seat availability before creating reservation
- Lock concert rows with DB-level consistency or use distributed queues

## 🙋‍♂️ Author

- Developed by [ตี๋](https://github.com/pkapoom-333)
