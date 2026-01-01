// routes.tsx hoặc AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import { lazy } from 'react';
import { ProtectedRoute, PublicRoute } from '@/components/ProtectedRoute';
import { ErrorFallback } from '@/components/ErrorBoundary';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const BoardsPage = lazy(() => import('@/pages/BoardsPage'));
const BoardDetailPage = lazy(() => import('@/pages/BoardDetailPage'));
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Projects = lazy(() => import('@/pages/Projects'));
const Team = lazy(() => import('@/pages/Team'));

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
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

      {/* Protected routes với MainLayout */}
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
        <Route path="analytics" element={<Analytics />} />
        <Route path="projects" element={<Projects />} />
        <Route path="team" element={<Team />} />
      </Route>
      <Route path="*" element={<ErrorFallback />} />
    </Routes>
  );
}
