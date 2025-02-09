import { RequestHandler } from "express";
import crypto from "crypto";

export const generateNonceHandler: RequestHandler = (req, res) => {
  // Generar un nonce único y seguro
  const nonce = crypto.randomUUID().replace(/-/g, "");

  // Guardarlo en cookie para verificar más tarde
  res.cookie("siwe-nonce", nonce, { httpOnly: true, secure: true });

  // Devolver el nonce generado
  res.json({ nonce });
};
