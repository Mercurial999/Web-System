import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import DeliveriesPage from "../pages/deliveries/DeliveriesPage";
import InventoryPage from "../pages/inventory/InventoryPage";
import CustomersPage from "../pages/customers/CustomersPage";
import Login from "../pages/auth/Login";
import ReportsPage from "../pages/reports/ReportsPage";
import RolesPage from "../pages/roles/RolesPage";
import UsersPage from "../pages/users/UsersPage";
import ProductsPage from "../pages/products/ProductsPage";

import ProtectedRoutes from "./ProtectedRoutes";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="deliveries" element={<DeliveriesPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;