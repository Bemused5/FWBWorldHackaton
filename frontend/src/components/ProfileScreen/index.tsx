import React, { useState } from "react";
import { WalletAuth } from "../WalletAuth";

export function ProfileScreen({ onNavigate }: { onNavigate: () => void }) {
  const images = [
    "https://mausalinas.com/image1.jpg",
    "https://mausalinas.com/image2.jpg",
    "https://mausalinas.com/image3.jpg",
    "https://mausalinas.com/image4.jpg",
    "https://mausalinas.com/image5.jpg",
    "https://mausalinas.com/image6.jpg",
  ];

  return (
    <div className="flex flex-col items-center bg-black min-h-screen">
      {/* Área de imágenes sin espacio hacia arriba */}
      <div className="grid grid-cols-3 gap-0 w-full">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`NFT ${index + 1}`}
            className="w-full h-40 object-cover"
          />
        ))}
      </div>

      {/* Texto debajo de las imágenes */}
      <p className="text-white text-lg text-center mt-6 mb-6">
        Log in with your wallet to see all your NFTs
      </p>

      {/* Componente WalletAuth */}
      <WalletAuth onSuccess={onNavigate} />
    </div>
  );
}
