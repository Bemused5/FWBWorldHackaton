// src/components/NFTDetailScreen.tsx
import React, { useState } from "react";
import { NFTPurchaseModal, NFT } from "../NFTPurchaseModal";
import { NFTListingModal } from "../NFTListingModal";

const nftData: NFT[] = [
  { id: 1, name: "IDiots #1", price: 0.01 },
  { id: 2, name: "IDiots #2", price: 1200 },
  { id: 3, name: "IDiots #3", price: 1500 },
  { id: 4, name: "IDiots #4", price: 1800 },
];

export function NFTDetailScreen({ onBack }: { onBack: () => void }) {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [modalType, setModalType] = useState<"purchase" | "listing" | null>(null);

  // Al hacer clic en la tarjeta se abre el modal de compra
  const handleOpenPurchaseModal = (nft: NFT) => {
    setSelectedNFT(nft);
    setModalType("purchase");
  };

  // Al hacer clic en "List my NFT" (en la navbar) se abre el modal de listado.
  // En este ejemplo usamos el primer NFT de la lista para simular el caso de venta.
  const handleOpenListingModal = () => {
    setSelectedNFT(nftData[0]);
    setModalType("listing");
  };

  const closeModal = () => {
    setSelectedNFT(null);
    setModalType(null);
  };

  return (
    <div className="flex flex-col bg-black text-white min-h-screen h-screen">
      {/* Barra de navegación */}
      <div className="flex justify-between items-center w-full px-4 py-4 bg-black z-10">
        <button onClick={onBack} className="text-2xl font-bold">
          &larr;
        </button>
        <button
          onClick={handleOpenListingModal}
          className="bg-white text-black font-semibold px-4 py-2 rounded-lg"
        >
          List my NFT 🎉
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col items-center px-6 pb-6">
        {/* Banner */}
        <div className="flex items-center w-11/12 max-w-4xl mb-6">
          <div className="w-3/5 p-6">
            <h1 className="text-3xl font-bold">IDiots</h1>
            <p className="text-lg mt-2">The collection of the IDiots</p>
          </div>
          <div className="w-2/5 flex justify-center items-center p-4">
            <img
              src="https://mausalinas.com/IDiot.png"
              alt="IDiots Collection"
              className="w-32 h-32 object-cover rounded-full"
            />
          </div>
        </div>

        {/* Tarjetas de NFT (sin botones, la tarjeta es clickeable para comprar) */}
        <div className="grid grid-cols-2 gap-4 w-11/12 max-w-4xl">
          {nftData.map((nft) => (
            <div
              key={nft.id}
              onClick={() => handleOpenPurchaseModal(nft)}
              className="bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 cursor-pointer"
            >
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
          ))}
        </div>
      </div>

      {/* Renderizar modales según el tipo seleccionado */}
      {modalType === "purchase" && selectedNFT && (
        <NFTPurchaseModal nft={selectedNFT} onClose={closeModal} />
      )}
      {modalType === "listing" && selectedNFT && (
        <NFTListingModal nft={selectedNFT} onClose={closeModal} />
      )}
    </div>
  );
}
