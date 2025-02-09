// CreateCollectionScreen.tsx
import React, { useState, useEffect } from "react";
import { MiniKit, Tokens, PayCommandInput } from "@worldcoin/minikit-js";
import { ethers } from "ethers";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { createPublicClient, http } from "viem";

interface CreateCollectionScreenProps {
  onBack: () => void;
}

const COLLECTION_CONTRACT_ADDRESS = "0xYourCollectionContractAddress"; // Reemplaza por la dirección real de tu contrato
// Supongamos que el contrato tiene la función createCollection:
// function createCollection(string name, string description, uint256 royaltyFee) external payable
const COLLECTION_ABI = [
  "function createCollection(string name, string description, uint256 royaltyFee) external payable"
];
const WLD_DECIMALS = 18;
const CREATION_FEE = "10"; // La cuota es de 10 WLD

export function CreateCollectionScreen({ onBack }: CreateCollectionScreenProps) {
  const [collectionName, setCollectionName] = useState<string>("");
  const [collectionDescription, setCollectionDescription] = useState<string>("");
  const [royaltyFee, setRoyaltyFee] = useState<string>(""); // Por ejemplo, "2" para 2 WLD o el valor que determines
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>("");

  // Configurar el cliente viem para monitorear la transacción
  const client = createPublicClient({
    chain: {
      id: 480,
      name: "WorldChain",
      network: "worldchain",
      nativeCurrency: {
        name: "World Token",
        symbol: "WLD",
        decimals: WLD_DECIMALS,
      },
      rpcUrls: { default: { http: ["https://worldchain-mainnet.g.alchemy.com/public"] } },
    },
    transport: http("https://worldchain-mainnet.g.alchemy.com/public"),
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    client: client,
    appConfig: { app_id: "app_fd0fec76ef856ec2d805a4f8717dca94" }, // Reemplaza por tu app_id
    transactionId: transactionId,
  });

  useEffect(() => {
    if (isConfirmed) {
      setStatusMessage("Transacción confirmada. Colección creada con éxito.");
      setIsProcessing(false);
    }
  }, [isConfirmed]);

  const handleCreateCollection = async () => {
    if (!MiniKit.isInstalled()) {
      setStatusMessage("World App no está instalada.");
      return;
    }
    if (!collectionName || !collectionDescription || !royaltyFee) {
      setStatusMessage("Por favor completa todos los campos.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("Iniciando pago de cuota de creación de colección...");

    try {
      // 1. Iniciar el pago para la cuota de 10 WLD
      const res = await fetch("/api/initiate-payment", {
        method: "POST",
        credentials: "include",
      });
      const { id } = await res.json();
      console.log("Payment reference:", id);

      // Convertir 10 WLD a Wei (sin comisión adicional en este caso)
      const feeAmountWei = ethers.parseUnits(CREATION_FEE, WLD_DECIMALS);

      const payloadPayment: PayCommandInput = {
        reference: id,
        to: COLLECTION_CONTRACT_ADDRESS,
        tokens: [{ symbol: Tokens.WLD, token_amount: feeAmountWei.toString() }],
        description: "Collection creation fee of 10 WLD",
      };

      const paymentResponse = await MiniKit.commandsAsync.pay(payloadPayment);
      console.log("paymentResponse =>", paymentResponse);
      if (!paymentResponse) {
        setStatusMessage("Pago fallido o cancelado.");
        setIsProcessing(false);
        return;
      }
      setStatusMessage("Pago confirmado. Procesando creación de colección...");

      // 2. Confirmar el pago en el backend
      const confirmRes = await fetch(`/api/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ payload: paymentResponse }),
      });
      const confirmData = await confirmRes.json();
      if (!confirmData || !confirmData.success) {
        setStatusMessage("Confirmación de pago fallida.");
        setIsProcessing(false);
        return;
      }

      // 3. Llamar al smart contract para crear la colección
      const iface = new ethers.Interface(COLLECTION_ABI);
      const data = iface.encodeFunctionData("createCollection", [
        collectionName,
        collectionDescription,
        ethers.parseUnits(royaltyFee, WLD_DECIMALS),
      ]);
      // Se envía el valor de 10 WLD en la transacción (convertido a hexadecimal)
      const valueWeiHex = ethers.parseUnits(CREATION_FEE, WLD_DECIMALS).toString(16);

      const txPayload = {
        transaction: [
          {
            reference: "collectionCreation_" + Date.now(),
            address: COLLECTION_CONTRACT_ADDRESS,
            abi: COLLECTION_ABI,
            functionName: "createCollection",
            args: [collectionName, collectionDescription, ethers.parseUnits(royaltyFee, WLD_DECIMALS)],
            value: valueWeiHex,
            chain_id: 480,
          },
        ],
      };

      setStatusMessage("Enviando transacción a World App...");
      const resp = await MiniKit.commandsAsync.sendTransaction(txPayload);
      console.log("sendTransaction response =>", resp);
      if (!resp?.finalPayload) {
        setStatusMessage("Transacción cancelada o fallida.");
        setIsProcessing(false);
        return;
      }
      if (resp.finalPayload.status === "error") {
        setStatusMessage("Error al enviar la transacción.");
        setIsProcessing(false);
        return;
      }
      setTransactionId(resp.finalPayload.transaction_id);
      setStatusMessage("Transacción enviada. Esperando confirmación...");
    } catch (error) {
      console.error("Error en handleCreateCollection =>", error);
      setStatusMessage("Error en creación de colección: " + String(error));
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="text-xl font-bold mb-6 flex items-center"
      >
        &larr; Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Create Collection</h1>

      {/* Collection name */}
      <label className="w-full text-lg font-semibold text-white mb-2">
        Collection name:
      </label>
      <input
        type="text"
        className="w-full p-2 mb-4 text-black rounded"
        placeholder="Enter collection name"
        value={collectionName}
        onChange={(e) => setCollectionName(e.target.value)}
      />

      {/* Description */}
      <label className="w-full text-lg font-semibold text-white mb-2">
        Description:
      </label>
      <textarea
        className="w-full p-2 mb-4 text-black rounded"
        placeholder="Enter description"
        value={collectionDescription}
        onChange={(e) => setCollectionDescription(e.target.value)}
      />

      {/* Upload images */}
      <label className="w-full text-lg font-semibold text-white mb-2">
        Upload images:
      </label>
      <button className="w-full p-4 bg-white rounded flex items-center justify-center mb-4">
        <img
          src="https://mausalinas.com/upload.png"
          alt="Upload icon"
          className="w-10 h-10"
        />
      </button>

      {/* Royalty fee */}
      <label className="w-full text-lg font-semibold text-white mb-2">
        Royalty fee:
      </label>
      <input
        type="number"
        className="w-full p-2 mb-6 text-black rounded"
        placeholder="Enter royalty fee"
        value={royaltyFee}
        onChange={(e) => setRoyaltyFee(e.target.value)}
      />

      {/* Botón para crear colección */}
      <button
        onClick={handleCreateCollection}
        className="bg-white text-black font-bold py-3 px-8 rounded-lg w-3/4 max-w-md mx-auto"
        disabled={isProcessing}
      >
        {isProcessing ? "Procesando..." : "Create collection"}
      </button>

      {statusMessage && (
        <div className="mt-4 text-center text-yellow-300">{statusMessage}</div>
      )}

      {isConfirming && (
        <div className="mt-4 text-center bg-gray-800 text-white px-4 py-2 rounded">
          Confirmando transacción...
        </div>
      )}

      {isConfirmed && (
        <div className="mt-4 text-center bg-green-600 text-white px-4 py-2 rounded">
          Transacción confirmada exitosamente.
        </div>
      )}
    </div>
  );
}
