import React, { useCallback, useEffect, useState } from 'react'
import { Row, Col, Input, Button, Modal, message } from 'antd'
import style from './index.module.less'

export default function AppNew() {
  // const loadWeb3Modal = useCallback(async () => {
  //     const provider = await web3Modal.connect();
  //     setInjectedProvider(new ethers.providers.Web3Provider(provider));

  //     provider.on("chainChanged", chainId => {
  //       console.log(`chain changed to ${chainId}! updating providers`);
  //       setInjectedProvider(new ethers.providers.Web3Provider(provider));
  //     });

  //     provider.on("accountsChanged", () => {
  //       console.log(`account changed!`);
  //       setInjectedProvider(new ethers.providers.Web3Provider(provider));
  //     });

  //     // Subscribe to session disconnection
  //     provider.on("disconnect", (code, reason) => {
  //       console.log(code, reason);
  //       logoutOfWeb3Modal();
  //     });
  //     // eslint-disable-next-line
  //   }, [setInjectedProvider]);

  return <div className={style.global}></div>
}
