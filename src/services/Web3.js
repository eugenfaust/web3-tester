/* eslint-disable no-undef */
import Web3 from 'web3/dist/web3.min';
// import WalletConnectProvider from '@walletconnect/web3-provider';
// Fix for ReferenceError: global is not defined
import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min';
import FlyNFT from '../abi/FlyNFT.json';
import chains from '../utils/chains';

export default class Web3Service {
  static infuraId = import.meta.env.VITE_INFURA_KEY;

  static nftContract = import.meta.env.VITE_NFT_CONTRACT;

  static abi = FlyNFT.abi;

  // For testing purposes we use Goerli
  static defaultChain = 5;

  static currentProvider = Web3.givenProvider;

  static async buyNFT(account) {
    let nftContract = this.getProvider().eth;
    nftContract = new nftContract.Contract(this.abi, this.nftContract);
    return nftContract.methods.mint().send({ from: account });
  }

  static async setBaseURI(account) {
    let nftContract = this.getProvider().eth;
    nftContract = new nftContract.Contract(this.abi, this.nftContract);
    return nftContract.methods.setNewBaseUri(import.meta.env.VITE_IPFS_BASE_URI).send({ from: account });
  }

  static async getURI(tokenID) {
    let nftContract = this.getProvider().eth;
    nftContract = new nftContract.Contract(this.abi, this.nftContract);
    return nftContract.methods.tokenURI(tokenID).call();
  }

  static async walletConnect() {
    //  Create WalletConnect Provider
    const provider = new WalletConnectProvider({
      infuraId: this.infuraId,
    });
    //  Enable session (triggers QR Code modal)
    await provider.enable();
    //  Create Web3 instance
    this.currentProvider = provider;
    const web3 = this.getProvider();
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  }

  static getProvider(_provider = this.currentProvider) {
    return new Web3(_provider);
  }

  static async getWallet() {
    if (typeof window.ethereum !== 'undefined') {
      let provider = window.ethereum;
      let accounts = await ethereum.request({ method: 'eth_accounts' });

      if (!accounts[0]) {
        provider = new WalletConnectProvider({
          infuraId: this.infuraId,
          qrcode: false,
        });
        await provider.enable();
        accounts = provider.accounts;
      }
      this.currentProvider = provider;
      return accounts[0] ? accounts[0] : '';
    }
    return undefined;
  }

  static getWalletType() {
    if (this.currentProvider.isMetaMask) {
      return 'metamask';
    } if (this.currentProvider.isCoinbaseWallet) {
      return 'coinbase';
    }
    return 'walletconnect';
  }

  static async getChainId() {
    return this.getProvider().eth.getChainId();
  }

  static async changeChain(chainId) {
    const provider = window.ethereum;
    const hexChain = `0x${chainId.toString(16)}`;
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: hexChain,
          },
        ],
      });
      return true;
    } catch (switchError) {
      if (switchError.code === 4001) {
        return true;
      }
      const chain = chains.find((el) => el.id === chainId);
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: hexChain,
              chainName: chain.title,
              rpcUrls: chain.rpcUrls,
              nativeCurrency: chain.nativeCurrency,
            },
          ],
        });
        return true;
      } catch (error) {
        return error.message;
      }
    }
  }

  static onChainChange(callback) {
    this.currentProvider.on('chainChanged', callback);
  }

  static onAccountChange(callback) {
    this.currentProvider.on('accountsChanged', callback);
  }

  static async connectWallet(walletType = 'metamask') {
    if (walletType === 'injected') {
      return this.getWallet();
    }
    if (typeof window.ethereum !== 'undefined') {
      if (walletType === 'walletconnect') {
        return this.walletConnect();
      }
      let provider = window.ethereum;
      if (walletType !== 'injected') {
        if (
          !(provider.isMetaMask && walletType === 'metamask')
          && !(provider.isCoinbaseWallet && walletType === 'coinbase')
        ) {
          provider = undefined;
        }
        // edge case if MM and CBW are both installed
        if (window.ethereum.providers?.length) {
          window.ethereum.providers.forEach(async (p) => {
            if (p.isMetaMask && walletType === 'metamask') provider = p;
            else if (p.isCoinbaseWallet && walletType === 'coinbase') {
              provider = p;
            }
          });
        }
      }

      if (provider === undefined) {
        return undefined;
      }
      const account = (
        await provider.request({ method: 'eth_requestAccounts' })
      )[0];
      this.currentProvider = provider;
      this.changeChain(this.defaultChain);
      return account;
    }
    return undefined;
  }

  static async balanceOf(account) {
    let nftContract = this.getProvider().eth;
    nftContract = new nftContract.Contract(this.abi, this.nftContract);
    return nftContract.methods.balanceOf(account).call();
  }

  static async getBalance(account) {
    const balance = await ethereum.request({
      method: 'eth_getBalance',
      params: [account, 'latest'],
    });
    return Web3.utils.fromWei(balance, 'ether');
  }
}
