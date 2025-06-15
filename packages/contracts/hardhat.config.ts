import { config as dotenvConfig } from 'dotenv';
import type { HardhatUserConfig } from 'hardhat/config';

import '@nomicfoundation/hardhat-ethers';
import '@nomicfoundation/hardhat-toolbox';
import '@parity/hardhat-polkadot';
import '@typechain/hardhat';
import '@nomicfoundation/hardhat-chai-matchers';
import '@nomicfoundation/hardhat-foundry';

dotenvConfig();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.28',
  },
  paths: {
    tests: './hardhat-tests',
  },
  resolc: {
    version: '1.5.2',
    compilerSource: 'npm',
  },
  networks: {
    hardhat: {
      polkavm: true,
      nodeConfig: {
        nodeBinaryPath: './binaries/substrate-node',
        rpcPort: 8000,
        dev: true,
      },
      adapterConfig: {
        adapterBinaryPath: './binaries/eth-rpc',
        dev: true,
      },
    },
    localNode: {
      polkavm: true,
      url: 'http://127.0.0.1:8545',
    },
    polkadotHubTestnet: {
      polkavm: true,
      url: 'https://testnet-passet-hub-eth-rpc.polkadot.io',
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default config;
