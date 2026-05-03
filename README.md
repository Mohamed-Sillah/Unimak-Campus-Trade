# Ucampt Frontend

A React 19 + Vite e-commerce frontend for **Unimak Campus Trade (Ucampt)**, a trust-based, admin-mediated university marketplace operated by a registered student organization.

## Project Overview

Ucampt is a simple, secure marketplace where:
- **Buyers** (verified university community members) browse, search, add to cart, and purchase items
- **Organization Admins** manually create/edit/remove listings after off-system validation
- **Students who want to sell** must contact the Organization via email/WhatsApp/phone for approval

When items sell, the Organization retains a **6% service fee** and manually remits **94%** to the student seller via bank transfer, Orange Money, Afri Money, or cash.

**Key constraint**: There is NO seller portal, NO seller registration form, and NO seller dashboard—all selling activity is 100% admin-controlled.

## Tech Stack

- **Frontend**: React 19, React Router 7
- **Build**: Vite 7
- **State Management**: React Context (Auth + Cart)
- **API Client**: Axios with automatic token injection
- **Styling**: CSS (global stylesheet)
- **Linting**: ESLint with React Hooks rules

## System Requirements

- **Node.js**: 16+ ([download](https://nodejs.org/))
- **npm**: 8+
- **Backend API**: Running on `http://localhost:5000/api`
  - Node.js + Express/NestJS or Python/Django
  - PostgreSQL database
- **Stripe account** (Organization-owned)
- **Email service** (for order notifications)
- **Image storage**: Cloudinary or AWS S3
- **University SSO or .edu email verification**

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Ensure Backend is Running
The frontend expects the backend API at `http://localhost:5000/api`.

### 3. Start Development Server
```bash
npm run dev
```
Vite will start on `http://localhost:5173` by default.

### 4. Open in Browser
Navigate to `http://localhost:5173` and verify the app loads.

## Available Scripts

```bash
# Start development server (auto-reload)
npm run dev

# Build for production
npm run build

# Lint code
npm lint

# Preview production build locally
npm run preview
```

## Project Structure

```
src/
├── assets/
│   └── styles/
│       ├── global.css           # Global styles
│       ├── images/
├── components/
│   ├── admin/
│   │   └── AdminSidebar.jsx     # Admin navigation sidebar
│   ├── common/
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── Notification.js
│   │   ├── NotificationPopup.js
│   │   └── ProtectedRoute.jsx   # Role-based route protection
│   └── product/
│       └── ProductCard.jsx      # Reusable product display
├── context/
│   ├── AuthContext.jsx          # User & login state
│   └── NotificationContext.jsx  
├── layouts/
│   ├── AdminLayout.jsx          # Sidebar + outlet for admin pages
│   └── PublicLayout.jsx         # Navbar + footer for public pages
├── pages/
│   ├── admin/
│   │   ├── CreateListing.jsx    # Create listings (admin-only)
│   │   ├── Dashboard.jsx        # Overview & analytics
│   │   ├── Categories.jsx       
│   │   └── EditListing.jsx      # Edit listings (admin-only) 
│   └── public/
│       ├── Login.jsx
│       ├── ForgotPassword.jsx
│       ├── Home.jsx
│       ├── Product.jsx
│       └── ProductDetails.jsx
├── routes/
│   └── AppRoutes.jsx            # React Router configuration
├── services/
│   ├── api.js                   # Axios instance with token auth
│   ├── productService.js        # Product API calls
│   └── paymentService.js        # Payment processing
├── App.jsx
└── main.jsx                     # Entry point with providers
```

## Architecture

### State Management: React Context

Two Context providers wrap the entire app:

#### AuthContext
Manages user authentication and role-based access:
```jsx
const { user, login, logout } = useAuth();
```
- `user`: Contains user object with `role` property (`"ADMIN"` or `null`)
- `login(userData)`: Store user after successful authentication
- `logout()`: Clear user state

### Routing

[src/routes/AppRoutes.jsx](src/routes/AppRoutes.jsx) defines two route trees:

**Public Routes:**
- `/` — Landing/home page
- `/product/:id` — Product details

**Admin Routes (Protected):**
- `/admin` — Dashboard (overview, stats)
- `/admin/create-listing` — Create/edit product

Protected routes use `ProtectedRoute` wrapper, which checks `role === "ADMIN"` against AuthContext.

### API Service

[src/services/api.js](src/services/api.js) exports an Axios instance:
- **Base URL**: `http://localhost:5000/api`
- **Auto-auth**: Automatically attaches `Authorization: Bearer {token}` to all requests (from `localStorage.getItem("token")`)

All service files should import and use this instance:
```javascript
import api from './api';

export const getProducts = () => api.get('/products');
export const createListing = (data) => api.post('/products', data);
```

## Backend API Contracts

The frontend expects these endpoints:

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | Public | Returns `{ user, token }` |
| GET | `/products` | Public | List all active listings |
| POST | `/products` | Admin | Create new listing |
| GET | `/products/:id` | Public | Get product details |
| PATCH | `/products/:id` | Admin | Edit listing |
| DELETE | `/products/:id` | Admin | Remove listing |

## Admin-Only Features

These require `role="ADMIN"` in user object:

- **Create/Edit/Delete Listings**: Manual entry of products with internal fields (seller name, contact, agreed payout method, notes)
- **Financial Dashboard**: Track total sales, 6% fees, amounts pending to students
- **Payout Export**: Generate CSV/PDF reports for manual student remittance
- **Site Management**: Categories, settings, user bans, order cancellations

## Key Concepts

### Listing Creation (Admin-Only)
Admins manually create listings after off-system validation:
1. Student contacts Organization via email/WhatsApp/phone
2. Organization validates student status and item details
3. Admin creates listing with:
   - Public fields: title, description, images, price, category, condition
   - Internal fields: student name, phone, email, WhatsApp, agreed payout method, private notes

### Payment Flow
1. Buyer checks out with card (Stripe)
2. Stripe captures payment to **Organization's account**
3. Admin views order in dashboard
4. Admin marks as "Completed" when picked up
5. Admin exports payout report (student name, amount due)
6. Admin manually transfers 94% to student via chosen method
7. Admin marks payout as completed in system

### Authentication
- Login endpoint returns `{ user, token }`
- Frontend stores token in `localStorage`
- Axios interceptor auto-attaches token to all requests
- Protected routes check `user.role === "ADMIN"`

## Development Workflow

### Adding a New Page
1. Create component in `src/pages/public/` or `src/pages/admin/`
2. Add route to `src/routes/AppRoutes.jsx`
3. Wrap admin routes with `<ProtectedRoute role="ADMIN">`
4. Use appropriate layout (`PublicLayout` or `AdminLayout`)

### Adding a Feature
1. Create service method in `src/services/*.js` using the `api` instance
2. Add context if shared state is needed, or use `useState` for page-specific state
3. Import and use in component
4. Add route if new page is needed

## Important Notes

⚠️ **No Seller Portal**: Never create a "sell item" form, seller signup, or seller dashboard.

⚠️ **Admin-Controlled**: All listing creation/editing must be admin-only. Buyers can only browse and purchase.

⚠️ **Manual Payouts**: There is no automated payout system in v1. Admins export reports and manually transfer funds.

⚠️ **6% Retention**: Stripe captures 100% of payment. The 6% fee is retained naturally; 94% is remitted manually to students.

⚠️ **Auth Persistence**: Login state is lost on page refresh. Consider syncing with `localStorage` or server sessions.

## Troubleshooting

**Issue**: `npm run dev` fails with exit code 1
- Check backend is running on `http://localhost:5000/api`
- Verify Node.js and npm versions: `node -v`, `npm -v`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Issue**: API requests fail with 401 (Unauthorized)
- Ensure token is set in `localStorage.setItem("token", ...)`
- Check `axios` interceptor in `src/services/api.js`
- Verify login endpoint returns `token` field

**Issue**: Admin routes redirect to home
- Check user object has `role: "ADMIN"` (case-sensitive)
- Verify `ProtectedRoute` component logic in `src/components/common/ProtectedRoute.jsx`

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Stripe API Reference](https://stripe.com/docs/api)

## License

This project is operated by Unimak Campus Trade, a registered student organization.

## Project Supervisor
-Mr Lukeman Sahid Kamara

## Contact / Author
## Contributors

- Mohamed Sillah
- Abdul Deen Kamara
- Edward Chester Kargbo
- Mohamed Kamara
- Mustapha Sankoh
- Sylvia Ramatu Koroma
- Fatmata Bah

# Github Link
https://github.com/Mohamed-Sillah/Unimak-Campus-Trade.git
