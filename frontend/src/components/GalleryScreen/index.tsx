import React, { useState } from "react";
import { NFTDetailScreen } from "../NFTDetailScreen";

export function GalleryScreen() {
  const [showDetailScreen, setShowDetailScreen] = useState(false);

  const handleNavigateToDetail = () => {
    setShowDetailScreen(true);
  };

  const handleBackToGallery = () => {
    setShowDetailScreen(false);
  };

  if (showDetailScreen) {
    return <NFTDetailScreen onBack={handleBackToGallery} />;
  }

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-6">
      {/* Banner */}
      <div className="flex items-center bg-white text-black rounded-xl w-11/12 max-w-4xl mb-6 shadow-lg">
        <div className="w-3/5 p-6">
          <h1 className="text-3xl font-bold">IDiots</h1>
          <p className="text-lg mt-2">The collection of the IDiots</p>
        </div>
        <div className="w-2/5 flex justify-center items-center p-4">
          <img
            src="https://mausalinas.com/IDiot.png"
            alt="IDiots Collection"
            className="w-32 h-32 object-cover rounded-full shadow-md"
          />
        </div>
      </div>

      {/* Encabezado de la tabla */}
      <div className="flex items-center w-11/12 max-w-4xl text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
        <span>#</span>
        <span>Collection</span>
        <span>FP</span>
      </div>

      {/* Fila de la tabla como botón */}
      <button
        onClick={handleNavigateToDetail}
        className="flex justify-between items-center w-11/12 max-w-4xl mb-4 p-4 rounded-lg "
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">1.</span>
          <img
            src="https://mausalinas.com/IDiot.png"
            alt="IDiot"
            className="w-12 h-12 object-cover rounded-lg"
          />
          <span className="text-lg">IDiots</span>
        </div>
        <span className="text-lg font-bold">0.01</span>
      </button>
    </div>
  );
}
