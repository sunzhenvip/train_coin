const hre = require("hardhat");
const { ethers, network, artifacts } = require("hardhat");



const { writeAbiAddr } = require('./artifact_saver.js');

const prams = process.argv
const value = prams[2]

console.log("Counter deploy with value:", value);

async function main() {
  await hre.run('compile');
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = hre.ethers.utils.parseEther("0.001");

  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  console.log("Lock deployed to:", lock.address);


  let Artifact = await artifacts.readArtifact("Lock");
  await writeAbiAddr(Artifact, lock.address, "Lock", network.name);

  console.log(`Please verify: npx hardhat verify ${lock.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
