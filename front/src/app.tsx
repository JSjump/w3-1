import React, { useCallback, useEffect, useState } from 'react'
import { Row, Col, Input, Button } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import style from './index.module.less'
import { ethers } from 'ethers'

import MyTokenAbi from '../../data/abi/MyToken.json'
import MyTokenAddr from '../../deployments/localhost/MyToken.json'

import VaultAbi from '../../data/abi/Vault.json'
import VaultAddr from '../../deployments/localhost/Vault.json'

export default function App() {
  console.log('MyTokenAddr', MyTokenAddr, 'VaultAddr', VaultAddr)
  const [account, setAccount] = useState()

  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>()
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()

  const [token, setToken] = useState<ethers.Contract>()

  const [vault, setVault] = useState<ethers.Contract>()

  const [mintNum, setMintNum] = useState<number>()

  // connect wallet
  async function connectWallet() {
    await initAccount()
  }

  // 初始化 provider,singner
  async function initProviderOrSigner() {
    const tempProvider = new ethers.providers.Web3Provider(window.ethereum)
    // console.log(
    //   'window.ethereum',
    //   window.ethereum,
    //   'tempProvider',
    //   tempProvider,
    //   'tempProvider.getSigner()',
    //   tempProvider.getSigner()
    // )
    setProvider(tempProvider)
    setSigner(tempProvider.getSigner())
  }

  useEffect(() => {
    console.log('--account', account)
    if (!!account) {
      initProviderOrSigner()
    }
  }, [account])

  useEffect(() => {
    if (!!provider && !!signer) {
      initDeployedContract()
    }
  }, [provider, signer])

  // 初始化账号
  async function initAccount() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!')
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const curAccount = accounts?.[0]
        setAccount(curAccount)
        // await initProviderOrSigner()
        // await initDeployedContract()
        //  获取合约中相关信息
        // await getTokenInfo()
      }
    } catch (e) {
      console.log('初始化失败', e)
    }
  }

  // 链接已部署合约
  async function initDeployedContract() {
    // setVault(new ethers)

    let network = await provider?.getNetwork()
    let chainId = network?.chainId
    console.log('network', network, 'chainId:', chainId)

    const ecMt = new ethers.Contract(MyTokenAddr.address, MyTokenAbi, signer)
    console.log('account', account, 'signer', signer, 'provider', provider)
    setToken(new ethers.Contract(MyTokenAddr.address, MyTokenAbi, signer))
    setVault(new ethers.Contract(VaultAddr.address, VaultAbi, signer))
  }

  const [tokenName, setTokenName] = useState('')
  const [tokenTotalSupply, setTokenTotalSupply] = useState<string>()
  const [balanceOf, setBalanceOf] = useState<string>()

  // 获取token相关信息
  async function getTokenInfo() {
    console.log('getTokenInfo')
    const tn = await token?.name()
    setTokenName(tn)
    console.log('getTokenInfo', tn)
    const totalSupply = await token?.totalSupply()
    setTokenTotalSupply(ethers.utils.formatUnits(totalSupply, 18))
    const fBalanceOf = await token?.balanceOf(account)
    setBalanceOf(ethers.utils.formatUnits(fBalanceOf, 18))

    console.log('tn', tn, '-totalSupply', totalSupply, 'fBalanceOf', fBalanceOf)
  }

  // console.log()
  // 增发操作
  async function mint() {
    let amount = ethers.utils.parseUnits(`${mintNum}`, 18)
    console.log('--amount', amount)
    token?.mint(amount)
    getTokenInfo()
  }

  const [recipient, setRecipient] = useState<string>()
  const [transferAmount, setTransferAmount] = useState<string>('0')
  // 转账
  async function transfer() {
    let amount = ethers.utils.parseUnits(transferAmount, 18)
    console.log('--amount', amount)
    token?.transfer(recipient, amount).then((r: any) => {
      console.log(r) // 返回值不是true
      getTokenInfo()
    })
  }

  const [depositeAmount, setDepositeAmount] = useState<string>('0')
  const [recipienter, setRecipienter] = useState<string>()
  // 向vault合约deposite
  async function deposite() {
    let amount = ethers.utils.parseUnits(depositeAmount, 18)
    console.log('--amount', amount)
    vault?.deposite(MyTokenAddr.address, recipienter, amount)
    // .then((r: any) => {
    //   console.log(r) // 返回值不是true
    //   getTokenInfo()
    // })
  }

  const [withdrawAmount, setWithdrawAmount] = useState<string>('0')
  const [withdrawer, setWithdrawer] = useState<string>()
  // 提取存款
  async function withdraw() {
    let amount = ethers.utils.parseUnits(withdrawAmount, 18)
    console.log('--amount', amount)
    vault?.withdraw(MyTokenAddr.address, withdrawer, amount)
  }

  const [approvalAmount, setApprovalAmount] = useState<string>('0')
  // token授权
  async function approval() {
    let amount = ethers.utils.parseUnits(approvalAmount, 18)
    token?.approve(VaultAddr.address, amount)
  }

  const [userDeposited, setUserDeposited] = useState<string>('0')
  // 获取vault相关信息
  async function getVaultInfo() {
    const fBalanceOf = await vault?.deposited(MyTokenAddr.address, account)
    setUserDeposited(ethers.utils.formatUnits(fBalanceOf, 18))
  }

  useEffect(() => {
    if (token && vault) {
      getTokenInfo()
      console.log('getTokenInfo---start')
      getVaultInfo()
    }
  }, [token, vault])

  return (
    <div className={style.global}>
      <Row justify='center' gutter={20}>
        <Col>
          ohohoh,发现世界！！
          <GithubOutlined />
        </Col>
      </Row>

      <Row justify='center' gutter={20}>
        <Col>
          {!account && (
            <Button onClick={connectWallet} type='primary'>
              链接wallet
            </Button>
          )}
        </Col>

        <Col>
          {!!account && (
            <div style={{ background: '#79b473' }}>
              <span>当前账户</span>
              <span>{account || '-----'}</span>
            </div>
          )}
        </Col>
      </Row>
      <Row justify='center' gutter={20}>
        <Col>
          <span>
            tokenName:
            <span>{tokenName || '暂无'}</span>
          </span>
        </Col>
        <Col>
          <div>
            当前token总供应量：
            <span>{tokenTotalSupply || '--'}</span>
          </div>
        </Col>
      </Row>

      <Row justify='center' gutter={20}>
        <Col>
          <span>增发数量：</span>
        </Col>
        <Col>
          <Input type='number' value={mintNum} onChange={(e) => setMintNum(Number(e.target.value || 0))}></Input>
        </Col>
        <Col>
          <div style={{ marginLeft: '20px' }}>
            <Button type='primary' onClick={() => mint()}>
              增发
            </Button>
          </div>
        </Col>
      </Row>

      <Row justify='center' gutter={20}>
        <Col>
          <div>
            当前账户token余额：
            <span>{balanceOf || '--'}</span>
          </div>
        </Col>
      </Row>

      <Row justify='center' gutter={20}>
        <Col>
          <span>转账</span>
        </Col>
        <Col>
          <Input
            type='number'
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value || '0')}
          ></Input>
        </Col>
        <Col>
          <span>到</span>
        </Col>
        <Col>
          <Input value={recipient} onChange={(e) => setRecipient(e.target.value)}></Input>
        </Col>
        <Col>
          <div style={{ marginLeft: '20px' }}>
            <Button type='primary' onClick={() => transfer()}>
              转账
            </Button>
          </div>
        </Col>
      </Row>

      <div style={{ marginTop: '60px' }}>
        <Row justify='center'>
          <Col>
            <div style={{ background: '#ccc', fontSize: '22px' }}>保险库</div>
          </Col>
        </Row>

        <Row justify='center'>
          <Col>
            用户存款金额：
            <span>{userDeposited || '--'}</span>
          </Col>
        </Row>

        <div>
          <Row justify='center'>
            <Col>
              <Row>
                <Col>
                  <span>授权数量</span>
                </Col>
                <Col>
                  <Input value={approvalAmount} onChange={(e) => setApprovalAmount(e.target.value)}></Input>
                </Col>
              </Row>
            </Col>
            <Col>
              <Button type='primary' onClick={() => approval()}>
                approval
              </Button>
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: '20px' }}></div>

        <Row justify='center'>
          <Col>
            <Row>
              <Col>
                <span>数量</span>
              </Col>
              <Col>
                <Input value={depositeAmount} onChange={(e) => setDepositeAmount(e.target.value)}></Input>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col>
                <span>收款人</span>
              </Col>
              <Col>
                <Input value={recipienter} onChange={(e) => setRecipienter(e.target.value)}></Input>
              </Col>
            </Row>
          </Col>
          <Col>
            <Button type='primary' onClick={() => deposite()}>
              deposite
            </Button>
          </Col>
        </Row>
        <div style={{ marginTop: '20px' }}></div>
        <Row justify='center'>
          <Col>
            <Row>
              <Col>
                <span>数量</span>
              </Col>
              <Col>
                <Input value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)}></Input>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col>
                <span>提取人</span>
              </Col>
              <Col>
                <Input value={withdrawer} onChange={(e) => setWithdrawer(e.target.value)}></Input>
              </Col>
            </Row>
          </Col>
          <Col>
            <Button type='primary' onClick={() => withdraw()}>
              withdraw
            </Button>
          </Col>
        </Row>
      </div>

      <div></div>
    </div>
  )
}
