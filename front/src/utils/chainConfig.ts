import MyTokenAddrGro from '../../../deployments/localhost/MyToken.json'

import VaultAddrGro from '../../../deployments/localhost/Vault.json'

import MyTokenAddrBscTest from '../../../deployments/bscTest/MyToken.json'

import VaultAddrBscTest from '../../../deployments/bscTest/Vault.json'

function address(tokenAddress: string, vaultAddress: string) {
  return {
    MyTokenAddr: tokenAddress,
    VaultAddr: vaultAddress
  }
}

export default {
  5: address(MyTokenAddrGro?.address, VaultAddrGro.address),
  97: address(MyTokenAddrBscTest?.address, VaultAddrBscTest.address)
}
