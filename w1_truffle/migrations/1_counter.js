const Counter = artifacts.require("Counter");

// 这个是部署脚本 可以部署到正式网络 也可以部署到测试网络
module.exports = function (deployer) {
  deployer.deploy(Counter, 0).then((instance) => {
    console.log("合约地址 Deployed contract address:", instance.address);
  });
};
