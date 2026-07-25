import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgb(var(--lux-white))',
                color: 'rgb(var(--lux-charcoal))',
                border: '1px solid rgb(var(--lux-border))',
                boxShadow: 'var(--shadow-card)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: 'rgb(var(--lux-green))', secondary: '#FFFFFF' },
              },
              error: {
                iconTheme: { primary: 'rgb(var(--lux-red))', secondary: '#FFFFFF' },
              },
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
