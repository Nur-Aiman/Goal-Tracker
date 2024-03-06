import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomeButton() {
  let navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <button
      onClick={navigateToHome}
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#00ADB5',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        animation: 'float 2s ease-in-out infinite',
      }}
      aria-label="Home"
    >
      <i className="fa fa-home"></i>
    </button>
  );
}

export default HomeButton;
