//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "../lib/openzeppelin-contracts/contracts/utils/Address.sol";

interface TokenRecipient {
    function tokensReceived(address sender, uint amount) external returns (bool);
}

contract MyERC20Callback is ERC20 {
    using Address for address;

    constructor() ERC20("MyERC20", "MyERC20") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }

    // 这个实现方式与 ERC-777 的回调思想类似，但它是基于 ERC-20 的自定义扩展，不依赖 ERC-777 的标准实现
    function transferWithCallback(address recipient, uint256 amount) external returns (bool) {
        _transfer(msg.sender, recipient, amount);

        // 这个接口定义了一个函数 tokensReceived，当代币被转移到一个合约地址时，这个函数会被调用。
        // 接收合约需要实现这个接口，才能参与回调逻辑。
        if (recipient.isContract()) {
            bool rv = TokenRecipient(recipient).tokensReceived(msg.sender, amount);
            require(rv, "No tokensReceived");
        }

        return true;
    }


}