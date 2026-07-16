import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import PublicLayout from "../layouts/PublicLayout";

import Home from "../pages/public/Home";
import Product from "../pages/public/Product";
import ProductDetails from "../pages/public/ProductDetails";
// Cart and Checkout removed to enforce off-system transactions per spec
import Login from "../pages/public/Login";
import ForgotPassword from "../pages/public/ForgotPassword";

import Dashboard from "../pages/admin/Dashboard";
import CreateListing from "../pages/admin/CreateListing";
import EditListing from "../pages/admin/EditListing";
// Orders and Payouts removed: platform is admin-mediated with off-system payments
import Categories from "../pages/admin/Categories";

// Optional 404 page
const NotFound = () => <div>Page not found</div>;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes with PublicLayout (Navbar + Footer) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        {/* Cart/Checkout routes removed (off-system contact only) */}
      </Route>

      {/* Admin routes with ProtectedRoute + AdminLayout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="create-listing" element={<CreateListing />} />
        <Route path="edit-listing/:id" element={<EditListing />} />
        {/* Orders and payouts removed per SRS (handled off-system) */}
        <Route path="categories" element={<Categories />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;