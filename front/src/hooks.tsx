/**
 * 是否安装钱包，钱包链接处理  未安装 引导安装
 *  */
export const useInitialCheck = () => {
  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
  }
  return isMetaMaskInstalled()
}
