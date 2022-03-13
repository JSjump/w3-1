W3_1 作业

- 发⾏⼀个 ERC20 Token：
  - 可动态增发（起始发⾏量是 0）
  - 通过 ethers.js. 调⽤合约进⾏转账
- 编写⼀个 Vault 合约：
  - 编写 deposite ⽅法，实现 ERC20 存⼊ Vault，并记录每个⽤户存款⾦额 ， ⽤从前端调⽤（Approve，transferFrom）
  - 编写 withdraw ⽅法，提取⽤户⾃⼰的存款 （前端调⽤）
  - 前端显示⽤户存款⾦额

# 答案：

1.发行一个 erc20token:
链接：https://goerli.etherscan.io/tx/0xb95be9c19fe70645211adb7791d3760524aafef6e18136d86c52e198990c3edd
erc20token
合约地址：
0xe9b3705d85eb1d87C464FB73578671226fE27755

1-1 动态增发：
交易链接：
https://goerli.etherscan.io/tx/0x7b139e867aa61fdf54b6d79bddd30bad52de81c8a83cbf56bec0fea8d645c4ca

1-2 通过 ether.js 调用合约进行转账：
交易链接：
https://goerli.etherscan.io/tx/0x9f38422dad56360e8cc67e76e87335d6f5c1514dfa2b47665da56ad2e7eeafdb

2.发行 vault 合约
链接：https://goerli.etherscan.io/tx/0xd2eff558b918a8661e7dff4efcb23d02ac7a2e47e6caab8aad72cae66bc93bee
合约地址：
0x4e5b2FC19Ac24bb6272eA4A029c7396104aF5A9B
2-1:
approve 交易链接：
https://goerli.etherscan.io/tx/0x3a1565e5bf996d47408537f32d2fe7022650642e4486241f18fac0aaf432f69d

deposite (transferFrom)交易链接：
https://goerli.etherscan.io/tx/0x6ad5a0700e7cb585dfd9e0e49ee7fa790b0f31d24d5b573720a79080afebf9b2

2-2:
withdraw 提取存款 交易链接：
https://goerli.etherscan.io/tx/0x9c9531dd8bddac5b5f8feb3fd1ba1ae817d03bf687bc8d32c876b26537d6a134

3-3:
前端显示⽤户存款⾦额：
![metamask](https://github.com/JSjump/w3-1/blob/master/imgs/1.png?raw=true)
