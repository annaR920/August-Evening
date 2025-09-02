import React from "react";

const Header: React.FC = () => {
  return (
    <header
      style={{
        textAlign: "center",
        marginBottom: "15px",
        marginTop: "0",
        padding: "0, 0",
      }}
    >
      <h1
        style={{
          margin: "0",
          fontSize: "4.0em",
          fontWeight: 700,
          color: "#00bcd4",
          letterSpacing: "0.05em",
          textTransform: "none",
        }}
      >
        Budget Buddy
      </h1>
    </header>
  );
};

export default Header;
