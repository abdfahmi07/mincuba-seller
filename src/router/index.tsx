import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";

import ProtectedRoute from "./ProtectedRoutes";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import FeatureLayout from "@/layouts/FeatureLayout";

const HomePage = lazy(() => import("@/pages/Home/HomePage"));
const LoginPage = lazy(() => import("@/pages/Auth/Login/LoginPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFound/NotFoundPage"));
const ProductsPage = lazy(() => import("@/pages/Products/ProductsPage"));
const CreateProductPage = lazy(
  () => import("@/pages/Products/CreateProductPage")
);
const EditProductPage = lazy(() => import("@/pages/Products/EditProductPage"));
const OrdersPage = lazy(() => import("@/pages/Orders/OrdersPage"));
const StorePage = lazy(() => import("@/pages/Store/StorePage"));
const EditStorePage = lazy(() => import("@/pages/Store/EditStorePage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
        ],
      },
    ],
  },
  {
    path: "/store",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout title="Toko Saya" />,
        children: [
          {
            index: true,
            element: <StorePage />,
          },
        ],
      },
      {
        element: <MainLayout title="Edit Toko" />,
        children: [
          {
            path: "edit",
            element: <EditStorePage />,
          },
        ],
      },
    ],
  },
  {
    path: "/products",
    element: <FeatureLayout title="Produk" isIcon={true} />,
    children: [
      {
        index: true,
        element: <ProductsPage />,
      },
    ],
  },
  {
    path: "/products/create",
    element: <FeatureLayout title="Tambah Produk" />,
    children: [
      {
        index: true,
        element: <CreateProductPage />,
      },
    ],
  },
  {
    path: "/products/edit/:productId",
    element: <FeatureLayout title="Edit Produk" />,
    children: [
      {
        index: true,
        element: <EditProductPage />,
      },
    ],
  },
  {
    path: "/orders",
    element: <FeatureLayout title="Pesanan" bgColor="#ededed" />,
    children: [
      {
        index: true,
        element: <OrdersPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },

  {
    path: "/login",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
