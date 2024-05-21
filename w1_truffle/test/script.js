var Counter = artifacts.require("Counter");
// 测试脚本 npx truffle test test/script.js --network development
contract("Counter", function (accounts) {
  var counterInstance;
  it("Counter", function () {  // it定义一个测试用例
    return Counter.deployed()
      .then(function (instance) {
        counterInstance = instance;
        return counterInstance.count();
      }).then(function () {
        return counterInstance.counter();
      }).then(function (count) {
        assert.equal(count, 1);  // 满足断言则测试用例通过
      });
  });
});