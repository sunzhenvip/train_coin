// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


import "../lib/openzeppelin-contracts/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "../lib/openzeppelin-contracts/contracts/interfaces/IERC1820Registry.sol";



interface ERC20Demo {
    /**
     * @dev 调用者账户给`spender`账户授权 `amount`数量代币。
     *
     * 如果成功，返回 `true`.
     *
     * 释放 {Approval} 事件.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev 通过授权机制，从`from`账户向`to`账户转账`amount`数量代币。转账的部分会从调用者的`allowance`中扣除。
     *
     * 如果成功，返回 `true`.
     *
     * 释放 {Transfer} 事件.
     */
    function transferFrom(address from,address to, uint256 amount) external returns (bool);
}


interface TokenRecipient {
    function tokensReceived(address sender, uint amount) external returns (bool);
}

contract Bank is TokenRecipient{
    mapping(address => uint) public deposited; // 记录每个人的值
    address public immutable token; // immutable 修饰的变量不能在声明时赋值，必须在构造函数中初始化

      // keccak256("ERC777TokensRecipient")
    bytes32 constant private TOKENS_RECIPIENT_INTERFACE_HASH =
        0xb281fc8c12954d22544db45de3159a39272895b169a852b314f9cc762e44c53b;

    IERC1820Registry private erc1820 = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);

    constructor(address _token) { // MyERC20 合约地址存入了这里
        token = _token;
        // erc1820.setInterfaceImplementer(address(this), TOKENS_RECIPIENT_INTERFACE_HASH, address(this));

    }


    function deposit(address user, uint amount) public {
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer from error");
        deposited[user] += amount;
    }


    function permitDeposit(address user, uint amount, uint deadline, uint8 v, bytes32 r, bytes32 s) external {
        IERC20Permit(token).permit(msg.sender, address(this), amount, deadline, v, r, s);
        deposit(user, amount);
    }

    // 收款时被回调
    /*function tokensReceived(
        address operator,
        address from,
        address to,
        uint amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) external {
        require(msg.sender == token, "invalid");
        deposited[from] += amount;
    }*/

    // 收款时被回调
    function tokensReceived(address sender, uint amount) external override returns (bool) {
        require(msg.sender == token, "invalid");
        deposited[sender] += amount;
        return true;
    }


}

