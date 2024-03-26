"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, getDefaultConfig, Chain } from "@rainbow-me/rainbowkit";

const elastosTestChain = {
  id: 21,
  name: 'Elastos Smart Chain Testnet',
  iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_elastos.jpg',
  iconBackground: '#000',
  nativeCurrency: {
    decimals: 18,
    name: 'Elastos',
    symbol: 'tELA',
  },
  rpcUrls: {
    default: {
      http: ['https://api-testnet.elastos.io/eth'],
    },
    public: {
      http: [],
      webSocket: []
    }
  },
  blockExplorers: {
    etherscan: {
      name: 'ElastosChainExplorer',
      url: 'https://esc-testnet.elastos.io',
    },
    default: {
      name: 'Elastos Chain Explorer',
      url: 'https://esc-testnet.elastos.io',
    },
  },
} as const satisfies Chain;

import {
    metaMaskWallet,
    walletConnectWallet,
  } from '@rainbow-me/rainbowkit/wallets'
const config = getDefaultConfig({
  appName: "Elastos tip deposit",
  projectId: "4884c8bbb5641e255dd933fcfaae77f9",
  chains: [elastosTestChain],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, walletConnectWallet],
    },
  ],
});
function Web3Wrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const queryClient = new QueryClient();
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
export default Web3Wrapper