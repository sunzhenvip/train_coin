
1、运行环境
    在当前目录下执行 npx hardhat node
2、部署合约脚本
    npx hardhat run scripts/01_deploy_factory.js --network dev
3、合约脚本返回内容
    UniswapV2Factory address:  0x5FbDB2315678afecb367f032d93F642f64180aa3
    Exported deployments into xxx\uniswap\v2-core\deployments\dev\UniswapV2Factory.json
    UniswapV2Factory code hash:  0x8897f1f34a81ee48d6fc425cd4779b617ea39c85f865509de3475880494a68b5
    UniswapV2Factory address:  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
    Exported deployments into xxx\uniswap\v2-core\deployments\dev\UniswapV2Factory2.json

4、获取 code hash
     UniswapV2Factory code hash:  0x8897f1f34a81ee48d6fc425cd4779b617ea39c85f865509de3475880494a68b5
     给 uniswap\v2-periphery\contracts\libraries\UniswapV2Library.sol 25替换改哈希值

5、配置v2-periphery一起使用

6、进入v2-periphery执行
    npx hardhat run scripts/01_deploy_router.js --network dev

7、返回内容
    factoryAddr:  0x5FbDB2315678afecb367f032d93F642f64180aa3
    WETH address:  0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
    Exported deployments into D:\network\web3\denglian-blockchain\train_coin\uniswap\v2-periphery\deployments\dev\WETH.json
    Router address:  0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
    Exported deployments into D:\network\web3\denglian-blockchain\train_coin\uniswap\v2-periphery\deployments\dev\Router.json