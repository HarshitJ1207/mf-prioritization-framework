import React, { Suspense } from "react";

// Import remotes using React.lazy for static remotes
const Header = React.lazy(() => import("headerApp/Widget"));
const Main = React.lazy(() => import("mainApp/Widget"));
const Footer = React.lazy(() => import("footerApp/Widget"));

// Main App component - with header, main, and footer always loaded
function App() {
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
      <Suspense fallback={<div style={{ padding: "1.5em", textAlign: "center" }}>Loading Header...</div>}>
        <Header />
      </Suspense>

      <Suspense fallback={<div style={{ padding: "1.5em", textAlign: "center" }}>Loading Main Content...</div>}>
        <Main />
      </Suspense>

      <Suspense fallback={<div style={{ padding: "1.5em", textAlign: "center" }}>Loading Footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
