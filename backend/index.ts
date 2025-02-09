import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { verifyHandler } from "./src/verify";
import { initiatePaymentHandler } from "./src/initiate-payment";
import { confirmPaymentHandler } from "./src/confirm-payment";
import { generateNonceHandler } from "./src/nonce-handler";
import { completeSiweHandler } from "./src/complete-siwe";

const app = express();

// trust the proxy to allow HTTPS protocol to be detected
app.set("trust proxy", true);

app.use(cors({
  origin: 'https://lionfish-integral-ocelot.ngrok-free.app', // Reemplaza con el dominio de tu frontend
  credentials: true, // Permite el envío de cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Middleware de cookies

// request logger middleware
app.use((req, _res, next) => {
  console.log(`logger: ${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/api", (req, res) => {
  res.send({ message: "API is working!" });
});

app.get("/ping", (_, res) => {
  res.send("minikit-example pong v1");
});

app.get("/nonce", generateNonceHandler);
app.post("/complete-siwe", completeSiweHandler);
app.post("/verify", verifyHandler);
app.post("/initiate-payment", initiatePaymentHandler);
app.post("/confirm-payment", confirmPaymentHandler);

const port = 3000; // use env var
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
