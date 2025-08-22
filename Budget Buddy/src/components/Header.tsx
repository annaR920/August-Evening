import React from "react";
import { useDebug } from "../contexts/DebugContext";

const Header: React.FC = () => {
  const { isDebugVisible, toggleDebug } = useDebug();

  return (
    <header style={{
      textAlign: 'center',
      marginBottom: '12px',
      padding: '20px',
      backgroundColor: '#1F2937',
      borderRadius: '16px',
      border: '3px solid #4B5563',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      position: 'relative'
    }}>
      <h1 style={{
        margin: '0px',
        fontSize: '3.5em',
        fontWeight: 800,
        color: '#F9FAFB',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        background: 'linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Budget Buddy
      </h1>
      
      {/* Debug Toggle Button */}
      <button
        onClick={toggleDebug}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '8px 12px',
          fontSize: '12px',
          fontWeight: '600',
          borderRadius: '6px',
          border: 'none',
          background: isDebugVisible ? '#ef4444' : '#6b7280',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}
        title={isDebugVisible ? 'Hide debug tools' : 'Show debug tools'}
      >
        🐛 {isDebugVisible ? 'Hide Debug' : 'Show Debug'}
      </button>
    </header>
  );
};

export default Header;
