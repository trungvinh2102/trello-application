import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary, ErrorFallback } from './components/ErrorBoundary';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

const MainLayout = lazy(() => import('./layouts/MainLayout'));
const BoardDetailPage = lazy(() => import('./pages/BoardDetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const BoardsPage = lazy(() => import('./pages/BoardsPage'));

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

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
            />
            <Route
              path="/boards"
              element={
                <ProtectedRoute>
                  <BoardsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/boards/:id"
              element={
                <ProtectedRoute>
                  <BoardDetailPage />
                </ProtectedRoute>
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
