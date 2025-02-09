import React from "react";

interface UserProfileScreenProps {
  onCreateCollection: () => void;
}

export function UserProfileScreen({ onCreateCollection }: UserProfileScreenProps) {
  return (
    <div className="flex flex-col items-center bg-black text-white min-h-screen">
      {/* Banner */}
      <div className="relative w-full h-56 bg-gray-800">
        {/* Imagen de fondo (banner) */}
        <img
          src="https://mausalinas.com/banner.png"
          alt="User Banner"
          className="w-full h-full object-cover"
        />

        {/* Botón Update Banner */}
        <button className="absolute bottom-2 right-4 bg-white text-black font-semibold px-4 py-2 rounded-lg">
          Update banner
        </button>

        {/* Imagen de perfil */}
        <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-full bg-blue-400 border-4 border-black">
          <img
            src="https://mausalinas.com/profile.png"
            alt="User Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      {/* Nombre de usuario y botón editar */}
      <div className="flex items-center mt-16 space-x-4">
        <h1 className="text-2xl font-bold">Bemused</h1>
        <button className="bg-gray-700 p-2 rounded-full">
          <span className="text-white text-lg">✏️</span>
        </button>
      </div>

      {/* Tarjeta y botón Crear Colección */}
      <div className="flex justify-around w-11/12 max-w-4xl mt-8 space-x-6">
        {/* Tarjeta de colección */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-1/2">
          <img
            src="https://mausalinas.com/IDiot.png"
            alt="IDiot Collection"
            className="w-full h-40 object-cover rounded-md mb-2"
          />
          <h3 className="text-xl font-bold">IDiots</h3>
          <div className="flex items-center mt-2">
            <span className="text-lg font-bold mr-2">1000 FP</span>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-D66YFOUDV_RBt4-UK-sNf9yL-MucGKkP1g&s"
              alt="World Coin"
              className="w-5 h-5"
            />
          </div>
        </div>

        {/* Botón Crear Colección */}
        <button
          className="bg-white text-black font-bold py-4 px-6 rounded-lg shadow-lg w-1/2"
          onClick={onCreateCollection}
        >
          Create collection
        </button>
      </div>
    </div>
  );
}
