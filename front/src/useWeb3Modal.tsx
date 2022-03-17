import React, { useCallback, useEffect, useState } from 'react'
import { Row, Col, Input, Button, Modal } from 'antd'

import MetaMaskOnboarding from '@metamask/onboarding'

import { ethers } from 'ethers'

const ONBOARD_TEXT = '浏览器未安装metamask.点击安装'
const CONNECT_TEXT = '链接'
const CONNECTED_TEXT = '已链接'

/**
 * 只是基于 metamask 的一种引导安装钱包的解决方案
 */
export default function useWeb3Modal() {
  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT)
  const [btnIsDisabled, setDisabled] = React.useState(false)
  const [accounts, setAccounts] = React.useState([])
  const onboarding = React.useRef<MetaMaskOnboarding>()
  const [address, setAddress] = useState<string>()

  //   provider， signer 处理
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>()
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()

  // 初始化 provider,singner
  async function initProviderOrSigner() {
    const tempProvider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(tempProvider)
    setSigner(tempProvider.getSigner())
  }

  useEffect(() => {
    if (!onboarding?.current) {
      onboarding.current = new MetaMaskOnboarding()
    }
  }, [])

  // 账号切换 重新获取 provider和signer
  useEffect(() => {
    if (address) {
      //防止地址为空时的一次重复init
      initProviderOrSigner()
    }
  }, [address])

  useEffect(() => {
    //   是否已安装钱包
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      // 是否已经链接账号
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT)
        setDisabled(true)
        onboarding?.current?.stopOnboarding()
      } else {
        setButtonText(CONNECT_TEXT)
        setDisabled(false)
      }
    }
  }, [accounts])

  //   获取账号，以及针对 链切换，账号切换的处理
  useEffect(() => {
    function handleNewAccounts(newAccounts: any) {
      setAccounts(newAccounts)
      setAddress(newAccounts[0])
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      // 查询 初始化 账号accounts
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(handleNewAccounts)
      //   监听账号切换
      window.ethereum.on('accountsChanged', handleNewAccounts)

      //   监听链切换--重载页面
      window?.ethereum.on('chainChanged', (_chainId: string | number) => window.location.reload())
      return () => {
        window.ethereum.off('accountsChanged', handleNewAccounts)
      }
    }
  }, [])

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      // 若是已安装 请求账号
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((newAccounts: any) => setAccounts(newAccounts))
    } else {
      // 若是未安装，则引导安装
      onboarding?.current?.startOnboarding()
    }
  }

  return {
    buttonText,
    btnIsDisabled,
    onClick,
    accounts,
    address,
    setAccounts,
    signer,
    provider
  }

  // return (
  //   <div>
  //     <Button disabled={isDisabled} onClick={onClick}>
  //       {buttonText}
  //     </Button>
  //     <span>账号：{accounts}</span>
  //   </div>
  // )
}
