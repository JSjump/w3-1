import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

const providerOptions = {
  /* See Provider Options Section */
}

const web3Modal = new Web3Modal({
  network: 'mainnet', // optional
  cacheProvider: true, // optional
  providerOptions // required
})
