import { Chain } from '@rainbow-me/rainbowkit';
import { _chains } from '@rainbow-me/rainbowkit/dist/config/getDefaultConfig';

const elastosChain: Chain = {
  id: 20,
  name: 'Elastos Smart Chain',
  iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_elastos.jpg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Elastos',
    symbol: 'ELA',
  },
  rpcUrls: {
    default: {
      http: ['https://api.elastos.io/esc'],
    },
    public: { // Add the 'public' property as required by the type definition
      http: ['https://public-api.elastos.io/esc'],
    }
  },
  blockExplorers: {
    default: {
      name: 'Elastos Chain Explorer',
      url: 'https://eth.elastos.io/',
    },
  },
  // network: 'Elastos'
};

const elastosTestChain: Chain = {
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
}

export const customChains: _chains = [
  // elastosChain,
  elastosTestChain
];