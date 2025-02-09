import React from 'react';

const AnimatedDog = () => {
  return (
    <div className="dog-container" style={{
      position: 'fixed',
      bottom: '0px', // Ajustado para que se vea sobre las montañas
      left: '-30px',
      zIndex: 10, // Aumentado para asegurar que esté por encima de otros elementos
      transform: 'scale(1.2)', // Aumentado el tamaño
      width: '280px', // Tamaño explícito
      height: '200px', // Tamaño explícito
      pointerEvents: 'none' // Para que no interfiera con clicks
    }}>
      <svg
        width="280"
        height="200"
        viewBox="0 0 280 200"
        className="dog"
        style={{
          animation: 'dogMove 8s infinite'
        }}
      >
        {/* Dog body - Colores más brillantes para mejor visibilidad */}
        <ellipse cx="150" cy="130" rx="60" ry="30" fill="#D2691E"/>
        {/* Head */}
        <circle cx="90" cy="120" r="25" fill="#D2691E"/>
        {/* Snout */}
        <ellipse cx="75" cy="125" rx="15" ry="10" fill="#8B4513"/>
        {/* Eyes */}
        <circle cx="85" cy="115" r="4" fill="black"/>
        {/* Ears */}
        <path d="M90 100 Q100 80 110 95" fill="#D2691E" className="ear"/>
        {/* Tail */}
        <path d="M210 120 Q230 100 240 120" fill="#D2691E" className="tail"/>
        {/* Legs */}
        <rect x="120" y="150" width="10" height="20" fill="#D2691E" className="leg front-leg"/>
        <rect x="180" y="150" width="10" height="20" fill="#D2691E" className="leg back-leg"/>
      </svg>
      <style>
        {`
          .dog-container {
            filter: drop-shadow(0 2px 5px rgba(0,0,0,0.2));
          }

          @keyframes dogMove {
            0%, 45% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
            55% {
              transform: translateY(0);
            }
            60% {
              transform: translateX(0);
            }
            70% {
              transform: translateX(100px);
            }
            80% {
              transform: translateX(200px);
            }
            90% {
              transform: translateX(100px);
            }
            100% {
              transform: translateX(0);
            }
          }
          
          .tail {
            transform-origin: 210px 120px;
            animation: tailWag 1s infinite;
          }
          
          @keyframes tailWag {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-20deg); }
          }
          
          .ear {
            transform-origin: 90px 100px;
            animation: earTwitch 2s infinite;
          }
          
          @keyframes earTwitch {
            0%, 90%, 100% { transform: rotate(0deg); }
            95% { transform: rotate(-10deg); }
          }
          
          .leg {
            animation: legMove 0.5s infinite;
          }
          
          @keyframes legMove {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}
      </style>
    </div>
  );
};

export default AnimatedDog;