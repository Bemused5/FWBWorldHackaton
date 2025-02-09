import React, { useState } from "react";
import worldLogo from "../../images/World2.png"; // Ruta del token Worldcoin

interface HistoryScreenProps {
  onBack: () => void;
}

export function HistoryScreen({ onBack }: HistoryScreenProps) {
  const allHistory = [
    { id: "1", user: "0xbe40", choice: "1", amount: "+5.0 WLD", color: "green" },
    { id: "2", user: "0x2b47", choice: "2", amount: "-2.0 WLD", color: "red" },
    { id: "3", user: "0x07b9", choice: "3", amount: "+3.0 WLD", color: "green" },
    { id: "4", user: "0x1bfa", choice: "4", amount: "-1.0 WLD", color: "red" },
  ];

  const myHistory = [
    { id: "1", user: "0xbe40", choice: "1", amount: "+5.0 WLD", color: "green" },
    { id: "2", user: "0x07b9", choice: "3", amount: "+3.0 WLD", color: "green" },
  ];

  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const historyToShow = activeTab === "all" ? allHistory : myHistory;

  return (
    <div style={{ padding: "1rem", width: "95%", margin: "0 auto" }}>
      {/* Back Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
          cursor: "pointer",
        }}
        onClick={onBack}
      >
        <span style={{ fontSize: "1.5rem", marginRight: "1rem" }}>←</span>
        <h2>History</h2>
      </div>

      {/* Tabs for All History and My History */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "1rem" }}>
        <button
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid black",
            backgroundColor: activeTab === "all" ? "#000" : "#fff",
            color: activeTab === "all" ? "#fff" : "#000",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("all")}
        >
          All History
        </button>
        <button
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid black",
            backgroundColor: activeTab === "my" ? "#000" : "#fff",
            color: activeTab === "my" ? "#fff" : "#000",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("my")}
        >
          My History
        </button>
      </div>

      {/* History List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {historyToShow.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              color: item.color,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>
                {item.user} chose {item.choice} and {item.amount}
              </span>
              <img
                src={worldLogo}
                alt="Worldcoin Token"
                style={{
                  width: "16px",
                  height: "16px",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              />
            </div>
            <span style={{ fontSize: "1.5rem", color: "#000" }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
