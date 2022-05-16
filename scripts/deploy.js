const { ethers, upgrades } = require("hardhat");
const { BN } = require("@openzeppelin/test-helpers");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address", deployer.address);
//updated router adderess with fantom router change this before mainnet deployement
  const RouterAddress = "0xa6AD18C2aC47803E193F75c3677b14BF19B94883";
  const Token = await ethers.getContractFactory("Cult");
  const governanceToken = await ethers.getContractFactory(
    "GovernorBravoDelegate"
  );
  const treasuryContract = await ethers.getContractFactory("Treasury");
  const timeLockContract = await ethers.getContractFactory("Timelock");
  const dCultContract = await ethers.getContractFactory("Dcult");

  const cultToken = await upgrades.deployProxy(Token, [
    deployer.address,
    "6666666666666000000000000000000",
  ]);
  await cultToken.deployed();
  console.log("Cult Token ", cultToken.address);

  const dCultToken = await upgrades.deployProxy(dCultContract, [
    cultToken.address,
    deployer.address,
    100,
    50,
  ]);

  await dCultToken.deployed();

  console.log("dCult Token ", dCultToken.address);

  const treasury = await upgrades.deployProxy(treasuryContract, [
    cultToken.address,
    RouterAddress,
  ]);
  await treasury.deployed();
  console.log("Treasury Token ", treasury.address);

  const timelock = await upgrades.deployProxy(timeLockContract, [
    deployer.address,
    7200,
  ]);
  await timelock.deployed();
  console.log("Timelock Token ", timelock.address);

  const governance = await upgrades.deployProxy(governanceToken, [
    timelock.address,
    dCultToken.address,
    32500,
    1,
    "60000000000000000000000",
    treasury.address,
  ]);
  console.log("Governance Token ", governance.address);
}

main();
