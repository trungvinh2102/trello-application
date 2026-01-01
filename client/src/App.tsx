import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary, ErrorFallback } from './components/ErrorBoundary';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import Dashboard from './pages/Dashboard';

const MainLayout = lazy(() => import('./layouts/MainLayout'));
const BoardDetailPage = lazy(() => import('./pages/BoardDetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const BoardsPage = lazy(() => import('./pages/BoardsPage'));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
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
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
              children={
                <>
                  <Route index element={<Dashboard />} />
                  <Route path="boards" element={<BoardsPage />} />
                  <Route path="boards/:id" element={<BoardDetailPage />} />
                </>
              }
            />
            <Route path="*" element={<ErrorFallback />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
