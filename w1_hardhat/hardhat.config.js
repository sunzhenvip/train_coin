require("@nomicfoundation/hardhat-toolbox");
require("./task/balance.js");
// 导入该包需要 安装 dotenv库
const dotenv = require('dotenv')
dotenv.config({ path: "./.env" })

const API_KEY = process.env.INFURA_API_KEY
const PRIVATEKEY = process.env.PRIVATEKEY


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  console.log("x123123");

  for (const account of accounts) {
    console.log(account.address);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    // npx hardhat run ./scripts/deploy.js --network localdev
    localdev: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      gas: 12000000,
      accounts:["0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"],
      // accounts: {
      //   // mnemonic: mnemonic,
      // },
    },
    goerli: {
      url: "https://eth-goerli.api.onfinality.io/public",
      // accounts: [PRIVATE_KEY1],
      chainId: 5,
    },
    // npx hardhat run ./scripts/deploy.js --network sepolia
    // 部署成功之后 访问该网站 查看部署信息 https://sepolia.etherscan.io/ 
    sepolia: {
      url: `https://sepolia.infura.io/v3/${API_KEY}`,
      accounts:[PRIVATEKEY],
      // accounts: {
      //   // mnemonic: mnemonic,
      // },
      // chainId: 80001,
    },
  }
};
