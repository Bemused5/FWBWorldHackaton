import React, { useCallback, useState } from "react";
import { MiniKit, MiniAppWalletAuthSuccessPayload } from "@worldcoin/minikit-js";

interface WalletAuthProps {
  onSuccess: () => void;
}

export const WalletAuth: React.FC<WalletAuthProps> = ({ onSuccess }) => {
  const [walletAuthResponse, setWalletAuthResponse] = useState<MiniAppWalletAuthSuccessPayload | null>(null);
  const [backendNonce, setBackendNonce] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const signInWithWallet = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      setError("MiniKit is not installed. Please install World App to continue.");
      return;
    }

    try {
      const res = await fetch("/api/nonce");
      const { nonce } = await res.json();

      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce,
        requestId: "0",
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
        statement: 'This is my statement and here is a link https://worldcoin.com/apps',
      });

      if (finalPayload.status === "error") {
        setError("Authentication failed. Please try again.");
        return;
      }

      const response = await fetch("/api/complete-siwe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: finalPayload, nonce }),
      });
      const result = await response.json();

      if (result.status === "success" && result.isValid) {
        setWalletAuthResponse(finalPayload);
        setBackendNonce(result.nonce);
        setWalletAddress(result.walletAddress);
        setError(null);

        // Llamada a la función de navegación después de la autenticación exitosa
        onSuccess();
      } else {
        setError("Authentication failed on the backend. Please try again.");
      }
    } catch (err) {
      console.error("Error during WalletAuth process:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  }, [onSuccess]);

  return (
    <div className="flex flex-col items-center w-full px-6 mt-4">
      <button
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#ffffff",
          color: "#000000",
          border: "1px solid #ddd",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "bold",
          width: "90%", // El botón abarca el 90% del ancho
          maxWidth: "400px", // Máximo ancho para pantallas grandes
          textAlign: "center",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onClick={signInWithWallet}
      >
        Log in
      </button>

      {error && (
        <div className="mt-4 text-red-500 text-center">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};
