import { RequestHandler } from "express";
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from "@worldcoin/minikit-js";

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload;
  nonce: string;
}

export const completeSiweHandler: RequestHandler = async (req, res) => {
  try {
    const { payload, nonce } = req.body as IRequestPayload;
    const storedNonce = req.cookies["siwe-nonce"];

    // Validar que el nonce coincida con el que guardamos en cookies
    if (!storedNonce || nonce !== storedNonce) {
      res.status(400).json({
        status: "error",
        isValid: false,
        message: "Invalid or missing nonce",
      });
      return;
    }

    // Verificar el mensaje SIWE
    const validMessage = await verifySiweMessage(payload, nonce);

    if (validMessage.isValid) {
      // Devolver la dirección y el nonce (si quieres)
      res.json({
        status: "success",
        isValid: true,
        walletAddress: payload.address, // Correctamente enviada
        nonce: storedNonce,
      });
      return;
    } else {
      res.status(400).json({
        status: "error",
        isValid: false,
        message: "Invalid SIWE message",
      });
      return;
    }
  } catch (error: any) {
    console.error("Error in complete-siwe:", error);
    res.status(500).json({
      status: "error",
      isValid: false,
      message: error.message || "Internal server error",
    });
  }
};
