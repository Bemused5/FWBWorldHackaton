import React from "react";
import worldLogo from "../../images/World2.png";

interface TXhistoryProps {
  onNavigate: () => void;
}

export function TXhistory({ onNavigate }: TXhistoryProps) {
  return (
    <div
      style={{
        width: "auto", // Ajusta el ancho al contenido
        maxWidth: "250px", // Ancho máximo para evitar que sea demasiado grande
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "0.5rem",
        cursor: "pointer",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        display: "inline-block", // Ajuste automático al contenido
      }}
      onClick={onNavigate}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
        <span>0xgaly chose 1 and +0.1</span>
        <img
          src={worldLogo}
          alt="World Logo"
          style={{
            width: "16px",
            height: "16px",
            display: "inline-block",
            verticalAlign: "middle",
          }}
        />
      </div>
    </div>
  );
}
