farm:
	@npx hardhat compile
	@npx hardhat run --network local scripts/deployment/deploy_boba_token.js
	@npx hardhat run --network local scripts/deployment/deploy_c2n_token.js
	@npx hardhat run --network local scripts/deployment/deploy_airdrop_c2n.js
	# 部署这个合约要注意修改启动的一个时间节点
	@npx hardhat run --network local scripts/deployment/deploy_farm.js
ido:
	@npx hardhat compile
	@npx hardhat run --network local scripts/deployment/deploy_boba_token.js
	@npx hardhat run --network local scripts/deployment/deploy_c2n_token.js
	@npx hardhat run --network local scripts/deployment/deploy_airdrop_c2n.js
	@npx hardhat run --network local scripts/deployment/deploy_singletons.js
	@npx hardhat run --network local scripts/deployment/deploy_mock_token.js
sales:
	@npx hardhat run --network local scripts/deployment/deploy_sales.js
deposit:
	@npx hardhat run --network local scripts/deployment/depositToken.js
node:
	@npx hardhat node
runtest:
	@npx hardhat test
upgrades:
	@npx hardhat run --network local scripts/deployment/upgrades.js