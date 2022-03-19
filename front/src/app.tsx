import React, { useCallback, useEffect, useState } from 'react'
import { Row, Col, Input, Button, Modal, message } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import useWeb3Modal from './useWeb3Modal'
import style from './index.module.less'
import { ethers } from 'ethers'
import MyTokenAbi from '../../data/abi/MyToken.json'
import MyTokenAddr from '../../deployments/localhost/MyToken.json'

import { ethErrors, serializeError, getMessageFromCode } from 'eth-rpc-errors'

import VaultAbi from '../../data/abi/Vault.json'
import VaultAddr from '../../deployments/localhost/Vault.json'

import chainConfig from './utils/chainConfig'

export default function App() {
  // console.log('MyTokenAddr', MyTokenAddr, 'VaultAddr', VaultAddr)

  const { buttonText, btnIsDisabled, onClick, address, accounts, setAccounts, signer, provider, chainId } =
    useWeb3Modal()

  const [token, setToken] = useState<ethers.Contract>()

  const [vault, setVault] = useState<ethers.Contract>()

  const [mintNum, setMintNum] = useState<number>()

  const tokenAddr = chainConfig?.[chainId as 5 | 97]?.MyTokenAddr
  const vaultAddr = chainConfig?.[chainId as 5 | 97]?.VaultAddr

  console.log('tokenAddr--', tokenAddr, 'config', chainConfig?.[chainId as 5 | 97]?.VaultAddr, 'chainId', chainId)
  console.log('vaultAddr--', vaultAddr)

  // console.log('--window.ethereum', window.ethereum)

  // 链接已部署合约
  const initDeployedContract = useCallback(async () => {
    console.log('+++++++-tokenAddr', tokenAddr, vaultAddr)

    if (tokenAddr && vaultAddr) {
      console.log('+++++++-tokenAddr', tokenAddr, vaultAddr)
      // 根据不同链的切换，更改相应的合约所在链地址
      setToken(new ethers.Contract(tokenAddr, MyTokenAbi, signer))
      setVault(new ethers.Contract(vaultAddr, VaultAbi, signer))
    }
  }, [tokenAddr, vaultAddr])

  useEffect(() => {}, [])

  useEffect(() => {
    if (!!signer) {
      console.log('initDeployedContract')
      initDeployedContract()
    }
  }, [signer, initDeployedContract])

  const [tokenName, setTokenName] = useState('')
  const [tokenTotalSupply, setTokenTotalSupply] = useState<string>()
  const [balanceOf, setBalanceOf] = useState<string>()

  // 获取token相关信息
  async function getTokenInfo() {
    const tn = await token?.name()
    setTokenName(tn)
    const totalSupply = await token?.totalSupply()
    setTokenTotalSupply(ethers.utils.formatUnits(totalSupply, 18))
    const fBalanceOf = await token?.balanceOf(address)
    setBalanceOf(ethers.utils.formatUnits(fBalanceOf, 18))
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
    token
      ?.transfer(recipient, amount)
      .then((r: any) => {
        console.log('00000rrrr', r) // 返回值不是true
        getTokenInfo()
      })
      .catch((err: any) => {
        console.log('---', err)
        const e = serializeError(err)
        console.log('---e', e)
        if (e?.data) {
          message.error((e?.data as any).originalError?.error?.message)
        } else {
          message.error(getMessageFromCode(e?.code))
        }
        // message.error(getMessageFromCode(e?.code))
      })
  }

  const [depositeAmount, setDepositeAmount] = useState<string>('0')
  const [recipienter, setRecipienter] = useState<string>()
  // 向vault合约deposite
  async function deposite() {
    let amount = ethers.utils.parseUnits(depositeAmount, 18)
    console.log('--amount', amount)
    vault?.deposite(tokenAddr, recipienter, amount)
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
    vault?.withdraw(tokenAddr, withdrawer, amount)
  }

  const [approvalAmount, setApprovalAmount] = useState<string>('0')
  // token授权
  async function approval() {
    let amount = ethers.utils.parseUnits(approvalAmount, 18)
    token?.approve(vaultAddr, amount)
  }

  const [userDeposited, setUserDeposited] = useState<string>('0')
  // 获取vault相关信息
  async function getVaultInfo() {
    const fBalanceOf = await vault?.deposited(tokenAddr, address)
    setUserDeposited(ethers.utils.formatUnits(fBalanceOf, 18))
  }

  useEffect(() => {
    if (token && vault && address) {
      getTokenInfo()
      console.log('getTokenInfo---start')
      getVaultInfo()
    }
  }, [token, vault, address])

  // 不能用事件监听去进行 交易状态的确认。  负载太大，没有哪个provider会提供
  // 监听token事件
  useEffect(() => {
    if (token) {
      console.log('监听token事件')
      // 事件监听-过滤器方式
      let filter = token?.filters.Transfer(address)

      // 事件监听
      // 监听当前区块的token的Transfer事件
      token?.on(filter, (from, to, tokenId, event) => {
        console.log('事件监听', event)
        // 查看后面的事件触发器  Event Emitter 了解事件对象的属性
        console.log(event.blockNumber, event)
        message.success('转账成功')
        getTokenInfo()
      })
    }
  }, [token])

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
          <div>
            <Button disabled={btnIsDisabled} onClick={onClick}>
              {buttonText}
            </Button>
            <span>账号：{address}</span>
          </div>
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
