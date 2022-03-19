//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MyToken.sol";


contract Vault {
    // 记录不同币种的 账户余额
    mapping(address => mapping(address => uint256)) public deposited;


    event DepositeSuccess(address indexed coin_, address from_, address to_,uint256 num_);

    event WithdrawSuccess(address indexed coin_, address from_, address to_,uint256 num_);

    // 获取创建字节码
    function getCreationCode()external pure returns (bytes memory){
        return type(MyToken).creationCode;
    }

    // 储存
    function deposite(address coin_,address user_,uint256 num_) public {
        require(IERC20(coin_).transferFrom(user_, address(this), num_),"transferError");
        deposited[coin_][user_] += num_;
        emit DepositeSuccess(coin_,user_,address(this),num_);
    }

    //提取
    function withdraw(address coin_,address user_,uint256 num_) public {
        require(deposited[coin_][user_] >= num_,"insufficient allowance");
        deposited[coin_][user_] -= num_;
        require(IERC20(coin_).transfer( user_, num_),"withdrawsError");
        emit WithdrawSuccess(coin_,user_,address(this),num_);
    }
}
