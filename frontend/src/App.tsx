import React, { useState } from "react";
import { PayApp } from "./components/PayApp";
import { HistoryScreen } from "./components/HistoryScreen";
import { InfoScreen } from "./components/InfoScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { UserProfileScreen } from "./components/UserProfileScreen";
import { CreateCollectionScreen } from "./components/CreateCollectionScreen";
import { FaHome, FaUser } from "react-icons/fa";
import { GalleryScreen } from "./components/GalleryScreen";

export default function App() {
  // Estado para manejar la pantalla actual
  const [screen, setScreen] = useState<
    "home" | "profile" | "history" | "info" | "createCollection"
  >("home");

  // Estado para manejar la autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <style>
        {`
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            background-color: black;
          }
          main {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            height: 100%;
            position: relative;
            padding-bottom: 80px;
          }
          .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 70px;
            background-color: #000;
            border-top: 1px solid #333;
            display: flex;
            justify-content: space-around;
            align-items: center;
            z-index: 10;
          }
          .nav-button {
            background: none;
            border: none;
            color: #fff;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12px;
          }
          .nav-button svg {
            font-size: 24px;
          }
        `}
      </style>

      <main>
        {/* Pantallas condicionales */}
        {screen === "home" && <GalleryScreen />}
        {screen === "profile" && (
          isAuthenticated ? (
            <UserProfileScreen onCreateCollection={() => setScreen("createCollection")} />
          ) : (
            <ProfileScreen onNavigate={() => setIsAuthenticated(true)} />
          )
        )}
        {screen === "createCollection" && (
          <CreateCollectionScreen onBack={() => setScreen("profile")} />
        )}
        {screen === "history" && <HistoryScreen onBack={() => setScreen("home")} />}
        {screen === "info" && <InfoScreen onBack={() => setScreen("home")} />}
      </main>

      {/* Barra de navegación inferior */}
      <nav className="bottom-nav">
        <button onClick={() => setScreen("home")} className="nav-button" aria-label="Home">
          <FaHome />
          <span>Home</span>
        </button>
        <button onClick={() => setScreen("profile")} className="nav-button" aria-label="Profile">
          <FaUser />
          <span>Profile</span>
        </button>
      </nav>
    </>
  );
}
