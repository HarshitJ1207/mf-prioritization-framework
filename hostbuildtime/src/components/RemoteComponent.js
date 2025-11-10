import React from 'react';

/**
 * Wrapper component for dynamically loaded remote modules
 * Handles loading, error, and retry states
 * 
 * @param {Object} props
 * @param {React.Component} props.Component - The loaded component
 * @param {boolean} props.loading - Loading state
 * @param {Error} props.error - Error object if loading failed
 * @param {Function} props.retry - Retry function
 * @param {string} props.name - Remote name for display
 * @param {React.ReactNode} props.loadingFallback - Custom loading fallback (optional)
 * @param {React.ReactNode} props.errorFallback - Custom error fallback (optional)
 * @param {Object} props.componentProps - Props to pass to the loaded component
 */
const RemoteComponent = ({
  Component,
  loading,
  error,
  retry,
  name,
  loadingFallback,
  errorFallback,
  componentProps = {},
}) => {
  // Loading state
  if (loading) {
    if (loadingFallback) {
      return <>{loadingFallback}</>;
    }
    
    return (
      <div
        style={{
          padding: '1.5em',
          textAlign: 'center',
          color: '#666',
        }}
      >
        Loading {name}...
      </div>
    );
  }

  // Error state
  if (error) {
    if (errorFallback) {
      return <>{errorFallback}</>;
    }
    
    return (
      <div
        style={{
          padding: '1.5em',
          textAlign: 'center',
          color: '#d32f2f',
          backgroundColor: '#ffebee',
          borderRadius: '4px',
          margin: '1em 0',
        }}
      >
        <p>Failed to load {name}</p>
        <p style={{ fontSize: '0.875em', color: '#666' }}>
          {error.message}
        </p>
        <button
          onClick={retry}
          style={{
            marginTop: '1em',
            padding: '0.5em 1em',
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Success state - render the component
  if (Component) {
    return <Component {...componentProps} />;
  }

  // Fallback if component is not loaded yet
  return null;
};

export default RemoteComponent;

