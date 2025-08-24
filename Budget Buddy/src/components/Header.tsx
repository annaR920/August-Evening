import React from "react";

const Header: React.FC = () => {
  return (
    <header
      style={{
        textAlign: "center",
        marginBottom: "24px",
        padding: "24px 0",
      }}
    >
      <h1
        style={{
          margin: "0px",
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
