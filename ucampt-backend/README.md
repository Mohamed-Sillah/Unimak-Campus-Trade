# Ucampt Backend

Express.js backend for the Ucampt marketplace.

## Installation

```bash
npm install
```

## Running the Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Seeding the Database

```bash
npm run seed
```

This creates:
- **Admin user**: `sillah@university.edu` / `sillah001`
- **Sample products**: 3 test listings

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/register` - Register new user

### Products (Admin only for create/update/delete)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PATCH /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get orders (users see their own, admins see all)
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id` - Update order status (admin only)
