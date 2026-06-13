import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      info: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#050816',
          color: '#f8fafc',
          textAlign: 'center'
        }}>
          <div>
            <h1 style={{ margin: 0, marginBottom: 12, color: '#22d3ee' }}>Something went wrong</h1>
            <p style={{ margin: 0, color: '#cbd5e1' }}>
              The mission control interface encountered an error. Refresh the page or return to the landing page.
            </p>
            {this.state.error && (
              <pre style={{ marginTop: 16, color: '#fda4af', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
