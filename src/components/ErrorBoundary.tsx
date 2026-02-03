import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          fontFamily: 'system-ui, sans-serif',
          maxWidth: '800px',
          margin: '50px auto',
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '20px' }}>
            Something went wrong
          </h1>
          <details style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
              Error Details
            </summary>
            <div style={{ marginTop: '10px' }}>
              <strong>Error:</strong>
              <pre style={{ background: '#fff', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
                {this.state.error?.toString()}
              </pre>
              {this.state.errorInfo && (
                <>
                  <strong style={{ display: 'block', marginTop: '15px' }}>Stack Trace:</strong>
                  <pre style={{ background: '#fff', padding: '10px', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                </>
              )}
            </div>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

