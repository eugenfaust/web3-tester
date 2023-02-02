import { createWebHistory, createRouter } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import WalletView from '../views/WalletView.vue';
import MintNFTView from '../views/MintNFTView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    props: true,
  },
  {
    path: '/wallet/:data',
    name: 'Wallet',
    component: WalletView,
    props: true,
  },
  {
    path: '/buy_nft',
    name: 'Get NFT',
    component: MintNFTView,
    props: true,
  },
];
const base = process.env.NODE_ENV === 'production' ? '/web3-vue3-boilerplate/' : '/';
const router = createRouter({
  history: createWebHistory(base),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
