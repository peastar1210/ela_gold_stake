import { Chain } from '@rainbow-me/rainbowkit';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

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

