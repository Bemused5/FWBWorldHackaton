import React from 'react';

const CloudBackground = () => {
  return (
    <div className="clouds-container absolute inset-0 overflow-hidden pointer-events-none z-10">
      <style>
        {`
          @keyframes float {
            0% { transform: translateX(-100%) translateY(0); }
            100% { transform: translateX(100vw) translateY(0); }
          }
          
          .cloud {
            position: absolute;
            background: white;
            border-radius: 100px;
            opacity: 0.8;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          
          .cloud::before,
          .cloud::after {
            content: '';
            position: absolute;
            background: inherit;
            border-radius: 50%;
          }
          
          .cloud-1 {
            width: 100px;
            height: 40px;
            top: 5%;
            animation: float 15s linear infinite;
          }
          
          .cloud-1::before {
            width: 50px;
            height: 50px;
            top: -20px;
            left: 15px;
          }
          
          .cloud-1::after {
            width: 40px;
            height: 40px;
            top: -15px;
            left: 45px;
          }
          
          .cloud-2 {
            width: 120px;
            height: 45px;
            top: 15%;
            animation: float 20s linear infinite;
            animation-delay: -5s;
          }
          
          .cloud-2::before {
            width: 60px;
            height: 60px;
            top: -25px;
            left: 20px;
          }
          
          .cloud-2::after {
            width: 45px;
            height: 45px;
            top: -18px;
            left: 55px;
          }
          
          .cloud-3 {
            width: 80px;
            height: 35px;
            top: 25%;
            animation: float 18s linear infinite;
            animation-delay: -10s;
          }
          
          .cloud-3::before {
            width: 45px;
            height: 45px;
            top: -18px;
            left: 12px;
          }
          
          .cloud-3::after {
            width: 35px;
            height: 35px;
            top: -14px;
            left: 38px;
          }
        `}
      </style>
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      <div className="cloud cloud-3"></div>
    </div>
  );
};

export default CloudBackground;