//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IUniswapV2Router01.sol";
import "./IMasterChef.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
   通过合约添加流动性与购买
*/
contract MyTokenMarket {
    // 是一个为 Solidity 智能合约提供的安全库，专门用于与 ERC20 代币进行交互。它的主要目的是增强合约的安全性，防止潜在的漏洞，如重入攻击
    using SafeERC20 for IERC20;

    address public myToken;
    address public router;
    address public weth;

    constructor(address _token, address _router, address _weth) {
        myToken = _token;
        router = _router;
        weth = _weth;
    }

    // 添加流动性
    function AddLiquidity(uint tokenAmount) public payable {
        // 授权合约从用户账户转账 tokenAmount 个代币 是否应该增加这一句
        // IERC20(myToken).approve(address(this), tokenAmount); 这一句 不在这里用 让用户授权合约，允许合约代表用户进行代币转账
        // safeTransferFrom  和 safeApprove 是这个库提供的两个核心函数，
        // 它们是对 ERC20 标准中 transferFrom 和 approve 函数的更安全的封装。
        // token 从用户手里面转入合约里面
        IERC20(myToken).safeTransferFrom(msg.sender, address(this), tokenAmount);
        // 授权 router 可以用 这个合约的token 指定的数量
        IERC20(myToken).safeApprove(router, tokenAmount);

        // ingnore slippage
        // (uint amountToken, uint amountETH, uint liquidity) = 
        IUniswapV2Router01(router).addLiquidityETH{value: msg.value}(myToken, tokenAmount, 0, 0, msg.sender, block.timestamp);

        //TODO: handle left
    }

    // 用 ETH 购买 Token
    function buyToken(uint minTokenAmount) public payable {
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = myToken;
        // 1、swapExactETHForTokens 第一种兑换方式 2、第二种在池子里面交互 UniswapV2Pair
        IUniswapV2Router01(router).swapExactETHForTokens{value: msg.value}(minTokenAmount, path, msg.sender, block.timestamp);
    }


}