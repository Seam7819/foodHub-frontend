# OrgNest Frontend

OrgNest Frontend is a responsive organization management web application built with Next.js.

Users can browse meals, place orders, manage carts, and providers can manage meals and orders.

---

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios
- Context API
- Sonner Toast

---

## Features

### Authentication

- Login
- Registration
- Logout
- JWT Storage
- Protected Routes

### Customer Features

- Browse Meals
- Search Meals
- Filter Meals
- View Meal Details
- Add To Cart
- Manage Cart
- Checkout
- View Orders
- Leave Reviews

### Provider Features

- Create Meals
- Update Meals
- Delete Meals
- Manage Orders

### Admin Features

- Manage Categories
- Manage Users
- Monitor Orders

---

## Responsive Design

Supports:

- Mobile
- Tablet
- Desktop

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create `.env.local` from the example file:

```bash
cp .env.local.example .env.local
```

Then update `.env.local` with your values:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Keep `STRIPE_SECRET_KEY` secret and do not commit it to source control. `.env.local` is ignored by `.gitignore`, while `.env.local.example` can be safely committed.

### Vercel production deployment

Set a Vercel environment variable for the frontend project:

```env
NEXT_PUBLIC_API_URL=https://food-hub-backend-eosin.vercel.app/api
```

Then redeploy the frontend.

For the backend project, make sure the deployed backend has any required database and secret env vars configured in Vercel as well.

---

## Run Development Server

```bash
npm run dev
```

Application URL

```txt
http://localhost:3000
```

---

## Project Structure

```txt
src
├── app
│   ├── login
│   ├── register
│   ├── meals
│   ├── cart
│   ├── orders
│   └── profile
│
├── components
│   ├── layout
│   ├── meals
│   ├── cart
│   └── shared
│
├── services
│   ├── auth.service.ts
│   ├── meal.service.ts
│   ├── cart.service.ts
│   └── order.service.ts
│
├── context
│   └── AuthContext.tsx
│
├── hooks
├── lib
└── types
```

---

## Authentication Flow

### Login

```txt
User Login
      ↓
Access Token
      ↓
Store in LocalStorage
      ↓
Protected Routes
```

### Protected Route

```txt
Customer
Provider
Admin
```

Access control is handled using JWT and role-based authorization.

---

## Available Scripts

Development

```bash
npm run dev
```

Build

```bash
npm run build
```

Start Production

```bash
npm start
```

Lint

```bash
npm run lint
```

---

## Author

FoodHub Frontend
