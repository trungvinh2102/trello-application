import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '@/components/ProtectedRoute';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const BoardsPage = lazy(() => import('@/pages/BoardsPage'));
const BoardDetailPage = lazy(() => import('@/pages/BoardDetailPage'));
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

export function AppRoutes() {
  return (
    <>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="boards" element={<BoardsPage />} />
        <Route path="boards/:id" element={<BoardDetailPage />} />
      </Route>
    </>
  );
}
