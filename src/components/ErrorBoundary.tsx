import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            maxWidth: '600px'
          }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
              🚨 Something went wrong
            </h1>
            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
              The Moody app encountered an error. This is likely due to:
            </p>
            <ul style={{ textAlign: 'left', marginBottom: '20px' }}>
              <li>Missing Supabase database setup</li>
              <li>Network connectivity issues</li>
              <li>Configuration problems</li>
            </ul>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '15px',
              borderRadius: '10px',
              margin: '20px 0',
              fontSize: '0.9rem',
              textAlign: 'left'
            }}>
              <strong>Error:</strong> {this.state.error?.message}
            </div>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '15px 30px',
                fontSize: '1.1rem',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              🔄 Reload App
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
