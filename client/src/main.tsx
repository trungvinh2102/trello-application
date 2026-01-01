import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import App from './App';
import './index.css';
import './lib/i18n';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class">
        <App />
        <Toaster />
      </ThemeProvider>
    </StrictMode>
  );
}
