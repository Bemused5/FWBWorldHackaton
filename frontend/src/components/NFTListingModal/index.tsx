// src/components/NFTListingModal.tsx
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

interface NFTListingModalProps {
  nft: NFT;
  onClose: () => void;
}

const NFT_CONTRACT_ADDRESS = "0xYourNFTContractAddress"; // Reemplaza por la dirección real de tu contrato
// Suponemos que el contrato tiene una función listNFT(uint256 nftId, uint256 listingPrice)
const NFT_LISTING_ABI = ["function listNFT(uint256 nftId, uint256 listingPrice) external"];
const WLD_DECIMALS = 18;

export function NFTListingModal({ nft, onClose }: NFTListingModalProps) {
  // Inicialmente se usa el precio del NFT (pero luego se puede cambiar)
  const [listingPrice, setListingPrice] = React.useState<string>(nft.price.toString());
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
      appConfig: { app_id: "app_fd0fec76ef856ec2d805a4f8717dca94" },
      transactionId: transactionId,
    });

  React.useEffect(() => {
    if (isConfirmed) {
      setStatusMessage("Transacción confirmada. NFT listado con éxito.");
      setIsProcessing(false);
    }
  }, [isConfirmed]);

  const handleList = async () => {
    if (!MiniKit.isInstalled()) {
      setStatusMessage("World App no está instalada.");
      return;
    }
    setIsProcessing(true);
    setStatusMessage("Enviando solicitud de listado...");

    try {
      // Preparar la transacción para llamar al smart contract (valor 0 en la transferencia)
      const iface = new ethers.Interface(NFT_LISTING_ABI);
      const data = iface.encodeFunctionData("listNFT", [
        nft.id,
        ethers.parseUnits(listingPrice, WLD_DECIMALS),
      ]);
      const valueHex = "0x0"; // No se transfiere valor

      const payload = {
        transaction: [
          {
            reference: "nftListing_" + Date.now(),
            address: NFT_CONTRACT_ADDRESS,
            abi: NFT_LISTING_ABI,
            functionName: "listNFT",
            args: [nft.id, ethers.parseUnits(listingPrice, WLD_DECIMALS)],
            value: valueHex,
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
      console.error("Error en handleList =>", error);
      setStatusMessage("Error en listado: " + String(error));
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
            Ingresa el precio al que deseas listar el NFT:
          </p>
          <div className="flex items-center w-full mb-4">
            <input
              type="number"
              value={listingPrice}
              onChange={(e) => setListingPrice(e.target.value)}
              className="w-full p-2 text-black rounded"
            />
            <button
              onClick={() => setListingPrice("0.01")}
              className="ml-2 bg-gray-700 text-white px-3 py-1 rounded"
            >
              FP
            </button>
          </div>
          <p className="text-sm mb-4">
            Nota: En la venta se cobrará un 2% de comisión.
          </p>
          <button
            onClick={handleList}
            disabled={isProcessing}
            className="bg-white text-black font-bold py-2 px-6 rounded-lg"
          >
            {isProcessing ? "Procesando..." : "List NFT"}
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
