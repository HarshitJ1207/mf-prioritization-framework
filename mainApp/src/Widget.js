import React from "react";

export default function Widget() {
  return (
    <main
      style={{
        flex: 1,
        padding: "2em",
        backgroundColor: "#f5f5f5",
      }}
      data-e2e="MAIN_APP__WIDGET"
    >
      <h1>Dynamic System Host - MF-Webpack</h1>
      <p>This is the main content area loaded from mainApp.</p>
      <p>
        This host application demonstrates Module Federation by loading:
      </p>
      <ul>
        <li>Header component from headerApp (port 3001)</li>
        <li>Main content from mainApp (port 3003)</li>
        <li>Footer component from footerApp (port 3002)</li>
      </ul>
      <div style={{ marginTop: "2em", padding: "1em", backgroundColor: "white", borderRadius: "4px" }}>
        <h2>About Module Federation</h2>
        <p>
          Webpack Module Federation allows multiple separate builds to form a single application.
          These separate builds act like containers and can expose and consume code between builds,
          creating a single, unified application.
        </p>
      </div>
    </main>
  );
}

