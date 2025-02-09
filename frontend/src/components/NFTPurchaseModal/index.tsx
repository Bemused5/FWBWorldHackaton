// NFTPurchaseModal.tsx
import React from "react";
import { MiniKit, Tokens, PayCommandInput } from "@worldcoin/minikit-js";
import { ethers } from "ethers";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { createPublicClient, http } from "viem";

export interface NFT {
  id: number;
  name: string;
  price: number;
}

interface NFTPurchaseModalProps {
  nft: NFT;
  onClose: () => void;
}

const NFT_CONTRACT_ADDRESS = "0xYourNFTContractAddress"; // Reemplaza por la dirección real de tu contrato
const NFT_ABI = ["function buyNFT(uint256 nftId) external payable"];
const WLD_DECIMALS = 18;
const feeRate = 0.02; // 2% de comisión

export function NFTPurchaseModal({ nft, onClose }: NFTPurchaseModalProps) {
  const [statusMessage, setStatusMessage] = React.useState<string>("");
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [transactionId, setTransactionId] = React.useState<string>("");

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

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      client: client,
      appConfig: { app_id: "app_fd0fec76ef856ec2d805a4f8717dca94" }, // Reemplaza por tu app_id
      transactionId: transactionId,
    });

  React.useEffect(() => {
    if (isConfirmed) {
      setStatusMessage("Transacción confirmada. NFT comprado con éxito.");
      setIsProcessing(false);
    }
  }, [isConfirmed]);

  const sendPaymentNFT = async (price: number) => {
    try {
      const res = await fetch("/api/initiate-payment", {
        method: "POST",
        credentials: "include",
      });
      const { id } = await res.json();
      console.log("Payment reference:", id);

      // Convertir el precio a Wei (18 decimales) y sumar el fee
      const priceWei = ethers.parseUnits(String(price), WLD_DECIMALS);
      const feeWei = (priceWei * BigInt(Math.floor(feeRate * 100))) / BigInt(10000);
      const totalToPayWei = priceWei + feeWei;

      const payload: PayCommandInput = {
        reference: id,
        to: NFT_CONTRACT_ADDRESS,
        tokens: [{ symbol: Tokens.WLD, token_amount: totalToPayWei.toString() }],
        description: "NFT Purchase + 2% fee",
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
      console.error("Error sending payment", error);
      return null;
    }
  };

  const confirmPaymentNFT = async (finalPayload: any) => {
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

  const handleBuy = async () => {
    if (!MiniKit.isInstalled()) {
      setStatusMessage("World App no está instalada.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("Iniciando pago...");

    try {
      // 1) Iniciar el pago
      const paymentResponse = await sendPaymentNFT(nft.price);
      if (!paymentResponse) {
        setStatusMessage("Pago fallido o cancelado.");
        setIsProcessing(false);
        return;
      }
      setStatusMessage("Pago confirmado. Procesando compra...");

      // 2) Confirmar el pago en el backend
      const confirmResponse = await confirmPaymentNFT(paymentResponse);
      if (!confirmResponse || !confirmResponse.success) {
        setStatusMessage("Confirmación de pago fallida.");
        setIsProcessing(false);
        return;
      }

      // 3) Llamar al smart contract para comprar el NFT
      const iface = new ethers.Interface(NFT_ABI);
      const data = iface.encodeFunctionData("buyNFT", [nft.id]);
      const valueWei = ethers.parseUnits(String(nft.price), WLD_DECIMALS).toString(16);

      const payload = {
        transaction: [
          {
            reference: "nftPurchase_" + Date.now(),
            address: NFT_CONTRACT_ADDRESS,
            abi: NFT_ABI,
            functionName: "buyNFT",
            args: [nft.id],
            value: valueWei,
            chain_id: 480,
          },
        ],
      };

      setStatusMessage("Enviando transacción a World App...");
      const resp = await MiniKit.commandsAsync.sendTransaction(payload);
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
      console.error("Error en handleBuy =>", error);
      setStatusMessage("Error en compra: " + String(error));
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20"
      onClick={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <div className="bg-gray-900 text-white w-11/12 max-w-3xl rounded-lg p-6 flex">
        {/* Lado izquierdo (40%) */}
        <div className="w-2/5 flex flex-col items-center">
          <img
            src="https://mausalinas.com/IDiot.png"
            alt={nft.name}
            className="w-full h-40 object-cover rounded-md mb-2"
          />
          <h3 className="text-xl font-bold">{nft.name}</h3>
          <div className="flex items-center mt-2">
            <span className="text-lg font-bold mr-2">{nft.price}</span>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-D66YFOUDV_RBt4-UK-sNf9yL-MucGKkP1g&s"
              alt="World Coin"
              className="w-5 h-5"
            />
          </div>
        </div>
        {/* Lado derecho (60%) */}
        <div className="w-3/5 flex flex-col justify-center items-center px-6">
          <p className="text-lg font-semibold mb-4 text-center">
            ¿Estás seguro de comprar este NFT?
          </p>
          <button
            onClick={handleBuy}
            disabled={isProcessing}
            className="bg-white text-black font-bold py-2 px-6 rounded-lg"
          >
            {isProcessing ? "Procesando..." : "Buy"}
          </button>
          {statusMessage && (
            <div className="text-center text-sm text-yellow-300 mt-2">
              {statusMessage}
            </div>
          )}
          {isConfirming && (
            <div className="mt-2 text-center bg-gray-800 text-white px-4 py-2 rounded">
              Confirmando transacción...
            </div>
          )}
          {isConfirmed && (
            <div className="mt-2 text-center bg-green-600 text-white px-4 py-2 rounded">
              Transacción confirmada exitosamente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
