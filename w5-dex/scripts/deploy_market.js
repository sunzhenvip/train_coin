let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');

async function main() {
    // await run('compile');
    let [owner, second] = await ethers.getSigners();

    let Token = await ethers.getContractFactory("Token");
    let aAmount = ethers.utils.parseUnits("100000", 18);
    let atoken = await Token.deploy(
        "AToken",
        "AToken",
        aAmount);

    await atoken.deployed();
    console.log("AToken:" + atoken.address);

    let MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");

    /**
     前置条件
     v2-periphery> npx hardhat run scripts/01_deploy_router.js --network dev
     Compiled 33 Solidity files successfully (evm target: istanbul).
     factoryAddr:  0x5FbDB2315678afecb367f032d93F642f64180aa3
     WETH address:  0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
     Exported deployments into xxx\uniswap\v2-periphery\deployments\dev\WETH.json
     Router address:  0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
     Exported deployments into xxx\uniswap\v2-periphery\deployments\dev\Router.json
     PS xxx\uniswap\v2-periphery>
     */
    /**
     完成测试
     w5-dex> npx hardhat run scripts/deploy_market.js --network dev
     Compiled 16 Solidity files successfully
     AToken:0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
     market:0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
     添加流动性
     持有token:0.0
     购买到:9066.108938801491315813
     PS D:\network\web3\denglian-blockchain\training_camp_2\w5-dex>
     */
    let routerAddr = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    let wethAddr = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    let market = await MyTokenMarket.deploy(
        atoken.address,
        routerAddr,
        wethAddr,
    );

    await market.deployed();
    console.log("market:" + market.address);

    // 调用者账户 给 指定账户 账户授权 `amount`数量代币
    // 用户授权指定合约地址，允许合约代表用户从用户的账户中转账最多 tokenAmount 个代币。
    await atoken.approve(market.address, ethers.constants.MaxUint256);

    let ethAmount = ethers.utils.parseUnits("100", 18);
    await market.AddLiquidity(aAmount, { value: ethAmount })
    console.log("添加流动性");

    let b = await atoken.balanceOf(owner.address);
    console.log("持有token:" + ethers.utils.formatUnits(b, 18));

    let buyEthAmount = ethers.utils.parseUnits("10", 18);
    out = await market.buyToken("0", { value: buyEthAmount })

    b = await atoken.balanceOf(owner.address);
    console.log("购买到:" + ethers.utils.formatUnits(b, 18));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });