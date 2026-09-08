# College Student Supply Platform

Full-stack web app for students to order stationery, snacks, books, and daily-use items using text and voice commands.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB + JWT
- Realtime: Socket.IO for live order status updates
- Cloud: Render deployment config + Cloudinary integration for product image storage

## Folder Structure

- `client/` - React app
- `server/` - Express API and business logic
- `render.yaml` - Render backend deployment configuration

## Backend Setup

1. Copy `server/.env.example` to `server/.env`
2. Install dependencies:
   - `cd server`
   - `npm install`
3. Seed data:
   - `npm run seed`
4. Start server:
   - `npm run dev`

## Frontend Setup

1. Copy `client/.env.example` to `client/.env`
2. Install dependencies:
   - `cd client`
   - `npm install`
3. Start app:
   - `npm run dev`

## Default Admin Credentials

- Email: `admin@college.com`
- Password: `Admin@123`

## Key Features Implemented

- Student-focused UI with pages: Home, Product Listing, Cart, Orders, Profile
- Admin page for adding products and changing order status
- JWT authentication (register/login/me)
- Product search + category filtering
- Cart management (add/update/remove/clear)
- Place orders with delivery address
- Realtime order tracking with Socket.IO
- Voice command button (Web Speech API)
  - `Add 2 notebooks to cart`
  - `Order Maggi and Coke`
  - `Show my orders`
  - `Search snacks`
- Recommendations endpoint based on previous orders
- Email notification support for order placement (via SMTP env vars)
- Dark mode toggle

## API Endpoints (high-level)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `POST /api/products` (admin)
- `POST /api/products/upload` (admin, Cloudinary)
- `GET /api/cart`
- `POST /api/cart`
- `PATCH /api/cart`
- `DELETE /api/cart/:productId`
- `POST /api/orders`
- `GET /api/orders`
- `PATCH /api/orders/:id/status` (admin)
- `GET /api/orders/recommendations`
- `PATCH /api/users/profile`
