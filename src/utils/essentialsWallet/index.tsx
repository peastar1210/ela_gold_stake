import { WalletConnectParameters } from 'wagmi/connectors';
import { RainbowKitProvider, connectorsForWallets, getDefaultConfig, Wallet, getWalletConnectConnector  } from '@rainbow-me/rainbowkit'
import { Connector, CreateConnectorFn } from 'wagmi';
export interface MyWalletOptions {
    projectId: string,
  }
export type RainbowKitWalletConnectParameters = Omit<WalletConnectParameters, 'showQrModal' | 'projectId'> & { chainId: number };

export const essentialsWallet = ({ projectId }: MyWalletOptions): Wallet => ({
    id: "20",
    name: 'Essentials',
    iconUrl: 'https://play-lh.googleusercontent.com/QSgd6SI2OdBoRavOZan6TmM7a5KDknEbRFrXRZeGdpRDj18YCd_DaCvbf6uZVIuuew=w240-h480-rw',
    iconBackground: '#0c2f78',
    downloadUrls: {
      android: 'https://play.google.com/store/apps/details?id=org.elastos.essentials.app',
      ios: 'https://apps.apple.com/us/app/elastos-essentials/id1568931743',
    },
    mobile: {
      getUri: (uri: string) => uri,
    },
    qrCode: {
      getUri: (uri: string) => uri,
      instructions: {
        learnMoreUrl: 'https://essentials-docs.trinity-tech.io/other-features/scanner',
        steps: [
          {
            description:
              'We recommend putting My Wallet on your home screen for faster access to your wallet.',
            step: 'install',
            title: 'Essentials wallet for Android.',
          },
          {
            description:
              'After you scan, a connection prompt will appear for you to connect your wallet.',
            step: 'install',
            title: 'Essentials wallet for ios.',
          },
        ],
      },
    },
    extension: {
      instructions: {
        learnMoreUrl: 'https://my-wallet/learn-more',
        steps: [
          {
            description:
              'We recommend pinning My Wallet to your taskbar for quicker access to your wallet.',
            step: 'install',
            title: 'Install the My Wallet extension',
          },
          {
            description:
              'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
            step: 'create',
            title: 'Create or Import a Wallet',
          },
          {
            description:
              'Once you set up your wallet, click below to refresh the browser and load up the extension.',
            step: 'refresh',
            title: 'Refresh your browser',
          },
        ],
      },
    },
    createConnector: getWalletConnectConnector({ projectId }),
  });
