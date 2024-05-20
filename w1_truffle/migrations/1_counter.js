const Counter = artifacts.require("Counter");

module.exports = function (deployer) {
  deployer.deploy(Counter, 2).then((instance) => {
    console.log("合约地址 Deployed contract address:", instance.address);
  });
};
