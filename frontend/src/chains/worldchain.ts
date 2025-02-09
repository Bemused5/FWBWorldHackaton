// src/chains/worldchain.ts

import { Chain } from 'viem';

export const worldchain: Chain = {
  id: 480, // Reemplaza con el Chain ID real de WorldChain
  name: 'WorldChain',
  nativeCurrency: {
    name: 'World Coin',
    symbol: 'WLD',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://worldchain-mainnet.g.alchemy.com/public'] },
    public: { http: ['https://worldchain-mainnet.g.alchemy.com/public'] },
  },
  blockExplorers: {
    default: { name: 'World Explorer', url: 'https://explorer.worldchain.com' },
  },
  testnet: false, // Cambia a 'true' si estás en una red de prueba
};
