import React, { Suspense } from "react";
import { usePrioritizedRemotes } from "./hooks/usePrioritizedRemotes";
import RemoteComponent from "./components/RemoteComponent";
import { REMOTES_CONFIG, FRAMEWORK_CONFIG } from "./config/remotesConfig";
import "./App.css";

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
    <div className="app-container">
      {/* High Priority: Header - loaded immediately */}
      <Suspense fallback={<div className="loading-fallback">Loading Header...</div>}>
        <Header />
      </Suspense>

      {/* High Priority: Main Content - loaded immediately */}
      <Suspense fallback={<div className="loading-fallback">Loading Main Content...</div>}>
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
            <div className="loading-fallback-low-priority">
              {allHighPriorityLoaded
                ? "Loading Footer (Low Priority)..."
                : "Waiting for high-priority content..."}
            </div>
          }
        />
      )}

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <strong>Prioritization Framework Debug:</strong>
          <ul>
            <li>High Priority Loaded: {allHighPriorityLoaded ? '✅' : '⏳'}</li>
            <li>Footer Status: {footerRemote?.loading ? '⏳ Loading' : footerRemote?.error ? '❌ Error' : footerRemote?.Component ? '✅ Loaded' : '⏸️ Waiting'}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
