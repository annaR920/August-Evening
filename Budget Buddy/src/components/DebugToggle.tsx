import React from "react";
import { useDebug } from "../contexts/DebugContext";

const DebugToggle: React.FC = () => {
  const { isDebugVisible, toggleDebug } = useDebug();

  return (
    <button
      onClick={toggleDebug}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.3)',
        background: isDebugVisible ? '#ef4444' : '#374151',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'all 0.2s ease',
        zIndex: 1000,
        opacity: 0.85
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '0.85';
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      }}
      title={isDebugVisible ? 'Hide debug tools' : 'Show debug tools'}
    >
      ⚙️
    </button>
  );
};

export default DebugToggle;
