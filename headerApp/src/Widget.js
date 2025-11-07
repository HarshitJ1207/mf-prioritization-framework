import React from "react";

export default function Widget() {
  return (
    <header
      style={{
        backgroundColor: "#282c34",
        padding: "1.5em",
        color: "white",
        textAlign: "center",
      }}
      data-e2e="HEADER_APP__WIDGET"
    >
      <h1>Header Component</h1>
      <p>This is a federated header component from headerApp</p>
    </header>
  );
}
