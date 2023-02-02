<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';
import Web3 from '../services/Web3';

export default {
  setup() {
    const toast = useToast();
    const tokenID = localStorage.getItem('tokenID') || 1;
    return { toast, tokenID };
  },
  data() {
    return {
      nftImg: undefined,
    };
  },
  methods: {
    async searchPicture() {
      try {
        // TODO: add ipfs request
        // const result = await Web3.getURI(this.tokenID);
        // const response = await axios.get(result);
        // this.nftImg = 'https://www.linkpicture.com/q/cat1.jpg';
        const result = await Web3.getURI(this.tokenID);
        console.log(result);
        const ipfsUrl = `https://nft.scriptscamp.space/ipfs/${result.substring(7)}`;
        const response = await (await fetch(ipfsUrl)).json();
        console.log(response);
        const imageUrl = `https://nft.scriptscamp.space/ipfs/${response.image.substring(7)}`;
        this.nftImg = imageUrl;
        this.toast.info(`Trying to load: ${imageUrl}`);
      } catch (error) {
        this.nftImg = undefined;
        this.toast.error(error.message);
      }
    },
    async saveToStorage() {
      console.log(await Web3.balanceOf(this.$store.state.address));
    },

  },
};
</script>
<template>
  <div
    class="hero min-h-screen"
    style="background-image: url(https://placeimg.com/1000/800/arch)"
  >
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-center text-neutral-content flex flex-col">
      <div class="form-control bg-base-200 rounded-xl p-5">
        <label class="label">
          <span class="label-text">Enter tokenID and get picture</span>
        </label>
        <div class="input-group">
          <input
            type="text"
            placeholder="tokenID"
            v-model="tokenID"
            class="input input-bordered text-accent"
            @keyup.enter="searchPicture"
          />
          <button class="btn btn-square" @click="saveToStorage">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      <Transition>
        <img
          v-if="nftImg"
          :src="nftImg"
          :key="nftImg"
          class="card w-96 h-96 bg-base-100 shadow-xl p-1"
        />
      </Transition>
    </div>
  </div>
</template>
<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
