// ./components/InfoScreen.tsx
import React from "react";
import { FaArrowLeft } from "react-icons/fa"; // Importar el icono de la flecha desde react-icons

interface InfoScreenProps {
  onBack: () => void;
}

export const InfoScreen: React.FC<InfoScreenProps> = ({ onBack }) => {
  return (
    <div
      className="info-screen flex flex-col bg-white rounded-lg shadow-lg w-11/12 max-w-2xl mx-auto mt-[5%] mb-[15%] relative"
      style={{ height: "80vh" }} // Limita la altura total del contenedor
    >
      {/* Contenedor de la flecha que permanece fijo */}
      <div
        className="sticky top-0 bg-white z-10 flex items-center px-4 py-2"
        style={{
          borderBottom: "1px solid #e5e5e5", // Línea divisoria debajo de la flecha
        }}
      >
        <button
          onClick={onBack}
          className="text-gray-700 hover:text-gray-900 focus:outline-none flex items-center"
          aria-label="Regresar"
        >
          <FaArrowLeft size={24} className="mr-2" /> {/* Icono de la flecha */}
          <span className="text-lg font-semibold">Back</span> {/* Texto opcional */}
        </button>
      </div>

      {/* Contenedor de texto desplazable */}
      <div
        className="overflow-y-auto px-6 pb-6 w-full mt-4"
        style={{
          wordWrap: "break-word", // Permite ajuste de palabras largas
          overflowWrap: "break-word",
        }}
      >
        <h1 className="text-3xl font-bold mb-4 break-words">
          What is Dice Roll (DR)?
        </h1>
        <p className="mb-4 break-words">
          DR is a smart contract that allows users to play a dice game with
          their Worldcoin. The game uses a six-sided die with numbers from 1 to
          6, where players can guess a number before rolling and win the double
          they bet. Odds are designed to be fair, with a 2% fee ensuring the
          platform's sustainability.
        </p>

        <h2 className="text-2xl font-semibold mb-2 break-words">
          How do I know I can trust DR?
        </h2>
        <p className="mb-4 break-words">
          DR is the most trusted dice game platform on Worldcoin. All
          transactions are tracked on-chain and can be audited by anyone. The
          platform ensures transparency and fairness with a 98% return rate
          (RTP) for players, calculated using the following contract logic.
        </p>

        <h2 className="text-2xl font-semibold mb-2 break-words">
          "Return to Player" (RTP)
        </h2>
        <p className="mb-4 break-words">
          The outcome of each game is determined by a smart contract function
          that uses blockchain data to generate a random result. Here’s the
          code:
        </p>

        <pre className="bg-gray-100 p-4 rounded-md w-full overflow-x-auto mb-4 break-words">
          <code>
            {`function _determineOutcome(uint8 playerGuess) internal view returns (bool) {
    bytes32 randomHash = keccak256(
        abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            address(this)
        )
    );

    uint256 randomNumber = uint256(randomHash) % 101; // Generates a number from 0 to 100

    if (randomNumber >= 98) {
        return false; // House edge: automatic loss
    }

    uint256 diceRoll = (randomNumber % 6) + 1; // Maps the number to a dice roll (1-6)

    return playerGuess == diceRoll; // Player wins if their guess matches the dice roll
}`}
          </code>
        </pre>

        <h2 className="text-2xl font-semibold mb-2 break-words">
          House Edge
        </h2>
        <p className="mb-4 break-words">
          The 2% house edge is implemented by reserving numbers 98, 99, and 100
          in the random number generation as automatic losses for the player.
          This ensures fairness while maintaining the platform's sustainability.
        </p>

        <h2 className="text-2xl font-semibold mb-2 break-words">
          Return Rate Calculation
        </h2>
        <p className="mb-4 break-words">
          Considering the house edge, the return rate (RTP) is calculated as
          98%. This means that for every 100 units wagered, players can expect
          to receive back 98 units on average.
        </p>

        <h2 className="text-2xl font-semibold mb-2 break-words">Fairness</h2>
        <p className="mb-4 break-words">
          The dice roll generates random outcomes using blockchain data. The
          platform ensures a 98% return rate while maintaining a transparent and
          auditable process.
        </p>

        <h2 className="text-2xl font-semibold mb-2 break-words">Conclusion</h2>
        <p className="mb-4 break-words">
          DR provides a transparent and fair dice game experience, ensuring that
          players enjoy the game with confidence. The platform's on-chain logic
          guarantees fairness and sustainability.
        </p>
      </div>
    </div>
  );
};
