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
        IERC20(myToken).safeTransferFrom(msg.sender, address(this),tokenAmount);
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
        IUniswapV2Router01(router).swapExactETHForTokens{value : msg.value}(minTokenAmount, path, msg.sender, block.timestamp);
    }




}