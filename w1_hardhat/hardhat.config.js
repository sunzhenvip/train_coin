require("@nomicfoundation/hardhat-toolbox");
// 导入该包需要 安装 dotenv库
const dotenv = require('dotenv')
dotenv.config({ path: "./.env" })

const API_KEY = process.env.INFURA_API_KEY
const PRIVATEKEY = process.env.PRIVATEKEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 31337,
      gas: 12000000,
      accounts: {
        // mnemonic: mnemonic,
      },
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
