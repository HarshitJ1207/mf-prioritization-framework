import React from "react";

export default function Widget() {
  return (
    <footer
      style={{
        backgroundColor: "#282c34",
        padding: "1.5em",
        color: "white",
        textAlign: "center",
        marginTop: "2em",
      }}
      data-e2e="FOOTER_APP__WIDGET"
    >
      <p>&copy; 2024 Module Federation Demo. All rights reserved.</p>
      <p>This is a federated footer component from footerApp</p>
    </footer>
  );
}
