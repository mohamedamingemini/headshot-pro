
import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { Analytics } from '@vercel/analytics/react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Defined explicit interfaces for Props and State.
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Fixed ErrorBoundary inheritance and initialization by using explicit property declarations and imports to resolve 'props' and 'state' visibility issues.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicitly declared state to satisfy TypeScript strict property checks in class components.
  public state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  // Static method must return ErrorBoundaryState and is part of the standard React Error Boundary API.
  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    // Accessing this.state and this.props from inherited React.Component.
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#ff6b6b', fontFamily: 'sans-serif', background: '#0f172a', minHeight: '100vh' }}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error?.message}</p>
          <pre style={{ background: '#1e293b', padding: '10px', borderRadius: '4px', overflow: 'auto', marginTop: '10px' }}>
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '20px', padding: '10px 20px', background: '#6366f1', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <App />
        <Analytics />
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
