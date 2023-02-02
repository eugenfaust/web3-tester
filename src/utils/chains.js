// Skip default values for eth and goerli testnets. Let's think that user already have this chains
const chains = [
  {
    id: 1,
    title: 'Ethereum Mainnet',
    icon: '',
    rpcUrls: [''],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    id: 5,
    title: 'Goerli Testnet',
    icon: '',
    rpcUrls: [''],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    id: 97,
    title: 'BSC Testnet',
    icon: '',
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
  },
];

export default chains;
