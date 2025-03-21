const hre = require("hardhat");
const {ethers, upgrades} = require("hardhat");
const {saveContractAddress, getSavedContractAddresses} = require('../utils')
const config = require('../configs/config.json');
// const yesno = require('yesno');


async function getCurrentBlockTimestamp() {
    return (await ethers.provider.getBlock('latest')).timestamp;
}

async function sleep(number) {
    return new Promise((resolve) => {
        setTimeout(resolve, number);
    });
}

async function main() {

    const c = config[hre.network.name];
    const contracts = getSavedContractAddresses()[hre.network.name];

    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";


    const Admin = await ethers.getContractFactory("Admin");
    console.log("ready to deploy admin")

    const admin = await Admin.deploy(c.admins);
    await admin.deployed();
    console.log("Admin contract deployed to: ", admin.address);
    saveContractAddress(hre.network.name, "Admin", admin.address);


    console.log("ready to deploy salesFactory ")
    const SalesFactory = await ethers.getContractFactory("SalesFactory");
    const salesFactory = await SalesFactory.deploy(admin.address, ZERO_ADDRESS);
    await salesFactory.deployed();
    saveContractAddress(hre.network.name, "SalesFactory", salesFactory.address);
    console.log('Sales factory deployed to: ', salesFactory.address);


    console.log("ready to deploy AllocationStaking ")
    const currentTimestamp = await getCurrentBlockTimestamp();
    console.log('Farming starts at: ', currentTimestamp);
    const AllocationStaking = await ethers.getContractFactory("AllocationStaking");
    const allocationStaking = await upgrades.deployProxy(AllocationStaking, [
            contracts["C2N-TOKEN"],
            ethers.utils.parseEther(c.allocationStakingRPS),
            currentTimestamp + c.delayBeforeStart,
            salesFactory.address
        ], {unsafeAllow: ['delegatecall']}
    );
    await allocationStaking.deployed()
    console.log('AllocationStaking Proxy deployed to:', allocationStaking.address);
    saveContractAddress(hre.network.name, 'AllocationStakingProxy', allocationStaking.address);

    let proxyAdminContract = await upgrades.admin.getInstance();
    saveContractAddress(hre.network.name, 'ProxyAdmin', proxyAdminContract.address);
    console.log('Proxy Admin address is : ', proxyAdminContract.address);

    console.log("ready to setAllocationStaking params ")
    await salesFactory.setAllocationStaking(allocationStaking.address);
    console.log(`salesFactory.setAllocationStaking ${allocationStaking.address} done.;`);

    const totalRewards = ethers.utils.parseEther(c.initialRewardsAllocationStaking);

    const token = await hre.ethers.getContractAt('C2NToken', contracts['C2N-TOKEN']);

    console.log("ready to approve ", c.initialRewardsAllocationStaking, " token to staking  ")
    await token.approve(allocationStaking.address, totalRewards);
    console.log(`token.approve(${allocationStaking.address}, ${totalRewards.toString()});`)

    console.log("ready to add c2n to pool")
    // add c2n to pool
    await allocationStaking.add(100, token.address, true);
    console.log(`allocationStaking.add(${token.address});`)

    console.log("ready to add boba to pool")
    // add boba to pool
    await allocationStaking.add(100, contracts["BOBA-TOKEN"], true);
    console.log(`allocationStaking.add(${contracts["BOBA-TOKEN"]});`)


    console.log("ready to fund 500000 token for testing")
    // Fund only 50000 tokens, for testing
    // sleep(5000)
    await sleep(5000)
    await allocationStaking.fund(ethers.utils.parseEther('500000'));
    console.log('Funded 500000 tokens')

}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
