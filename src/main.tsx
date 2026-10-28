import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'Unknown runtime error' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('The Dark House Inn – Application caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('darkhouse_menu_dishes_v3');
      localStorage.removeItem('darkhouse_menu_cart_v1');
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0c0c10',
          color: '#f5f2eb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h1 style={{ color: '#d4af37', fontSize: '22px', margin: '0 0 10px 0', letterSpacing: '0.05em' }}>
            THE DARK HOUSE INN
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '13px', maxWidth: '380px', margin: '0 0 20px 0', lineHeight: 1.6 }}>
            A temporary display issue occurred while preparing the digital menu. Please reload to refresh the dishes.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            style={{
              backgroundColor: '#d4af37',
              color: '#09090b',
              fontWeight: 600,
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              boxShadow: '0 4px 14px rgba(212, 175, 55, 0.3)'
            }}
          >
            Reload Menu
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error('Critical Error: #root container element was not found in DOM.');
}
