import React, { Suspense } from "react";
import { usePrioritizedRemotes } from "./hooks/usePrioritizedRemotes";
import RemoteComponent from "./components/RemoteComponent";
import { REMOTES_CONFIG, FRAMEWORK_CONFIG } from "./config/remotesConfig";

// High priority remotes - loaded immediately using React.lazy (build-time remotes)
const Header = React.lazy(() => import("headerApp/Widget"));
const Main = React.lazy(() => import("mainApp/Widget"));

// Main App component - with prioritization framework
function App() {
  // Load remotes with prioritization - ALL CONFIGURATION IN remotesConfig.js
  const { lowPriorityRemotes, allHighPriorityLoaded } = usePrioritizedRemotes({
    remotes: REMOTES_CONFIG,
    ...FRAMEWORK_CONFIG,
  });

  // Find specific remotes
  const footerRemote = lowPriorityRemotes.find(r => r.name === 'footerApp');

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* High Priority: Header - loaded immediately */}
      <Suspense fallback={<div style={{ padding: "1.5em", textAlign: "center" }}>Loading Header...</div>}>
        <Header />
      </Suspense>

      {/* High Priority: Main Content - loaded immediately */}
      <Suspense fallback={<div style={{ padding: "1.5em", textAlign: "center" }}>Loading Main Content...</div>}>
        <Main />
      </Suspense>

      {/* Low Priority: Footer - loaded after high priority remotes */}
      {footerRemote && (
        <RemoteComponent
          Component={footerRemote.Component}
          loading={footerRemote.loading}
          error={footerRemote.error}
          retry={footerRemote.retry}
          name="Footer"
          loadingFallback={
            <div style={{ padding: "1.5em", textAlign: "center", color: "#999" }}>
              {allHighPriorityLoaded
                ? "Loading Footer (Low Priority)..."
                : "Waiting for high-priority content..."}
            </div>
          }
        />
      )}

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          padding: '1em',
          backgroundColor: '#f5f5f5',
          borderTop: '1px solid #ddd',
          fontSize: '0.875em',
          color: '#666'
        }}>
          <strong>Prioritization Framework Debug:</strong>
          <ul style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}>
            <li>High Priority Loaded: {allHighPriorityLoaded ? '✅' : '⏳'}</li>
            <li>Footer Status: {footerRemote?.loading ? '⏳ Loading' : footerRemote?.error ? '❌ Error' : footerRemote?.Component ? '✅ Loaded' : '⏸️ Waiting'}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
