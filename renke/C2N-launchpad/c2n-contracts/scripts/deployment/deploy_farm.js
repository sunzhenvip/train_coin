const hre = require("hardhat");
const {saveContractAddress, getSavedContractAddresses} = require('../utils')
const {ethers} = require("hardhat");

async function main() {
    const RPS = "1"; // 每秒的一个奖励的一个产生速率
    const timestamp = Math.floor(Date.now() / 1000) + 100;
    console.log("当前时间增加100秒", timestamp);
    // const startTS= 1742482160; // 当前时间增加个100秒左右
    const startTS = timestamp; // 当前时间增加个100秒左右
    // get c2n token address from contract address file
    const c2nTokenAddress = getSavedContractAddresses()[hre.network.name]["C2N-TOKEN"];
    console.log("c2nTokenAddress: ", c2nTokenAddress)

    const farm = await hre.ethers.getContractFactory("FarmingC2N");
    const Farm = await farm.deploy(c2nTokenAddress, ethers.utils.parseEther(RPS), startTS);
    await Farm.deployed();
    console.log("Farm deployed to: ", Farm.address);

    saveContractAddress(hre.network.name, "FarmingC2N", Farm.address);

    // fund the farm
    // approve the farm to spend the token
    const C2N = await hre.ethers.getContractAt("C2NToken", c2nTokenAddress);
    // 奖励的发放要进行一个授权
    const approveTx = await C2N.approve(Farm.address, ethers.utils.parseEther('50000'));
    await approveTx.wait();
    let tx = await Farm.fund(ethers.utils.parseEther('50000'));
    await tx.wait();
    // add lp token
    const lpTokenAddress = getSavedContractAddresses()[hre.network.name]["C2N-TOKEN"];
    // 添加质押池
    await Farm.add(100, lpTokenAddress, true);
    console.log("Farm funded and LP token added");

}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
