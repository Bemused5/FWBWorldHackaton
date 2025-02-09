// app/page.tsx (o la ruta correspondiente a tu componente PayApp)
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti-boom";
import CloudBackground from "../CloudBackground";
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import { createPublicClient, http } from 'viem';

import worldLogo from "../../images/World2.png";
import DiceGameContractABI from "../../abis/DiceGameContract.json";
// Importamos desde MiniKit
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";
// Importamos "ethers" para codificar la llamada a placeBet
import { ethers } from "ethers";

// Contrato y ABI
const DICE_CONTRACT_ADDRESS = "0x7C5900ee8833b48bD8b731E529c86eC3EFa787D5";
const TOKEN_CONTRACT_ADDRESS = "0x2cFc85d8E48F8EAB294be644d9E25C3030863003";

// ABI mínima para "placeBet(uint8)"
const DiceGameABI = [
  "function placeBet(uint8 playerGuess) external payable"
];

const WLD_DECIMALS = 18; 

const diceNumbers = [1, 2, 3, 4, 5, 6];
const betAmounts = [0.001,0.1, 0.2, 0.5, 1, 5];

const feeRate = 0.02; // 2% de comisión

const renderDiceDots = (number: number, color = "black") => {
  const dotStyle = {
    backgroundColor: color === "yellow-700" ? "#b45309" : color,
  };

  return (
    <div className="grid grid-cols-3 grid-rows-3 h-full w-full p-2">
      {/* Renderizado de puntos según el número del dado */}
      {/* ... (tu lógica existente para renderizar puntos) */}
      {number === 1 && (
        <div className="col-start-2 col-end-3 row-start-2 row-end-3">
          <div className="w-full h-full rounded-full" style={dotStyle}></div>
        </div>
      )}
      {/* ... (otros casos para 2-6) */}
      {number === 6 && (
        <>
          <div className="col-start-1 col-end-2 row-start-1 row-end-2">
            <div className="w-full h-full rounded-full" style={dotStyle}></div>
          </div>
          <div className="col-start-3 col-end-4 row-start-1 row-end-2">
            <div className="w-full h-full rounded-full" style={dotStyle}></div>
          </div>
          <div className="col-start-1 col-end-2 row-start-2 row-end-3">
            <div className="w-full h-full rounded-full" style={dotStyle}></div>
          </div>
          <div className="col-start-3 col-end-4 row-start-2 row-end-3">
            <div className="w-full h-full rounded-full" style={dotStyle}></div>
          </div>
          <div className="col-start-1 col-end-2 row-start-3 row-end-4">
            <div className="w-full h-full rounded-full" style={dotStyle}></div>
          </div>
          <div className="col-start-3 col-end-4 row-start-3 row-end-4">
            <div className="w-full h-full rounded-full" style={dotStyle}></div>
          </div>
        </>
      )}
    </div>
  );
};

const TitleDice = ({ number }: { number: number }) => {
  return (
    <div 
      className="w-8 h-8 bg-yellow-500 rounded-lg border-2 border-yellow-600 animate-spin-slow"
      style={{
        animation: 'spin 8s linear infinite'
      }}
    >
      {renderDiceDots(number, "yellow-700")}
    </div>
  );
};

/** 
 * Función que inicia el pago => /api/initiate-payment => MiniKit
 */
const sendPayment = async (betAmount: number) => {
  try {
    const res = await fetch("/api/initiate-payment", {
      method: "POST",
      credentials: "include", 
    });
    const { id } = await res.json();
    console.log("Payment reference:", id);

    // Cálculo preciso usando BigNumber
    const betAmountWei = ethers.parseUnits(String(betAmount), WLD_DECIMALS);
    const feeWei = (betAmountWei * BigInt(Math.floor(feeRate * 100))) / BigInt(10000);
    const totalToPayWei = betAmountWei + feeWei;

    const payload: PayCommandInput = {
      reference: id,
      to: DICE_CONTRACT_ADDRESS,
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: totalToPayWei.toString(),
        },
      ],
      description: "Dice bet + 2% fee",
    };

    if (MiniKit.isInstalled()) {
      console.log("MiniKit is installed, calling pay...");
      const paymentResponse = await MiniKit.commandsAsync.pay(payload);
      console.log("paymentResponse =>", paymentResponse);
      return paymentResponse;
    } else {
      console.warn("MiniKit is not installed, cannot pay.");
      return null;
    }
  } catch (error) {
    console.log("Error sending payment", error);
    return null;
  }
};

const confirmPayment = async (finalPayload: any) => {
  try {
    console.log("Calling confirm-payment with finalPayload =>", finalPayload);

    const res = await fetch(`/api/confirm-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ payload: finalPayload }),
    });
    const data = await res.json();
    console.log("confirmPayment response =>", data);
    return data;
  } catch (error) {
    console.error("Error confirming payment:", error);
    return null;
  }
};

export const PayApp = ({ onShowInfo }: { onShowInfo: () => void }) => {
  const [selectedDice, setSelectedDice] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0.1);
  const [currentDice, setCurrentDice] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const [transactionId, setTransactionId] = useState<string>('');

  // Configurar el cliente de Viem
  const client = createPublicClient({
    chain: {
      id: 480, // ID de tu cadena
      name: 'WorldChain',
      network: 'worldchain',
      nativeCurrency: {
        name: 'World Token',
        symbol: 'WLD',
        decimals: WLD_DECIMALS,
      },
      rpcUrls: {
        default: { http: ['https://worldchain-mainnet.g.alchemy.com/public'] },
      },
    },
    transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
  });

  // Configurar el hook para esperar la confirmación de la transacción
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    client: client,
    appConfig: {
      app_id: 'app_fd0fec76ef856ec2d805a4f8717dca94', // Reemplaza con tu app_id
    },
    transactionId: transactionId,
  });

  // Efecto para manejar la confirmación de la transacción
  useEffect(() => {
    if (isConfirmed) {
      setStatusMessage("Transacción confirmada. ¡Rodamos el dado!");
      rollDice();
      setIsRolling(false);
    }
  }, [isConfirmed]);

  const handleDiceClick = (number: number) => {
    setSelectedDice(number);
  };

  const handleBetChange = (increment: boolean) => {
    const currentIndex = betAmounts.indexOf(betAmount);
    const newIndex = increment
      ? Math.min(currentIndex + 1, betAmounts.length - 1)
      : Math.max(currentIndex - 1, 0);
    setBetAmount(betAmounts[newIndex]);
  };

  const handleBet = async () => {
    if (!selectedDice || isRolling) return;

    if (!MiniKit.isInstalled()) {
      console.error("MiniKit is not installed on World App");
      setStatusMessage("World App no está instalada.");
      return;
    }

    setIsRolling(true);
    setStatusMessage("Iniciando pago...");

    try {
      // 1) Iniciar el pago
      const paymentResponse = await sendPayment(betAmount);
      if (!paymentResponse) {
        setStatusMessage("Pago fallido o cancelado.");
        setIsRolling(false);
        return;
      }

      setStatusMessage("Pago confirmado. Procesando apuesta...");

      // 2) Confirmar el pago en el backend
      const confirmResponse = await confirmPayment(paymentResponse);
      if (!confirmResponse || !confirmResponse.success) {
        setStatusMessage("Confirmación de pago fallida.");
        setIsRolling(false);
        return;
      }

      // 3) Proceder con la apuesta en el contrato inteligente
      const iface = new ethers.Interface(DiceGameABI);
      const data = iface.encodeFunctionData("placeBet", [selectedDice]);

      const valueWei = ethers.parseEther(String(betAmount)).toString(16);

      const payload = {
        transaction: [{
          reference: "diceBet_" + Date.now(),
          address: DICE_CONTRACT_ADDRESS,
          abi: DiceGameABI,
          functionName: "placeBet",
          args: [selectedDice],
          value: valueWei,
          chain_id: 480, // ajusta según tu red
        }]
      };

      setStatusMessage("Enviando transacción a World App...");
      const resp = await MiniKit.commandsAsync.sendTransaction(payload);
      console.log("sendTransaction response =>", resp);

      if (!resp?.finalPayload) {
        console.warn("Usuario canceló o la transacción falló en World App");
        setStatusMessage("Transacción cancelada o fallida.");
        setIsRolling(false);
        return;
      }

      // Verificar si hubo un error en el payload
      if (resp.finalPayload.status === 'error') {
        console.error('Error sending transaction', resp.finalPayload);
        setStatusMessage("Error al enviar la transacción.");
        setIsRolling(false);
        return;
      }

      // Si la transacción fue enviada correctamente, guarda el transactionId para monitorear
      setTransactionId(resp.finalPayload.transaction_id);
      setStatusMessage("Transacción enviada. Esperando confirmación...");

    } catch (error) {
      console.error("Error en handleBet =>", error);
      setStatusMessage("Error en apuesta: " + String(error));
      setIsRolling(false);
    }
  };

  const rollDice = () => {
    let counter = 0;
    const randomNumber = Math.floor(Math.random() * 6) + 1;

    const interval = setInterval(() => {
      setCurrentDice((prev) => (prev === 6 ? 1 : prev + 1));
      counter++;
      if (counter === 20) {
        clearInterval(interval);
        setCurrentDice(randomNumber);
        setIsRolling(false);

        if (selectedDice === randomNumber) {
          setIsWinner(true);
          setStatusMessage("¡Ganaste!!!");
        } else {
          setStatusMessage("Perdiste, sigue intentando.");
        }
      }
    }, 100);
  };

  const resetGame = () => {
    setSelectedDice(null);
    setIsWinner(false);
    setStatusMessage("");
  };

  return (
    <div className="pay-app flex flex-col items-center gap-y-3 w-full max-w-md mx-auto px-4 relative">
      <CloudBackground />

      <div className="flex items-center justify-center gap-x-3 relative w-full z-20">
        <h1 className="text-3xl font-bold italic">DICE ROLL</h1>
      </div>

      {statusMessage && (
        <div className="text-sm text-yellow-300">{statusMessage}</div>
      )}

      <div
        className="dice-animation flex items-center justify-center rounded-lg relative z-20"
        style={{
          width: "150px",
          height: "150px",
          backgroundColor: "white",
          border: "2px solid black",
          transform: isRolling ? "scale(1.2)" : "scale(1)",
          opacity: isRolling ? 0.8 : 1,
          transition: "transform 0.1s ease, opacity 0.1s ease",
        }}
      >
        {renderDiceDots(currentDice)}
      </div>

      {isWinner && (
        <div className="winner-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-30">
          <Confetti
            mode="boom"
            particleCount={50}
            effectCount={Infinity}
            effectInterval={1000}
            colors={["#00FF00", "#1E90FF", "#FFD700", "#FF1493"]}
            x={0.5}
            y={0.1}
            spreadDeg={360}
            deg={270}
          />
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-yellow-500">
              ¡Felicidades!
            </h1>
            <p className="text-2xl text-white mt-3">
              Ganaste {(betAmount * 2).toFixed(2)} WLD 🎉
            </p>
            <button
              onClick={resetGame}
              className="mt-12 mb-10 bg-green-500 text-white px-6 py-3 rounded-lg"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      <div className="relative z-20 w-full">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center",
            gap: "0.5rem",
            cursor: "pointer",
            fontSize: "0.9rem",
            color: "#FFFFFF",
          }}
          onClick={onShowInfo}
        >
          ⓘ Processed with World Chain
        </div>

        <h1 className="text-2xl font-bold w-[95%] text-center italic">
          Select your favorite number
        </h1>
        <div className="dice-grid grid grid-cols-3 gap-3 w-[95%] mx-auto">
          {diceNumbers.map((num) => (
            <div
              key={num}
              onClick={() => handleDiceClick(num)}
              className={`dice aspect-square flex items-center justify-center rounded-md border cursor-pointer ${
                selectedDice === num ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              {renderDiceDots(num)}
            </div>
          ))}
        </div>

        <div className="bet-controls w-[95%] mx-auto flex items-center justify-between mt-4 z-20">
          <div className="flex flex-col items-start w-[70%]">
            <h3 className="text-lg font-bold">Select the amount to bet (WLD)</h3>
            <div className="flex items-center gap-x-3">
              <button
                onClick={() => handleBetChange(false)}
                className="bg-green-500 text-white p-2 rounded-full flex items-center justify-center w-10 h-10"
              >
                -
              </button>
              <span className="text-lg font-bold">
                {betAmount} WLD
              </span>
              <button
                onClick={() => handleBetChange(true)}
                className="bg-green-500 text-white p-2 rounded-full flex items-center justify-center w-10 h-10"
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={handleBet}
            className={`bet-button px-5 py-2 rounded-lg w-[28%] ${
              selectedDice && !isRolling
                ? "bg-green-500 text-white"
                : "bg-gray-500 text-gray-300"
            }`}
            disabled={!selectedDice || isRolling}
          >
            {isRolling ? "Procesando..." : `BET ${betAmount} 🪙`}
          </button>
        </div>
      </div>

      {/* Indicadores de confirmación de la transacción */}
      {isConfirming && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded">
          Confirmando transacción...
        </div>
      )}
      {isConfirmed && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded">
          Transacción confirmada exitosamente.
        </div>
      )}
    </div>
  );
};
