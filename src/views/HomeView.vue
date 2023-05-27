<script>
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
      abiField: '',
      isAbiCorrect: true,
      abi: {},
      abiMethods: [],
      selectedMethod: '',
      selectedFunction: {},
      inputArgs: [],
      isExecuting: false,
      executeResponse: '',
      contractAddress: '',
    };
  },
  watch: {
    abiField(newAbi) {
      try {
        let abi = JSON.parse(newAbi);
        abi = typeof abi.abi === 'undefined' ? abi : abi.abi;
        this.abi = abi;
        this.abiMethods = this.abi.filter(
          (value) => value.type === 'function',
        );
        this.isAbiCorrect = true;
      } catch (error) {
        this.abi = {};
        this.abiMethods = [];
        this.isAbiCorrect = false;
      }
    },
    selectedMethod(method) {
      this.selectedFunction = this.abiMethods.find(
        (value) => value.name === method,
      );
      this.inputArgs = this.selectedFunction.inputs.map((el) => ({
        name: el.name,
        value: '',
      }));
    },
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
    selectedArgs() {
      return this.selectedFunction.inputs;
    },
  },
  methods: {
    openConnectModal() {
      this.$store.commit('setConnectModal', true);
    },
    putArgument(e) {
      const arg = this.inputArgs.find((el) => el.name === e.target.id);
      if (arg) {
        arg.value = e.target.value;
      } else {
        this.inputArgs.push({ name: e.target.id, value: e.target.value });
      }
    },
    async execute() {
      if (typeof this.address === 'undefined') {
        this.openConnectModal();
        return;
      }
      this.isExecuting = true;
      try {
        const args = this.inputArgs.map((el) => el.value);
        const resp = await Web3.executeFunction(
          this.$store.state.address,
          this.contractAddress,
          this.selectedFunction,
          args,
          this.abi,
        );
        this.executeResponse = JSON.stringify(resp);
      } catch (error) {
        this.executeResponse = error.message;
      } finally {
        this.isExecuting = false;
      }
    },
  },
};
</script>
<template>
  <div class="min-h-screen w-full flex flex-row justify-between">
    <div class="text-center flex flex-col bg-base-200 w-full">
      <div class="flex justify-between gap-10">
        <div class="ml-2 flex justify-start flex-col w-2/4">
          <div class="flex flex-col gap-1">
            <div class="form-control w-full ">
              <label class="label">
                <span class="label-text">Contract address</span>
              </label>
              <input
                type="text"
                placeholder="0x...."
                v-model="contractAddress"
                class="input input-bordered w-full"
              />
            </div>
          </div>
          <div class="flex flex-col">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Put your ABI</span>
              </label>
              <textarea
                class="textarea textarea-bordered h-36 leading-3 w-full"
                :class="{
                  'textarea-error': !isAbiCorrect,
                  'textarea-success': isAbiCorrect,
                }"
                placeholder="ABI"
                v-model="abiField"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="flex flex-col mr-2 gap-2 w-2/3">
          <span class="text-sm mt-2">Function arguments</span>
          <div
            class="flex gap-2 items-center justify-between"
            v-for="argument in selectedFunction.inputs"
            :key="argument.name"
          >
            <span class="w-1/3 text-start">{{ argument.name }}</span>
            <input
              :id="argument.name"
              type="text"
              :placeholder="argument.type"
              @change="putArgument"
              class="input input-bordered max-w-xs w-2/3"
            />
          </div>
        </div>
      </div>

      <button
        class="btn mt-2 mr-2 btn-primary max-w-xs self-end w-32"
        :class="{
          'loading': isExecuting,
        }"
        :disabled="isExecuting"
        @click="execute"
      >
        Execute
      </button>
      <div class="divider">Response</div>
      <textarea
        class="textarea textarea-bordered h-full w-full"
        placeholder="Contract response"
        v-model="executeResponse"
      ></textarea>
    </div>
    <div class="form-control w-1/3">
      <label class="label"
        ><span class="label-text"
          >Function type: {{ selectedFunction.stateMutability }}</span
        >
      </label>
      <select
        class="select w-full max-w-xs h-screen"
        v-model="selectedMethod"
        size="1000"
      >
        <option v-for="func in abiMethods" :key="func.name" :value="func.name">
          {{
            `${func.name}(${func.inputs.map((val) => {
              return val.name;
            })})`
          }}
        </option>
      </select>
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
