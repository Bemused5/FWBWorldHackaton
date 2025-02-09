// backend/src/initiate-payment.ts
import { RequestHandler } from "express";
import crypto from "crypto";

export const initiatePaymentHandler: RequestHandler = (_req, res) => {
  const uuid = crypto.randomUUID().replace(/-/g, "");

  // TODO: Almacena la referencia (uuid) en tu DB, o en una cookie para que luego puedas compararlo
  res.cookie("payment-nonce", uuid, { httpOnly: true });

  console.log("Generated reference (nonce):", uuid);
  res.json({ id: uuid });
};
