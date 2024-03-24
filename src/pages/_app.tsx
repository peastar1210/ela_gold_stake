import 'styles/style.scss'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import HeadGlobal from 'components/HeadGlobal'

// Web3Wrapper deps:
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'

import {
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, http } from 'wagmi'
import { customChains } from '../utils/chains'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return (
    <>
      <HeadGlobal />
      <Web3Wrapper>
        <Component key={router.asPath} {...pageProps} />
      </Web3Wrapper>
    </>
  )
}
export default App
const projectId = '1e0fff0d50f6909c173b30d1e576fde7'




const config = getDefaultConfig({
  appName: 'Elastos tip deposit',
  projectId: '4884c8bbb5641e255dd933fcfaae77f9',
  chains: customChains,
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, walletConnectWallet],
    },
  ],
})

// Web3Wrapper
export function Web3Wrapper({ children }) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const queryClient = new QueryClient()
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
